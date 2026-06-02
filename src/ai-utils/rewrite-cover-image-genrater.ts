import { generateImage } from "ai";
import { google } from "src/config/ai";

export const GenerateCoverImage = async (prompt: string) => {
  const { image } = await generateImage({
    model: google.image("gemini-3.1-flash-image-preview"),
    prompt: `
Create a professional blog cover image.

Requirements:
- Modern and clean design
- High quality
- No text on image
- No watermark
- Suitable for technology blog
- Realistic and visually appealing
- Landscape format (3:4)

Topic:
${prompt}
        `,
    aspectRatio: "3:4",
  });

  if (!image?.base64) {
    throw new Error("No image generated");
  }

  return {
    base64: image.base64,
    mimeType: "image/png",
  };
};
