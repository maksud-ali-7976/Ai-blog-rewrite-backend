import { Modules } from "src/config/rabc/modules";
import { Summary } from "src/config/rabc/summary";
import { isAdminAuthenticated } from "src/guard/auth.guard";
import { createElysia } from "src/utils/createElysia";
import schema from "./admin.schema"
import { R } from "src/utils/response-helper";
import Admin from "src/models/Admin";
import { HashPassword } from "src/utils/hash";
import { customError } from "src/utils/AppErr";
import Role from "src/models/Role";
export default createElysia({ prefix: "/admins" }).guard(
    {
        detail: {
            tags: ["Admin"],
            summary: Summary([Modules.ROLES_AND_PERMISSIONS])
        },
        beforeHandle: isAdminAuthenticated
    },
    (app) =>
        app
            .post("/", async ({ body }) => {
                const exitingAdmin = await Admin.findOne({ email: body.email });

                if (exitingAdmin) {
                    return customError("Admin Already Exits");
                }

                const role = await Role.findById(body.role)

                if (!role) {
                    return customError("InValid Role")
                }

                const admin = await Admin.create(
                    {
                        email: body.email,
                        name: body.name,
                        password: HashPassword(body.password),
                        role: role._id,
                        super_admin: false
                    }
                )
                return R("Admin Create Successfully", admin)
            }, schema.create)
            .get("/", async ({ query }) => {
                const page = parseInt(query.page || "0");
                const size = parseInt(query.size || "10");

                const [list, total] = await Promise.all(
                    [
                        await Admin.find({
                            super_admin: false
                        })
                            .skip(page * size)
                            .limit(size)
                            .populate("role"),
                        await Admin.countDocuments()
                    ]
                );
                const pages = Math.ceil(total / size)
                return R("Admins List", list, true, {
                    pages,
                    total,
                    page,
                    size
                })
            }, schema.list)
)