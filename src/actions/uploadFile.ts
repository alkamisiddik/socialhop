'use server';

import { cld } from "@/lib/cloudinary";
import { error } from "console";

export const uploadFile = async (file: File, folder: string) => {
    try {
        const res = cld.v2.uploader.upload(
            file,
            {
                folder: `socialhop/${folder}`,
                resource_type: "auto"
            },
            (error, result) => {
                if (error) {
                    console.log("Error uploading file: ", error);
                } else {
                    console.log("File uploaded: ", result);
                    return result;
                }

            }
        );
        return res;
    }
    catch (error) {
        console.log("Error uploading file: ", error);
        return {
            error: "Error uploading file"
        }
    }
}

export const deleteFile = async (public_id) => {
  try {
    // Delete image from Cloudinary
    const res = cld.v2.uploader.destroy(public_id, (error, result) => {
      if (error) {
        console.error("Error deleting image:", error);
      } else {
        console.log("file deleted successfully");
        return result;
      }
    });
    return res;
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to delete",
    };
  }
};