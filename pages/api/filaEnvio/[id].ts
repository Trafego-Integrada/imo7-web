import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(cors);
handler.delete(async (req, res) => {
    try {
        const { id } = req.query;
        const data = await prisma.filaEnvio.delete({
            where: {
                id,
            },
        });

        return res.send();
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message,
        });
    }
});

export default handler;
