import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        await prisma.contato.create({
            data: { nome, email, telefone },
        });
        res.send();
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

export default handler;
