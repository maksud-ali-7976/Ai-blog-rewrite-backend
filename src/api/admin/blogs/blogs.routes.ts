import { Modules } from "src/config/rabc/modules";
import { Summary } from "src/config/rabc/summary";
import { isAdminAuthenticated } from "src/guard/auth.guard";
import { createElysia } from "src/utils/createElysia";

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
            .post("/", async () => { })
)