import { generateText } from "ai";

import { google } from "src/config/ai";

export const RewriteBlog =
    async (
        content: string,
    ) => {

        const result =
            await generateText({
                model:
                    google(
                        "gemini-3.5-flash",
                    ),

                system: `
You are an expert SEO blog writer.

Return ONLY valid JSON.

Response format:

{
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "markdown string",
  "seo_keywords": ["string"],
  "tags": ["string"],
  "cover_image_prompt": "string",
  "author": "AI Editor"
}

Rules:
- SEO optimized
- Human readable
- Markdown formatting
- Unique content
- Professional tone
- Add headings
- Add bullet points
- Generate catchy title
- Generate SEO keywords
- Generate slug
- Generate short excerpt
- Generate realistic image prompt
`,

                prompt: `
Rewrite this blog professionally:

${content}
`,
            });

        return JSON.parse(
            result.text,
        );
    };