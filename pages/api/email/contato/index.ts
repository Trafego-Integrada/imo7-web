import { layoutContato } from "@/lib/layoutEmail";
import sgMail from "@/services/mail/sendgrid";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
    try {
        const { nome, email, telefone, mensagem } = req.body;
        await sgMail.send({
            from: "nao-responda@imo7.com.br",
            to: "ramerson@trafegointegrada.com.br,nayara@trafegointegrada.com.br,ramersonmodesto@gmail.com",
            subject: "Contato via Site IMO7",
            html: layoutContato({
                nome,
                email,
                telefone,
                mensagem: mensagem ? mensagem : "Contato via Site",
            }),
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: (error as Error).message
        });
    } finally {
        res.end();
    }
});

export default handler;
