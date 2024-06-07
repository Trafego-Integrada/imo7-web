import { layoutContato } from "@/lib/layoutEmail";
import prisma from "@/lib/prisma";
import sgMail from "@/services/mail/sendgrid";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
    try {
        const { nome, email, telefone, mensagem } = req.body;
        await prisma.contato.create({
            data: { nome, email, telefone },
        });
        await sgMail.send({
            from: "contato@imo7.com.br",
            // to: "ramerson@trafegointegrada.com.br,ramerson@trafegointegrada.com.br,ramersonmodesto@gmail.com",
            to: "ramerson@trafegointegrada.com.br",
            subject: "Contato via Site IMO7",
            html: layoutContato({ nome, email, telefone, mensagem }),
        });
        res.status(200).json();
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    } finally {
        res.end();
    }
});

export default handler;
