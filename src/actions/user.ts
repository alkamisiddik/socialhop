// app/actions/user.ts
"use server";

import prisma from "@/lib/db";

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
