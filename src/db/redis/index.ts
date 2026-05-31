import env from "src/config/redis";
import ioredis, { ChainableCommander, Redis } from "ioredis";

export interface CustomRedis extends Redis {
    getJson?: any;
    setJson?: any;
}

console.log(`REDIS HOST: ${env.host}`);


const redis: any = new ioredis({
    username: env.username,
    host: env.host,
    password: env.password,
    port: env.port,
    keyPrefix: env.keyPrefix,

    maxRetriesPerRequest: null
});

const getJson = async function (key: string) {
    let data: any = await redis.get(key);
    return JSON.parse(data);
};

const setJson = async function (key: string, value: any) {
    return await redis.set(key, JSON.stringify(value));
};



redis.getJson = getJson;
redis.setJson = setJson;

export default redis;