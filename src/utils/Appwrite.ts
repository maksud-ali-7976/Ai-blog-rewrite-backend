import dotenv from "dotenv";
dotenv.config();
import * as sdk from "node-appwrite";

const client = new sdk.Client();

const BASE_URL = process.env.APPWRITE_BASE_URL || "";
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || "";
const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || "";
const API_KEY = process.env.APPWRITE_API_KEY || "";

console.log("🚀 Bucket Id", BUCKET_ID);
console.log("🚀 Base Url", BASE_URL);
client.setEndpoint(BASE_URL).setProject(PROJECT_ID).setKey(API_KEY);

const storage = new sdk.Storage(client);

const AppWrite = {
    upload: async (file: File) => {
        const request = await storage.createFile(BUCKET_ID, sdk.ID.unique(), file);
        return AppWrite.toFileUrl(request.$id);
    },
    uploadMultiple: async (files: File[]) => {
        const fileNames = [] as string[];

        for (let file of files) {
            const request = await AppWrite.upload(file);
            // console.log("🚀🚀 Files Uploaded",request)

            fileNames.push(request);
        }

        return fileNames;
    },
    // toFileUrl: (fileId: string) =>
    //   `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`,

    toFileUrl: (fileId: string) =>
        `https://fra.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}&mode=guest`,
};

export default AppWrite;