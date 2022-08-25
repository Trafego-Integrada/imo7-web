import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { generateJwtAndRefreshToken } from "@/services/auth";
import { getUser } from "@/services/database/user";
import { CreateSessionDTO } from "@/types/auth";
import bcrypt from "bcryptjs";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
    const { documento, password } = req.body as CreateSessionDTO;

    const user = await getUser({ documento: documento });
    if (!user) {
        return res.status(401).json({
            error: true,
            message: "Usuário não cadastrado",
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

    const { token, refreshToken } = await generateJwtAndRefreshToken(
        documento,
        {
            permissoes: user.permissoes,
            cargos: user.cargos,
        }
    );

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
    });
});

export default handler;
