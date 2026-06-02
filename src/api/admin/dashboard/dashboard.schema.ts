import { t } from "elysia";
import { BlogSchema } from "../blogs/blog.schema";
import { AuditSchema } from "../audit/audit.schema";

export const DasboardSchema = t.Object({
    total_blog: t.Number(),
    draft_blog: t.Number(),
    reviewed_blog: t.Number(),
    published_blog: t.Number(),
    recent_blogs: t.Array(BlogSchema),
    recent_activity: t.Array(AuditSchema)
})

export default {
    insights: {
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: DasboardSchema
            }, {
                description: "Dashboard Insights Response"
            })
        },
        detail: {
            operationId: "Insights"
        }
    }
}