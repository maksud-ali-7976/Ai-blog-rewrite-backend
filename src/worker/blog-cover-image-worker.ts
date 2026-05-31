import { Job, Worker } from "bullmq";
import { GenerateCoverImage } from "src/ai-utils/rewrite-cover-image-genrater";
import redis from "src/db/redis";

export const BlogCoverImageWorker = new Worker(
    "blog-cover-image",
    async (job: Job) => {
        const { blogId, prompt } = job.data
        try {
            const coverImage = await GenerateCoverImage(prompt)

            const buffer = Buffer.from(
                coverImage.base64,
                "base64"
            );
            const file = new File(
                [buffer],
                `cover-${Date.now()}.jpg`,
                {
                    type: coverImage.mediaType,
                }
            );

            console.log(
                "Generated Image:",
                file.name,
                file.type,
                file.size
            );

        } catch (error: any) {
            console.log("Cover Image Genration Error:", error);
            throw new Error("Cover Image error")
        }
    }, {
    connection: redis
}
)