// src/index.ts

process.env.TZ = "Asia/Kolkata";

import { Elysia } from "elysia";

import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { bearer } from "@elysiajs/bearer";

import { connectDB } from "./db/mongo";
import AppErr from "./utils/AppErr";
import { R } from "./utils/response-helper";
import { html } from "@elysiajs/html"
import { adminRoutes } from "./api";
import { Modules } from "./config/rabc/modules";
import { createElysia } from "./utils/createElysia";



export const app = createElysia({ normalize: false });



app.use(
    cors({
        methods: "*",

        origin: () => true,
    }),
);


app.onError(({ error, code, set, ...rest }: any) => {
    if (error instanceof AppErr) {
        set.status = "OK";
        return R(error.message, null, false);
    }

    const errorType = "type" in error ? error.type : "internal";

    if (errorType == "internal") {
        console.log(`${errorType} ERROR: ${JSON.stringify(error, null, 2)}`);
        set.status = "OK";
        return { status: false, message: error.message, data: null };
    } else if (errorType == "response") {
        set.status = "OK";
        const result = JSON.parse(error?.message);
        return result?.found;
    } else if (["body", "query"].includes(errorType)) {
        set.status = "OK";
        const result = JSON.parse(error?.message);
        const message = result.errors
            .map(
                (err: any) =>
                    `${err.path.replace("/", "").replace("_", " ").toUpperCase()} ${err.message
                    }`,
            )
            .join("\n");

        return { status: false, message: message, data: null };
    }
    console.log(`${errorType} ERRRO ❌: ${JSON.stringify(error, null, 2)}`);

    return { status: false, message: error.message, data: null };
});

app.onTransform(({ body = {}, params = {}, query = {} }) => {
    const removeWasteFromObject = (obj: Record<string, any> | any) => {
        for (let key in obj) {
            let value = obj[key];
            if (typeof value == "object" && !Array.isArray(value)) {
                // removeWasteFromObject(obj);
                continue;
            }

            if (value === "") {
                delete obj[key];
            }
        }
    };
    removeWasteFromObject(body);
    removeWasteFromObject(params);
    removeWasteFromObject(query);

});

app.use(bearer());

app.use(html());

app.onAfterHandle((ctx) => {
    const isJsonPath = ctx.path.includes("/json");
    const normalizeContentType = (type: string) => {
        switch (type) {
            case "json":
            case "application/json":
                return "application/json";
            case "text":
            case "text/plain":
                return "text/plain";
            case "formdata":
            case "multipart/form-data":
                return "multipart/form-data";
            case "urlencoded":
            case "application/x-www-form-urlencoded":
                return "application/x-www-form-urlencoded";
            case "arrayBuffer":
            case "application/octet-stream":
                return "application/octet-stream";
            default:
                return type;
        }
    };
    const toOpenApiPath = (path: string) =>
        path
            .split("/")
            .map((segment) => {
                if (segment.startsWith(":")) {
                    let name = segment.slice(1);
                    if (name.endsWith("?")) name = name.slice(0, -1);
                    return `{${name}}`;
                }
                return segment;
            })
            .join("/");
    const buildRequestBodyContentTypeOverrides = () => {
        const overrides = new Map<string, string[]>();
        for (const route of app.routes) {
            const rawType =
                (route.hooks as any)?.type ??
                (route.hooks as any)?.contentType ??
                (route.hooks as any)?.mediaType;
            if (!rawType) continue;

            const types = Array.isArray(rawType) ? rawType : [rawType];
            const normalized = types.map(normalizeContentType).filter(Boolean);
            if (!normalized.length) continue;

            const path = toOpenApiPath(route.path);
            overrides.set(`${route.method.toLowerCase()} ${path}`, normalized);
        }
        return overrides;
    };
    const pruneRequestBodyContentTypes = (doc: any) => {
        if (!doc?.paths) return;
        const overrides = buildRequestBodyContentTypeOverrides();
        for (const [path, methods] of Object.entries(doc.paths)) {
            for (const [method, operation] of Object.entries(methods as any)) {
                const requestBody = (operation as any)?.requestBody;
                const content = requestBody?.content;
                if (!content) continue;

                const allowed = overrides.get(`${method} ${path}`);
                if (!allowed?.length) continue;

                const filtered: Record<string, any> = {};
                for (const type of allowed) {
                    if (content[type]) filtered[type] = content[type];
                }
                if (Object.keys(filtered).length > 0) {
                    requestBody.content = filtered;
                }
            }
        }
    };
    const handleJsonSchema = (obj: any) => {
        for (let key in obj) {
            let value = obj[key];
            if (typeof value == "object" && !Array.isArray(value)) {
                if (`${key}`.startsWith("/admin")) {
                    continue;
                }
                if (value.description == "upload") {
                    // value.consumes = ["multipart/form-data"];
                    delete obj[key];
                }
                if (value?.description == "file") {
                    for (let jkey in value) {
                        if (jkey != "type") {
                            delete value[jkey];
                        }
                    }
                    value.type = "file";
                    // value.format = "binary";
                }
                handleJsonSchema(obj[key]);
            }
        }
        return obj;
    };

    if (isJsonPath) {
        handleJsonSchema(ctx.response);
        pruneRequestBodyContentTypes(ctx.response);
    }
});


app.use(
    swagger({
        path: "/swagger-admin-app",
        provider: "scalar",
        exclude: new RegExp(/^(?!\/admin).*/),
        swaggerOptions: {
            persistAuthorization: true,
        },

        documentation: {
            info: {
                title: "Ai Blog ReWrite Admin API Documentation",
                version: "0.0.1",
            },
        },
    }),
);

app.use(adminRoutes);



export const routeMap: Map<
    string,
    {
        modules: Modules[];
    }
> = new Map();

for (const route of app.routes) {
    const summary =
        route.hooks.detail?.summary;

    if (!summary) {
        continue;
    }

    try {
        const parsed = JSON.parse(
            summary,
        );

        routeMap.set(route.path, {
            modules:
                parsed.modules,
        });
    } catch (error) {
        console.error(
            "Invalid Summary:",
            route.path,
        );
    }
}

connectDB("ai-blog-write").then((d) => {
    app.listen(process.env.PORT || 8080);
    console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${process.env.PORT || 8080
        }`,
    );
});

