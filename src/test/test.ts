import "dotenv/config";
import { scrapeBlog } from "src/service/scrap.service";
import { rewriteBlog } from "src/ai-utils/rewrie-blog";


const run =
    async () => {

        const ScrapResult =
            await scrapeBlog(
                "https://www.ibm.com/think/topics/artificial-intelligence",
            );
        console.log("Scraoed Result", ScrapResult)
        const AirewriteResult =
            await rewriteBlog(ScrapResult.content);

        console.log("Result", AirewriteResult);
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