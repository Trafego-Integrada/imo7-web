import { NextApiRequest, NextApiResponse } from "next";

import { NextApiRequestWithUser } from "@/types/auth";
import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import { cors } from "@/middleware/cors";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(cors);
// handler.use(checkAuth);

handler.get(async (req, res) => {

    //console.log("Teste");
    return res.send("123");
    
});

export default handler;
