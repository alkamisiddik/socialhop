"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const createPost = async (post) => {
    try {
        const { postText, media } = post;
        const user = await currentUser();

        const newPost = await db.post.create({
            data: {
                postText,
                author: {
                    connect: {
                        id: user?.id
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