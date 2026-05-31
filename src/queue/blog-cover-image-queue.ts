import { Queue } from "bullmq";
import redis from "src/db/redis";

export const BlogCoverImageQueue = new Queue("blog-cover-image", {
    connection: redis
})