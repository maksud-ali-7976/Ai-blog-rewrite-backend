import { createGoogleGenerativeAI } from "@ai-sdk/google";
import env from "./env";

export const google =
    createGoogleGenerativeAI({
        apiKey: env.gemini_api_key || "",
    });