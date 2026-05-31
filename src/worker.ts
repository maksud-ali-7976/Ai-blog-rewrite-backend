import { connectDB } from "./db/mongo";

await connectDB("ai-blog-write");
import "src/worker/blog-rewrite-worker";
import "src/worker/blog-cover-image-worker";


console.log("✅ Workers Started");