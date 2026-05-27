import { createElysia } from "src/utils/createElysia";
import schema from "./auth.schema"
import { R } from "src/utils/response-helper";
import Admin from "src/models/Admin";
import { customError } from "src/utils/AppErr";
import { VerifyPassword } from "src/utils/hash";
import jwt from "src/utils/jwt";
export default createElysia({ prefix: "/auth" }).guard(
    {
        detail: {
            tags: ["Auth"]
        }
    },
    (app) =>
        app
            .post("/login", async ({ body }) => {
                const user = await Admin.findOne({ email: body.email }).populate("role")

                if (!user) {
                    return customError("User Not Found")
                }

                if (!VerifyPassword(body.password, user.password)) {
                    return customError("InValif]d Credentials")
                }
                let u: Record<string, any> = user.toObject();

                u.token = jwt.sign({ _id: u._id, email: u.email, role: user.role });

                return R("Login SuccessFull", u)
            }, schema.login)
            .get("/me", async (ctx) => {
                const user = await Admin.findById(ctx.user._id).populate("role");

                if (!user) {
                    return customError("User Not Found")
                }
                return R("Admin Profile", user)
            }, schema.me)
)   