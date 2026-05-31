import { t } from "elysia";

export const BlogSchema = t.Object({
    _id: t.String(),
    original_url: t.String(),
    original_title: t.String(),
    original_content: t.String(),
    cover_image: t.String(),
    rewrite_content: t.String(),
    rewrite_title: t.String(),
    review_notes: t.String(),
    review_by: t.Object({
        _id: t.String(),
        name: t.String()
    }),
    author: t.String(),
    published_at: t.String(),
    publish_by: t.Object({
        _id: t.String(),
        name: t.String()
    }),
    status: t.String(),

})

export const MetaPaginationSchema = t.Object({
    pages: t.Number(),
    total: t.Number(),
    page: t.Number(),
    size: t.Number(),
})

export default {
    list: {
        query: t.Object({
            page: t.String(),
            size: t.String(),
            status: t.Optional(t.String())
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: BlogSchema
            },
                {
                    description: "Blog List Response"
                }
            )
        },
        detail: {
            operationId: "BlogList"
        }
    },
    create: {
        body: t.Object({
            url: t.String()
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: BlogSchema
            },
                {
                    description: "Blog Create Response"
                }
            )
        },
        detail: {
            operationId: "BlogCreate"
        }
    },
    update: {
        query: t.Object({
            id: t.String()
        }),
        body: t.Object({
            rewrite_title: t.Optional(t.String()),
            review_notes: t.Optional(t.String()),
            rewrite_content: t.Optional(t.String()),
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: BlogSchema
            },
                {
                    description: "Blog Update Response"
                }
            )
        },
        detail: {
            operationId: "BlogUpdate"
        }
    },
    delete: {
        query: t.Object({
            id: t.String()
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: BlogSchema
            },
                {
                    description: "Blog Delete Response"
                }
            )
        },
        detail: {
            operationId: "BlogDelete"
        }
    },
    reviewed: {
        query: t.Object({
            id: t.String()
        }),
        body: t.Object({
            status: t.String()
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: BlogSchema
            },
                {
                    description: "Blog Reviewed Response"
                }
            )
        },
        detail: {
            operationId: "BlogReviewed"
        }
    },
    publish: {
        query: t.Object({
            id: t.String()
        }),
        body: t.Object({
            status: t.String()
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: BlogSchema
            },
                {
                    description: "Blog Publish Response"
                }
            )
        },
        detail: {
            operationId: "BlogPublish"
        }
    }
}