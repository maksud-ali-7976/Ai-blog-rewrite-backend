import { isAdminAuthenticated } from "src/guard/auth.guard";
import { createElysia } from "src/utils/createElysia";
import schema from "./dashboard.schema"
import { R } from "src/utils/response-helper";
import Admin from "src/models/Admin";
import { customError } from "src/utils/AppErr";
import Blog, { BlogStatus } from "src/models/Blog";
import Audit from "src/models/Audit";
import { RoleLevel } from "src/models/Role";
export default createElysia({ prefix: "/dasboard" }).guard(
    {
        detail: {
            tags: ["Dashboard"]
        },
        beforeHandle: isAdminAuthenticated
    },
    (app) =>
        app
            .get("/insights", async ({ user }) => {
                const admin = await Admin.findById(user._id).populate("role")

                if (!admin) {
                    return customError("Admin Not Found")
                }



                const role = admin.role as any;

                let total_blog = 0;
                let reviewed_blog = 0;
                let published_blog = 0;
                let recent_blogs: any = [];
                let recent_activity: any = [];
                let draft_blog = 0;

                if (admin.super_admin) {
                    total_blog = await Blog.countDocuments();

                    reviewed_blog = await Blog.countDocuments({
                        status: BlogStatus.REVIEWED,
                    });

                    published_blog = await Blog.countDocuments({
                        status: BlogStatus.PUBLISHED,
                    });

                    draft_blog = await Blog.countDocuments({
                        status: BlogStatus.DRAFT,
                    });

                    recent_blogs = await Blog.find({})
                        .sort({ createdAt: -1 })
                        .limit(10);

                    recent_activity = await Audit.find({})
                        .sort({ createdAt: -1 })
                        .limit(10)
                        .populate("admin");
                }
                else if (role?.level === RoleLevel.L2) {

                    draft_blog = await Blog.countDocuments({
                        status: BlogStatus.DRAFT,
                    });

                    reviewed_blog = await Blog.countDocuments({
                        status: BlogStatus.REVIEWED,
                        reviewed_by: admin._id,
                    });
                }
                else if (role?.level === RoleLevel.L3) {


                    reviewed_blog = await Blog.countDocuments({
                        status: BlogStatus.REVIEWED,
                    });

                    total_blog = await Blog.countDocuments({
                        status: BlogStatus.PUBLISHED,
                        published_by: admin._id,
                    });

                    published_blog = total_blog;
                }

                let insights_data: any = {
                    total_blog,
                    recent_activity,
                    recent_blogs,
                    published_blog,
                    reviewed_blog
                }
                return R("Dashboard Insights", insights_data)
            }, schema.insights)
)