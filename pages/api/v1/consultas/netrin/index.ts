import prisma from "@/lib/prisma";
import { format, parse } from "date-fns";
import { checkAuth } from "@/middleware/checkAuth";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { NextApiRequestWithUser } from "@/types/auth";
import { cors } from "@/middleware/cors";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(cors);
handler.use(checkAuth);

handler.get(async (req, res) => {
    const data = await prisma.consultaNetrin.findMany({
        where: { imobiliariaId: req.user.imobiliariaId },
        select: { createdAt: true }
    })

    const count = data.filter(({ createdAt }) => format(createdAt, 'yyyyMM') === format(new Date(), 'yyyyMM')).length

    res.send(count);
});

export default handler
