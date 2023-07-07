import { cors } from "@/middleware/cors";
import { generateJwtAndRefreshToken } from "@/services/auth";
import { getUser } from "@/services/database/user";
import { CreateSessionDTO } from "@/types/auth";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(cors);
handler.get(async (req, res) => {
    const { documento } = req.query;
    const { imobiliaria } = req.headers;

    const user = await getUser({ documento, imobiliaria });
    if (!user) {
        return res.status(401).json({
            error: true,
            message: "Usuário não cadastrado",
        });
    }
    if (!user.status) {
        return res.status(401).json({
            error: true,
            message: "Usuário inátivo, contate o administrador.",
        });
    }

    return res.json({
        id: user.id,
        nome: user.nome,
        atualizar: user.senhaHash ? false : true,
    });
});

handler.post(async (req, res) => {
    const { imobiliaria } = req.headers;
    const { documento, password } = req.body as CreateSessionDTO;

    const user = await getUser({ documento: documento, imobiliaria });
    if (!user) {
        return res.status(401).json({
            error: true,
            message: "Usuário não cadastrado",
        });
    }
    if (!user.status) {
        return res.status(401).json({
            error: true,
            message: "Usuário inátivo, contate o administrador.",
        });
    }
    if (
        !user ||
        (user.senhaHash && !bcrypt.compareSync(password, user.senhaHash))
    ) {
        return res.status(401).json({
            error: true,
            message: "CPF ou senha inválido.",
        });
    }

    const { token, refreshToken } = await generateJwtAndRefreshToken(user.id, {
        permissoes: user.permissoes,
        cargos: user.cargos,
    });

    return res.json({
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        nome: user.nome,
        documento: user.documento,
        token,
        refreshToken,
        permissoes: user.permissoes,
        cargos: user.cargos,
        imobiliaria: user.imobiliaria,
        imobiliariaId: user.imobiliariaId,
        conta: user.conta,
        modulos: user.modulos,
    });
});

export default handler;
