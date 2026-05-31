import { Job, Worker } from "bullmq";
import { RewriteBlog } from "src/ai-utils/rewrie-blog";
import redis from "src/db/redis";
import Blog, { BlogGenStatus } from "src/models/Blog";
import { ScrapeBlog } from "src/service/scrap.service";

export const BlogRewriteWorker = new Worker(
    "blog-rewrite",
    async (job: Job) => {
        const { blogId } = job.data;
        console.log("Worket Start");
        console.log("Worker Job Data", job.data)
        try {
            await Blog.findByIdAndUpdate(blogId, {
                gen_status: BlogGenStatus.PROCESSING
            });

            let blog = await Blog.findById(blogId)

            if (!blog) {
                throw new Error("Blog Not foun")
            }

            const scrapedBlog = await ScrapeBlog(blog.original_url)
            console.log("Scraper Blog", scrapedBlog);
            if (!scrapedBlog) {
                throw new Error("Erorr In Sraping Blog")
            }

            let reWritenBlog = await RewriteBlog(scrapedBlog.content);
            console.log("ReWritenBlog", reWritenBlog);
            await Blog.findByIdAndUpdate(blogId, {
                original_content: scrapedBlog.content,
                original_title: scrapedBlog.title,
                original_url: scrapedBlog.original_url,
                rewrite_content: reWritenBlog.content,
                rewrite_title: reWritenBlog.title,
                published_at: new Date(scrapedBlog.published_at),
                author: scrapedBlog.author,
                gen_status: BlogGenStatus.COMPLETED
            })
            console.log("Worker Completed")
        } catch (error: any) {
            console.log("Error ~~~ :", error);
            console.log("Error Message:~~", error?.message)
            const blog = await Blog.findByIdAndUpdate(blogId, {
                gen_status: BlogGenStatus.FAILED
            })

        }
    },
    {
        connection: redis
    }
)