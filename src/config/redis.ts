import env from "./env";

export default {
    host: env.redis_host,
    username: env.redis_user,
    password: env.redis_password,
    port: parseInt(env.redis_port || ""),
    keyPrefix: ""
}