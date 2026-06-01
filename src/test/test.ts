import "dotenv/config";
import { ScrapeBlog } from "src/service/scrap.service";
import { RewriteBlog } from "src/ai-utils/rewrie-blog";
import { GenerateCoverImage } from "src/ai-utils/rewrite-cover-image-genrater";
import { generateImage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { google } from "src/config/ai";



const run =
    async () => {
        console.log("Test Started....")
        const ScrapResult =
            await ScrapeBlog(
                "https://www.ibm.com/quantum/blog/qiskit-summer-school-2026",
            );
        console.log("Scraoed Result", ScrapResult)
        // const AirewriteResult =
        //     await RewriteBlog(ScrapResult.content);

        // console.log("Result", AirewriteResult);

        // const coverImage = await GenerateCoverImage(AirewriteResult.cover_image_prompt);
        // console.log("Cover Image", coverImage)
        // const buffer = Buffer.from(
        //     coverImage.base64,
        //     "base64"
        // );
        // const file = new File(
        //     [buffer],
        //     `cover-${Date.now()}.jpg`,
        //     {
        //         type: coverImage.mediaType,
        //     }
        // );

        // console.log(
        //     "Generated Image:",
        //     file.name,
        //     file.type,
        //     file.size
        // );
        // const fileName =
        //     `cover-${Date.now()}.jpg`;

        // const filePath =
        //     `uploads/blogs/${fileName}`;

        // await Bun.write(
        //     filePath,
        //     coverImage.uint8Array
        // );

        // console.log(
        //     "Saved:",
        //     filePath
        // );
        console.log("Completed....")
    };

run();



// const run = async () => {

//     const result =
//         await scrapeBlog(
//             "https://www.ibm.com/think/topics/artificial-intelligence",
//         );

//     console.log("Scraped Blog Data",
//         JSON.stringify(
//             result,
//             null,
//             2,
//         ),
//     );
// };

// run();