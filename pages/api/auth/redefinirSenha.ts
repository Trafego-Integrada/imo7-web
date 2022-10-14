import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { getUser } from "@/services/database/user";
import { NextApiRequestWithUser } from "@/types/auth";
import { checkAuth } from "@/middleware/checkAuth";
import { mail } from "@/services/mail";
import { layoutRecuperarSenha } from "@/lib/layoutEmail";
import bcrypt from "bcryptjs";
const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.post(async (req, res) => {
    const { codigo, password, confirmPassword } = req.body;
    if (!codigo || !password || !confirmPassword) {
        return res
            .status(400)
            .json({ error: true, message: "Requisição inválida" });
    }
    if (password != confirmPassword) {
        return res
            .status(400)
            .json({ error: true, message: "Senhas inválidas" });
    }
    const recuperacao = await prisma.recuperarSenha.findFirst({
        where: {
            hash: codigo,
            utilizado: false,
        },
    });
    if (!recuperacao) {
        return res.status(400).json({
            error: true,
            message: "Requisição inválida, tente refazer a operação",
        });
    } else {
        await prisma.recuperarSenha.update({
            where: {
                id: recuperacao.id,
            },
            data: {
                utilizado: true,
            },
        });
        await prisma.usuario.update({
            where: {
                id: recuperacao.usuarioId,
            },
            data: {
                passwordHash: bcrypt.hashSync(password, 10),
            },
        });

        return res.json();
    }
});

export default handler;
