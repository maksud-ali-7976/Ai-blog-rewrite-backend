import env from "src/config/env";

export default {
    uri: env.db_host || "mongodb://127.0.0.1:27017/",
    db_name: env.db_name || "ai-blog-rewrote"
};