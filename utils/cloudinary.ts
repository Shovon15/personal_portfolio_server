import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { cloudApiKey, cloudApiSecret, cloudName } from "../secret";


cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: cloudApiSecret
});

export const uploadOnCloudinary = async (file: any, folderName: string, width: number, height: number) => {
    try {
        if (!file) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
            folder: folderName,
            width: width,
            height: height,
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        // fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        // fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



