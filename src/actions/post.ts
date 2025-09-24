"use server";
import { uploadFile } from './uploadFile';
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

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
        console.log("Post created: ", newPost);
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

        console.log(posts);

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