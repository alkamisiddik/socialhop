"use server";

import { db } from "@/lib/db";

export const createUser = async (user) => {
  const { id, first_name, last_name, email_address, image_url, username } = user;
  try {
    const userExists = await db.user.findUnique({ where: { id } });

    if (userExists) {
      await updateUser(user);
      return { message: "User updated in db" };
    }

    await db.user.create({
      data: { id, first_name, last_name, email_address, image_url, username },
    });

    return { message: "New user created in db" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to save new user in db" };
  }
};

export const updateUser = async (user) => {
  const { id, first_name, last_name, email_address, image_url, username } = user;
  try {
    await db.user.update({
      where: { id },
      data: { first_name, last_name, email_address, image_url, username },
    });
    return { message: "User updated in db" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update user in db" };
  }
};

export const getUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
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
    console.error(e);
    return { error: "Failed to fetch user" };
  }
};

export const deleteUser = async (id: string) => {
  try {
    await db.user.delete({ where: { id } });
    return { message: "User deleted in db" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to delete user in db" };
  }
};
