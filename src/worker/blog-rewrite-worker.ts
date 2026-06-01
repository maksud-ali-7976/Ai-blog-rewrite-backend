import { Job, Worker } from "bullmq";
import { RewriteBlog } from "src/ai-utils/rewrie-blog";
import redis from "src/db/redis";
import Blog, { BlogGenStatus } from "src/models/Blog";
import { BlogCoverImageQueue } from "src/queue/blog-cover-image-queue";
import { ScrapeBlog } from "src/service/scrap.service";

export const BlogRewriteWorker = new Worker(
    "blog-rewrite",
    async (job: Job) => {
        const { blogId } = job.data;
        console.log("Worket Start");
        console.log("Worker Job Data", job.data)
        try {


            let blog = await Blog.findById(blogId)

            if (!blog) {
                throw new Error("Blog Not found")
            }
            await Blog.findByIdAndUpdate(blogId, {
                gen_status: BlogGenStatus.SCRAPING
            })
            const scrapedBlog = await ScrapeBlog(blog.original_url)
            console.log("Scraper Blog", scrapedBlog);
            if (!scrapedBlog) {
                await Blog.findByIdAndUpdate(blogId, {
                    gen_status: BlogGenStatus.FAILED,
                    error_message: "Erorr In Sraping Blog"
                })
                throw new Error("Erorr In Sraping Blog")
            }
            await Blog.findByIdAndUpdate(blogId, {
                gen_status: BlogGenStatus.PROCESSING
            });
            let reWritenBlog = await RewriteBlog(scrapedBlog.content);
            console.log("ReWritenBlog", reWritenBlog.cover_image_prompt);

            await Blog.findByIdAndUpdate(blogId, {
                gen_status: BlogGenStatus.IMAGE_GENERATING
            });
            await BlogCoverImageQueue.add("blog-cover-image",
                {
                    prompt: reWritenBlog.cover_image_prompt,
                    blogId,
                }, {
                jobId: blog._id.toString(),
                attempts: 1,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
                removeOnComplete: true,
                removeOnFail: false,
            });

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
            await Blog.findByIdAndUpdate(blogId, {
                gen_status: BlogGenStatus.FAILED,
                error_message: error?.message || "Ai genration faild"
            })

        }
    },
    {
        connection: redis
    }
)