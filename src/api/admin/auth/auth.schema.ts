import { t } from "elysia";
import { isAdminAuthenticated } from "src/guard/auth.guard";



export const AuthSchema = t.Object({
    _id: t.String(),
    name: t.String(),
    role: t.Object({
        name: t.String(),
        level: t.Number(),
        permission: t.Any(),
        super_admin: t.Boolean()
    }),
    email: t.String(),
    token: t.String(),
    refreshToken: t.String(),
    super_admin: t.Boolean()
})


export default {
    login: {
        body: t.Object({
            email: t.String(),
            password: t.String()
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: AuthSchema
            }, { description: "Admin Login Response" })
        },
        detail: {
            operationId: "Login"
        }
    },
    me: {
        beforeHandle: isAdminAuthenticated as any,
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: AuthSchema
            }, { description: "Admin Profile Response" })
        },
        detail: {
            operationId: "Profile"
        }
    },
    signup: {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String()
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: AuthSchema
            }, { description: "Admin signup response" })
        },
        detail: {
            operationId: "Singup"
        }
    },
    refresh: {
        body: t.Object({
            refreshToken: t.String()
        }),
        response: {
            200: t.Object({
                status: t.Boolean(),
                message: t.String(),
                data: AuthSchema
            }, {
                description: "Auth Refesh Token Response"
            })
        },
        detail: {
            operationId: "RefreshToken"
        }
    }
}