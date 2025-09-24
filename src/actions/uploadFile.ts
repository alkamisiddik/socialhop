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