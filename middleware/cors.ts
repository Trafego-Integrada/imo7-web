import nextConnect from "next-connect";
import NextCors from "nextjs-cors";

const handle = nextConnect();

handle.use(async (req, res, next) => {
    await NextCors(req, res, {
        // Options
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: "*",
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    return next();
});

export const cors = handle;
