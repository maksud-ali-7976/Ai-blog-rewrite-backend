import { generateImage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { google } from "src/config/ai";

export const GenerateCoverImage = async (
    prompt: string,
) => {
    const { image } = await generateImage({
        model: google.image("gemini-3-pro-image-preview"),

        prompt: `
Create a professional blog cover image.

Requirements:
- Modern and clean design
- High quality
- No text on image
- No watermark
- Suitable for technology blog
- Realistic and visually appealing
- Landscape format (16:9)

Topic:
${prompt}
        `,
    });

    return image;
};