import { layoutContato } from "@/lib/layoutEmail";
import prisma from "@/lib/prisma";
import { mail } from "@/services/mail";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
    try {
        const { nome, email, telefone, mensagem } = req.body;
        await prisma.contato.create({
            data: { nome, email, telefone },
        });
        await mail.sendMail({
            from: "contato@trafegoimoveis.com.br",
            // to: "ramerson@trafegointegrada.com.br,ramerson@trafegointegrada.com.br,ramersonmodesto@gmail.com",
            to: "gabriel@treiv.com.br",
            subject: "Contato via Site IMO7",
            html: layoutContato({ nome, email, telefone, mensagem }),
        });
        res.send();
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

export default handler;
