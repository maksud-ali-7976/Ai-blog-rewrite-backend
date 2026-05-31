import { Queue } from "bullmq"
import redis from "src/db/redis"

export const BlogRewriteQueue = new Queue("blog-rewrite", {
    connection: redis
})