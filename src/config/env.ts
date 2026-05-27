import dotenv from "dotenv";
dotenv.config();

export default {
    // App
    secret: process.env.APP_SECRET || "",
    port: (process.env.APP_PORT || 9000) as number,
    db_host: process.env.DB_HOST || "mongodb://127.0.0.1:27017/",
    db_name: process.env.DB_NAME || "ai-blog-rewrite",
    gemini_api_key: process.env.GEMINI_API_KEY || ""
};