"use server";
import { uploadFile } from './uploadFile';
import prisma from "@/lib/db";
import { checkPostForTrends } from '@/utils';
import { currentUser } from "@clerk/nextjs/server";
import { connect } from 'http2';

export const createPost = async (post) => {
    try {
        const { postText, media } = post;
        const user = await currentUser();

        if (!user?.id) {
            throw new Error("Not authenticated");
        }

        let cld_id: string | null = null;
        let assetUrl: string | null = null;

        if (media) {
            const res = await uploadFile(media, `/posts/${user?.id}`);
            if (!res?.public_id || !res?.secure_url) {
                throw new Error("File upload failed");
            }
            cld_id = res.public_id;
            assetUrl = res.secure_url;
        }

        const newPost = await prisma.post.create({
            data: {
                postText,
                media: assetUrl,
                cld_id,
                author: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        const trends = checkPostForTrends(postText)

        if (trends.length > 0) {
            createTrends(trends, newPost.id)
        }

        return {
            data: newPost
        }

    } catch (error) {
        console.log("Error creating post: ", error);
        throw new Error("Error creating post");
    }
}

export const getMyFeedPosts = async (lastCursor?: string) => {
    try {
        const take = 5

        const posts = await prisma.post.findMany({
            include: {
                author: true,
                likes: true,
                comments: {
                    include: {
                        author: true
                    }
                }
            },
            take,
            ...(lastCursor && {
                skip: 1, // Skip the cursor itself
                cursor: {
                    id: lastCursor
                }
            }),
            orderBy: { createdAt: 'desc' }
        });

        if (posts.length === 0) {
            return {
                data: [],
                metadata: {
                    lastCursor: null,
                    hasMore: false
                }
            }
        }
        const lastPostInResult = posts[posts.length - 1];
        const cursor = lastPostInResult.id;
        const morePosts = await prisma.post.findMany({
            skip: 1,
            take,
            cursor: {
                id: cursor
            },
            orderBy: { createdAt: 'desc' }
        })
        return {
            data: posts,
            metadata: {
                lastCursor: cursor,
                hasMore: morePosts.length > 0
            }
        }
    } catch (error) {
        console.log("Error fetching posts: ", error);
        throw new Error("Error fetching posts");
    }
}

export const updatePostLike = async (params) => {
    const { postId, actionType } = params
    try {
        const { id: userId } = await currentUser();

        // find post in the db
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                likes: true
            }
        })

        if (!post) {
            return {
                error: "Post not found",
            }
        }

        // check if user has already liked the post or not
        const like = post.likes.find((like) => like.authorId === userId);
        if (like) {
            if (actionType === 'like') {
                return {
                    data: post
                }
            } else {
                await prisma.like.delete({
                    where: {
                        id: like.id
                    }
                })
                console.log("like deleted")
            }
        } else {
            if (actionType === 'unlike') {
                return {
                    data: post
                }
            } else {
                await prisma.like.create({
                    data: {
                        post: {
                            connect: {
                                id: postId
                            }
                        },
                        author: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                })
            }
        }

        const updatedPost = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                likes: true,
            }
        })

        return {
            data: updatedPost
        }

    } catch (error) {
        console.log(error);
        throw new Error("Failed to update the post likes");
    }
}

export const addComment = async (postId, comment) => {
    try {
        const { id: userId } = await currentUser();
        const newComment = await prisma.comment.create({
            data: {
                comment,
                post: {
                    connect: {
                        id: postId
                    }
                },
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return {
            data: newComment
        }
    } catch (e) {
        console.log(e);
        throw new Error("Failed to add comment");
    }
}

export const createTrends = async (trends, postId) => {
    try {
        const newTrends = await prisma.trend.createMany({
            data: trends.map((trend) => ({
                name: trend,
                postId: postId,
            })),
        });
        return {
            data: newTrends,
        };
    } catch (e) {
        throw e;
    }
};

export const getPopularTrends = async () => {
    try {
        const trends = await prisma.trend.groupBy({
            by: ["name"],
            _count: {
                name: true,
            },
            orderBy: {
                _count: {
                    name: "desc",
                },
            },
            take: 3,
        });
        return {
            data: trends,
        };
    } catch (e) {
        throw e;
    }
};

export const deletePost = async (postId) => {
    try {
        const { id: userId } = await currentUser();
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (post.authorId !== userId) {
            return {
                error: "You are not authorized to delete this post",
            };
        }
        await prisma.post.delete({
            where: {
                id: postId,
            },
        });
        return {
            data: "Post deleted",
        };
    } catch (e) {
        throw e;
    }
};