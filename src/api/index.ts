import { createElysia } from "src/utils/createElysia";
import blogsRoutes from "./admin/blogs/blogs.routes";
import authRoutes from "./admin/auth/auth.routes";
import rolesRoutes from "./admin/roles/roles.routes";
import adminsRoute from "./admin/admins/admins.route";
import auditRoutes from "./admin/audit/audit.routes";
import dashboardRoutes from "./admin/dashboard/dashboard.routes";

export const adminRoutes = createElysia({ prefix: "/admin" })

adminRoutes.use(authRoutes)
adminRoutes.use(blogsRoutes);
adminRoutes.use(rolesRoutes);
adminRoutes.use(adminsRoute)
adminRoutes.use(auditRoutes)
adminRoutes.use(dashboardRoutes)