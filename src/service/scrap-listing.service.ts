import * as cheerio from "cheerio";

export const ScrapeBlogListing = async (
    url: string,
): Promise<string[]> => {
    const response = await fetch(url, {
        headers: {
            "user-agent": "Mozilla/5.0",
        },
    });

    if (!response.ok) {
        throw new Error("Failed To Fetch Blog Listing");
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    const links = new Set<string>();

    $("a").each((_, el) => {
        const href = $(el).attr("href");

        if (!href) {
            return;
        }

        const absoluteUrl = new URL(
            href,
            url,
        ).toString();

        const pathname = new URL(
            absoluteUrl,
        ).pathname;

        if (
            pathname.includes("/blog/") &&
            pathname !== "/blog"
        ) {
            links.add(
                absoluteUrl,
            );
        }
    });

    return [...links];
};