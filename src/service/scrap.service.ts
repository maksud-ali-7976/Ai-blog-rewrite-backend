import * as cheerio from "cheerio";

export interface ScrapedBlog {
    title: string;

    author: string;

    content: string;

    published_at: string;

    original_url: string;
}

export const ScrapeBlog = async (
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
        `
    script,
    style,
    noscript,
    iframe,
    footer,
    aside,
    .ads,
    .ad,
    .banner,
    .newsletter,
    .sidebar,
    .related-posts,
    .related-content
`
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

    let author =
        $(".blog-author-name-item").first().text().trim() ||
        $("meta[name='author']").attr("content") ||
        $("meta[property='article:author']").attr("content") ||
        "";

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
        const text = $(selector)
            .text()
            .replace(/\s+/g, " ")
            .trim();

        if (text && text.length > 500) {
            content = text;
            break;
        }
    }

    if (!content) {
        content = $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim();
    }

    // Cleanup unwanted sections
    content = content
        .split("Related content")[0]
        .split("Sign up for our newsletter")[0]
        .split("See what your agent is really doing")[0]
        .trim();

    // Remove header junk before article starts
    if (content.includes("Key Takeaways")) {
        content =
            "Key Takeaways" +
            content.split("Key Takeaways")[1];
    }

    content = content.slice(0, 20000);


    if (!author) {
        const match = content.match(/Authors(.*?)Topics/i);

        if (match?.[1]) {
            author = match[1]
                .replace(/([a-z])([A-Z])/g, "$1, $2")
                .trim();
        }
    }

    author = author || "Unknown";
    return {
        title,

        author,

        content,

        published_at,

        original_url:
            url,
    };
};