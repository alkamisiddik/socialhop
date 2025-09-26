// app/actions/user.ts
"use server";

import prisma from "@/lib/db";
import { deleteFile, uploadFile } from "./uploadFile";
import { currentUser } from "@clerk/nextjs/server";

// create or update user
export const upsertUser = async (clerkUser: any) => {
  try {
    const {
      id,
      first_name,
      last_name,
      image_url,
      username,
      email_addresses,
    } = clerkUser;

    // Clerk sends email_addresses as an array
    const email_address = email_addresses?.[0]?.email_address ?? null;

    const user = await prisma.user.upsert({
      where: { id },
      update: {
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      },
      create: {
        id,
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      },
    });

    return { data: user, message: "User upserted successfully" };
  } catch (e) {
    console.error("upsertUser error:", e);
    return { error: "Failed to upsert user" };
  }
};

export const getUser = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email_address: true,
        image_url: true,
        username: true,
        banner_url: true,
        banner_id: true,
      },
    });
    return { data: user };
  } catch (e) {
    console.error("getUser error:", e);
    return { error: "Failed to fetch user" };
  }
};

export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({ where: { id } });
    return { message: "User deleted in db" };
  } catch (e) {
    console.error("deleteUser error:", e);
    return { error: "Failed to delete user" };
  }
};

export const updateBanner = async (params) => {
  const { id, banner, prevBannerId } = params;
  try {
    let banner_id;
    let banner_url;

    if (banner) {
      const res = await uploadFile(banner, `/users/${id}`);
      const { public_id, secure_url } = res;
      banner_id = public_id;
      banner_url = secure_url;

      // Delete previous banner
      if (prevBannerId) {
        await deleteFile(prevBannerId);
      }
    }
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        banner_url,
        banner_id,
      },
    });
    console.log("user banner updated");
  } catch (e) {
    console.log("Error updating user banner");
    throw e;
  }
};

export const updateFollow = async (params) => {
  const { id, type } = params;
  // type = follow or unfollow, id is target user id
  try {
    const loggedInUser = await currentUser();
    if (type === "follow") {
      await prisma.follow.create({
        data: {
          follower: {
            connect: {
              id: loggedInUser.id,
            },
          },
          following: {
            connect: {
              id,
            },
          },
        },
      });
      console.log("User followed");
    } else if (type === "unfollow") {
      await prisma.follow.deleteMany({
        where: {
          followerId: loggedInUser.id,
          followingId: id,
        },
      });
      console.log("User unfollowed");
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getAllFollowersAndFollowings = async (id) => {
  try {
    const followers = await prisma.follow.findMany({
      where: {
        followingId: id,
      },
      include: {
        follower: true,
      },
    });
    const following = await prisma.follow.findMany({
      where: {
        followerId: id,
      },
      include: {
        following: true,
      },
    });
    return {
      followers,
      following,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getFollowSuggestions = async () => {
  try {
    const loggedInUser = await currentUser();
    // Fetch all users that the given user is already following
    const following = await prisma.follow.findMany({
      where: {
        followerId: loggedInUser?.id,
      },
    });

    // Extract the IDs of the users that the given user is already following
    const followingIds = following.map((follow) => follow.followingId);

    // Fetch all users that the given user is not already following
    const suggestions = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: loggedInUser?.id } }, // Exclude the user themselves
          { id: { notIn: followingIds } }, // Exclude users they're already following
        ],
      },
    });

    return suggestions;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
