User(FrontEnd NextJs)
  |
  v
ElysiaJS API Server (Bun Runtime)
  |
  +----> Blog Scraper (Cheerio)
  |
  +----> Gemini AI (Rewrite Blog + Generate Cover Image)
  |
  +----> MongoDB (Typegoose Models)
  |
  +----> Appwrite Storage (Cover Images)
  |
  +----> BullMQ + Redis (Background Jobs)



Bun:-
    Bun js fast startup time and lowr memory consume copared to nodesj app, its fast server setup,hight http performane handle,typescript built in support, packgae installaion fasr

    bun new hai islye kuch pacjages ne compatibility isseus aa skate hai, and Claude anthropic ne acuire kiya ha isko


elysiaJs:-
        elyisajs fast and optimized for bunJs and it lightweight,type-safe, built in typescript support and hight performance and valitaion built in and swagger-api documation support , but small comunity compare to expresJs 



appWrite:-
        image store and public access url for cover image and its simple storge with minimal configs, its simple to bucket and file storage api ready made provide,


cherrio:-
        used for scraping ibm and langchain blogs , its a lightweight and efficint for extracting article and conent from blogs.



typegoose :-
            create strong typed mongodb modules using its class , its improv developer experince and storng type for data safty compare to tarditionl models


mongoDb:-
        used for database to store blog and other things in this app blogs semi-strucure status and other so its provde flexibilty for storing data


redis:-
    in this app redis used for bullmq queues , job stats , asynchronous processing


bullMq:-
    used for backgourd job process, blog scrapng and Ai rewrite thast work are long runnign tast so thast why use this for should not block api request


