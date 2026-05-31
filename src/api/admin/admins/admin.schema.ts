import { t } from "elysia";
import { RoleSchema } from "../roles/roles.schema";
import Admin from "src/models/Admin";

export const AdminSchema = t.Object(
    {
        _id: t.String(),
        name: t.String(),
        email: t.String(),
        super_admin: t.Boolean(),
        role: RoleSchema
    }
)


const MetaPaginationSchema = t.Object({
    pages: t.Number(),
    total: t.Number(),
    page: t.Number(),
    size: t.Number(),
});


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
                data: t.Array(AdminSchema)
            },
                {
                    description: "Admins List Response"
                })
        },
        detail: {
            operationId: "AdminList"
        }
    },
    create: {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
            role: t.String()
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: AdminSchema
            },
                {
                    description: "Admin Create Response"
                })
        },
        detail: {
            operationId: "AdminCreate"
        }
    },
    update: {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
            role: t.String()
        }),
        query: t.Object({
            id: t.String(),
        }),
        response: {
            200: t.Object(
                {
                    status: t.Boolean(),
                    message: t.String(),
                    data: AdminSchema,
                },
                {
                    description: "admins Response",
                },
            ),
        },
        detail: {
            operationId: "Update",
        },
    },
    delete: {
        query: t.Object({
            id: t.String(),
        }),
        response: {
            200: t.Object(
                {
                    status: t.Boolean(),
                    message: t.String(),
                    data: AdminSchema,
                },
                {
                    description: "admins Response",
                },
            ),
        },
        detail: {
            operationId: "Delete",
        },
    },
}