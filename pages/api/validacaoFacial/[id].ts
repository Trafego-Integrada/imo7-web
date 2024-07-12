import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

const handle = nextConnect();

handle.use(cors);
handle.use(checkAuth);

handle.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query

    const result = await prisma.validacaoFacial.findUnique({
        where: {
            id
        },
    })

    return res.send(result)
});

export default handle;
