import { emailBoleto, emailExtrato } from "@/lib/layoutEmail";
import prisma from "@/lib/prisma";
import { mail } from "@/services/mail";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    try {
        const { from, to, bcc, subject, body, headers } = req.body;
        const email = await mail.sendMail({
            from,
            to,
            subject,
            html: body,
            headers,
        });

        return res.send({ success: true });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message,
        });
    }
});

export default handler;
