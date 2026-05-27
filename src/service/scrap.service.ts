import * as cheerio from "cheerio";

export interface ScrapedBlog {
    title: string;

    author: string;

    content: string;

    published_at: string;

    original_url: string;
}

export const scrapeBlog = async (
    url: string,
): Promise<ScrapedBlog> => {
    const response = await fetch(url, {
        headers: {
            "user-agent":
                "Mozilla/5.0",
        },
    });

    if (!response.ok) {
        throw new Error(
            "Failed To Fetch Blog",
        );
    }

    const html =
        await response.text();

    const $ =
        cheerio.load(
            html,
        );

    $(
        "script, style, noscript, iframe",
    ).remove();

    const title =
        $(
            "meta[property='og:title']",
        ).attr(
            "content",
        ) ||
        $("title")
            .text()
            .trim();

    const author =
        $(
            "meta[name='author']",
        ).attr(
            "content",
        ) ||
        $(
            "[rel='author']",
        )
            .first()
            .text()
            .trim() ||
        "Unknown";

    const published_at =
        $(
            "meta[property='article:published_time']",
        ).attr(
            "content",
        ) ||
        $("time").attr(
            "datetime",
        ) ||
        new Date().toISOString();

    let content =
        "";

    const selectors = [
        "article",
        ".post-content",
        ".entry-content",
        ".blog-content",
        ".theme-doc-markdown",
        "main",
    ];

    for (const selector of selectors) {
        const text =
            $(selector)
                .text()
                .replace(
                    /\s+/g,
                    " ",
                )
                .trim();

        if (
            text &&
            text.length >
            500
        ) {
            content =
                text;

            break;
        }
    }

    if (!content) {
        content =
            $("body")
                .text()
                .replace(
                    /\s+/g,
                    " ",
                )
                .trim();
    }

    content =
        content.slice(
            0,
            20000,
        );

    return {
        title,

        author,

        content,

        published_at,

        original_url:
            url,
    };
};