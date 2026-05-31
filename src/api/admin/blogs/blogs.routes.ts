import { Modules } from "src/config/rabc/modules";
import { Summary } from "src/config/rabc/summary";
import { isAdminAuthenticated } from "src/guard/auth.guard";
import { createElysia } from "src/utils/createElysia";
import schema from "./blog.schema"
import { R } from "src/utils/response-helper";
import Blog, { BlogClass, BlogGenStatus, BlogStatus } from "src/models/Blog";
import { customError } from "src/utils/AppErr";
import { BlogRewriteQueue } from "src/queue/blog-rewrite-queue";
import { url } from "zod/v4";
import { RootFilterQuery } from "mongoose";
import Audit from "src/models/Audit";

const allowedHosts = [
    "research.ibm.com",
    "www.langchain.com",
    "langchain.com",
    "www.ibm.com"
];

export default createElysia({ prefix: "/blogs" }).guard(
    {
        detail: {
            tags: ["Blogs"],
            summary: Summary([Modules.BLOGS])
        },
        beforeHandle: isAdminAuthenticated
    },
    (app) =>
        app
            .get("/",
                async ({ query }) => {
                    const page = parseInt(query.page || "0");
                    const size = parseInt(query.size || "10");
                    let fillter: RootFilterQuery<BlogClass> = {};

                    if (query.status && query.status !== "all") {
                        fillter.status = query.status
                    }
                    const [list, total] = await Promise.all(
                        [
                            await Blog.find(fillter)
                                .skip(page * size)
                                .limit(size)
                                .populate("admin"),

                            await Blog.countDocuments(fillter)
                        ]
                    )

                    const pages = Math.ceil(total / size)
                    return R("Blog List Response", list, true, {
                        pages,
                        total,
                        page,
                        size
                    })
                },
                schema.list)
            .post("/",
                async ({ body, user }) => {
                    let url = new URL(body.url)
                    if (!allowedHosts.includes(url.hostname)) {
                        return customError("Only IBM Research Blog and LangChain Blog are supported")
                    }

                    if (!url.pathname.startsWith("/blog")) {
                        return customError(
                            "Only blog URLs are supported"
                        );
                    }
                    const blog = await Blog.create({
                        original_url: body.url,
                        status: BlogStatus.DRAFT,
                        gen_status: BlogGenStatus.QUEUED
                    })

                    await BlogRewriteQueue.add("blog-rewrite",
                        {
                            blogId: blog._id,
                            body,
                        },
                        {
                            jobId: blog._id.toString(),
                            attempts: 1,
                            backoff: {
                                type: "exponential",
                                delay: 5000,
                            },
                            removeOnComplete: true,
                            removeOnFail: false,
                        }
                    )
                    await Audit.create({
                        admin: user._id,
                        action: "BLOG_CREATED",
                        entity: "BLOG",
                        entity_id: blog._id.toString(),
                        description: `Blog rewrite requested for ${body.url}`,
                    });
                    return R("Blog Rewriting...", blog)

                },
                schema.create)
            .put("/",
                async ({ query, body }) => {
                    const blog = await Blog.findByIdAndUpdate(query.id, body)
                    return R("Blog Updated Successfully", blog)
                },
                schema.update)
            .delete("/",
                async ({ query }) => {
                    const blog = await Blog.findByIdAndDelete(query.id);
                    return R("Blog Deleted Successfully", blog)
                },
                schema.delete)
            .patch("/publish",
                async ({ query, body, user }) => {
                    const blog = await Blog.findById(query.id)
                    if (!blog) {
                        return customError("Blog Not Found")
                    }

                    await Blog.findByIdAndUpdate(query.id,
                        {
                            status: body.status,
                            publish_by: user._id,
                            published_at: new Date()
                        }
                    )
                    await Audit.create({
                        admin: user._id,
                        action: BlogStatus.PUBLISHED,
                        entity: "BLOG",
                        entity_id: blog._id.toString(),
                        description: `Published blog "${blog.rewrite_title || blog.original_title}"`,
                    });
                    return R("Blog Published Successfully")
                },
                schema.publish
            )
            .patch("/reviewer",
                async ({ query, body, user }) => {
                    const exitsBlog = await Blog.findById(query.id);
                    if (!exitsBlog) {
                        return customError("Blog Not Found")
                    }
                    await Blog.findByIdAndUpdate(query.id, {
                        status: body.status,
                        review_by: user._id,
                    })

                    await Audit.create({
                        admin: user._id,
                        action: BlogStatus.REVIEWED,
                        entity: "BLOG",
                        entity_id: exitsBlog._id.toString(),
                        description: `Reviewed blog "${exitsBlog.rewrite_title || exitsBlog.original_title}"`,
                    });
                    return R("Blog Reviewed Successfully")
                }, schema.reviewed
            )
)