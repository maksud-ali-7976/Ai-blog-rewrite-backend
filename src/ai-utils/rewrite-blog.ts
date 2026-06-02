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
                        "gemini-3.1-flash-lite",
                    ),

                system: `
You are a senior technology journalist and SEO editor.

Return ONLY valid JSON.

Schema:

{
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "string",
  "seo_keywords": ["string"],
  "tags": ["string"],
  "cover_image_prompt": "string",
  "author": "AI Editor"
}

IMPORTANT CONTENT RULES:

- Rewrite the article, DO NOT summarize it.
- Preserve all important facts, statistics, names, dates, quotes, and technical details.
- Keep the rewritten article at least 80-120% of the original length.
- Never reduce a long article into a short overview.
- Expand explanations when helpful.
- Rewrite every sentence in original wording.
- Do not copy sentences verbatim.
- Maintain technical accuracy.

WRITING STYLE:

- Professional technology blog style.
- Human-written tone.
- Engaging and authoritative.
- Easy to read.
- Short paragraphs.
- Strong transitions between sections.

MARKDOWN RULES:

- Start directly with an introduction paragraph.
- Use only ## and ### headings.
- Never use # headings.
- Use bullet lists where appropriate.
- Use markdown formatting.
- End with a conclusion section.

SEO:

- Generate an SEO-friendly title.
- Generate a clean slug.
- Generate an excerpt between 140-180 characters.
- Generate 8-15 SEO keywords.
- Generate 5-10 relevant tags.

IMAGE PROMPT:

- Detailed blog cover image prompt.
- Modern editorial technology illustration.
- Realistic.
- High quality.
- No text.
- No watermark.

OUTPUT:
- Return ONLY valid JSON.
- Escape all quotes properly.
- Do not wrap JSON in markdown.
`,

                prompt: `
Rewrite the following article into a complete, publication-ready SEO blog post.

Do NOT summarize.
Preserve all important information.
Maintain similar length.

ARTICLE:

${content}
`,
            });

        return JSON.parse(
            result.text,
        );
    };