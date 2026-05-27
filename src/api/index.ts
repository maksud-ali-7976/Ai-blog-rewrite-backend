import { createElysia } from "src/utils/createElysia";
import blogsRoutes from "./admin/blogs/blogs.routes";
import authRoutes from "./admin/auth/auth.routes";

export const adminRoutes = createElysia({ prefix: "/admin" })

adminRoutes.use(authRoutes)
adminRoutes.use(blogsRoutes);