import { Modules } from "src/config/rabc/modules";
import { Summary } from "src/config/rabc/summary";
import { isAdminAuthenticated } from "src/guard/auth.guard";
import { createElysia } from "src/utils/createElysia";
import schema from "./audit.schema";
import { R } from "src/utils/response-helper";
import Audit from "src/models/Audit";
export default createElysia({ prefix: "/audit" }).guard(
    {
        detail: {
            tags: ["Audit"],
            summary: Summary([Modules.AUDIT])
        },
        beforeHandle: isAdminAuthenticated
    },
    (app) =>
        app
            .get("/", async ({ query }) => {
                const page = parseInt(query.page || "0");
                const size = parseInt(query.size || "10");

                const [list, total] = await Promise.all(
                    [
                        await Audit.find()
                            .skip(page * size)
                            .limit(size)
                            .populate("admin"),
                        await Audit.countDocuments({})
                    ]
                )

                const pages = Math.ceil(total / size)

                return R("Audit List", list, true, {
                    pages,
                    total,
                    page,
                    size
                })
            }, schema.list)
)