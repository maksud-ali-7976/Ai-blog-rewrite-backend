import { t } from "elysia";

export const AuditSchema = t.Object({
    _id: t.String(),
    admin: t.Object({
        _id: t.String(),
        name: t.String(),
    }),
    action: t.String(),
    entity: t.String(),
    entity_id: t.String(),
    description: t.String(),
    createdAt: t.String(),
    updatedAt: t.String()
})

export const MetaPagination = t.Object({
    pages: t.Number(),
    total: t.Number(),
    page: t.Number(),
    size: t.Number()
})


export default {
    list: {
        query: t.Object({
            page: t.String(),
            size: t.String()
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: t.Array(AuditSchema)
            },
                {
                    description: "Audit List Response"
                })
        },
        detail: {
            operationId: "AuditList"
        }
    }
}