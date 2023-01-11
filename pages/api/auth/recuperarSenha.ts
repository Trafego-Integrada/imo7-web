import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { getUser } from "@/services/database/user";
import { NextApiRequestWithUser } from "@/types/auth";
import { checkAuth } from "@/middleware/checkAuth";
import { mail } from "@/services/mail";
import { layoutRecuperarSenha } from "@/lib/layoutEmail";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();
import { cors } from "@/middleware/cors";
handler.use(cors);
handler.post(async (req, res) => {
    const { documento } = req.body;
    const user = await getUser({ documento });

    if (!user) {
        return res
            .status(400)
            .json({ error: true, message: "Usuário não encontrado." });
    } else {
        const recuperacao = await prisma.recuperarSenha.create({
            data: {
                usuario: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });
        mail.sendMail({
            from: "nao-responda@imo7.com.br",
            to: user.email,
            subject: "Recuperação de senha",
            html: layoutRecuperarSenha({
                ...user,
                codigoRecuperacao: recuperacao.hash,
            }),
        })
            .then((res) => console.log(res))
            .catch((res) => console.log(res));

        return res.json();
    }
});

export default handler;
