import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateImage } from "ai";
import env from "src/config/env";

const google = createGoogleGenerativeAI({
    apiKey: env.gemini_api_key || "",
});
