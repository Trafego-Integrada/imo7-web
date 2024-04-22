import prisma from "@/lib/prisma";
import { format, parse } from "date-fns";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handle = nextConnect<NextApiRequest, NextApiResponse>();

handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    const data = await prisma.consultaNetrin.findMany({
        where: {
            AND: { imobiliariaId: req.user.imobiliariaId }
        },
        select: { createdAt: true }
    })

    const count = data.filter(({ createdAt }) => createdAt && (format(createdAt, 'yyyy-mm') === format(new Date(), 'yyyy-mm'))).length

    res.send(count);
});

export default handle
