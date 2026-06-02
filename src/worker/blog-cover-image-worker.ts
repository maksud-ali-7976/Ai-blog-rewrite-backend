import { Job, Worker } from "bullmq";
import { GenerateCoverImage } from "src/ai-utils/rewrite-cover-image-genrater";
import redis from "src/db/redis";
import Blog from "src/models/Blog";
import AppWrite from "src/utils/Appwrite";

export const BlogCoverImageWorker = new Worker(
  "blog-cover-image",
  async (job: Job) => {
    const { blogId, prompt } = job.data;
    console.log("Cover Image Worker Started");
    console.log("Cover Image JOb Data", job.data);
    try {
      const coverImage = await GenerateCoverImage(prompt);

      const buffer = Buffer.from(coverImage.base64, "base64");

      const file = new File([buffer], `cover-${Date.now()}.png`, {
        type: coverImage.mimeType,
      });

      const CoverImageUrl = await AppWrite.upload(file);

      console.log("Cover Url", CoverImageUrl);

      await Blog.findByIdAndUpdate(blogId, {
        cover_image: CoverImageUrl,
      });

      console.log("Cover Image Worker Completed");
    } catch (error: any) {
      console.log("Cover Image Genration Error:", error);
      throw new Error("Cover Image error");
    }
  },
  {
    connection: redis,
  },
);
