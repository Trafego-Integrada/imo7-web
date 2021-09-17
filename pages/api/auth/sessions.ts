import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { generateJwtAndRefreshToken } from "../../../services/auth";
import { getUser } from "../../../services/database/user";
import { CreateSessionDTO } from "../../../types/auth";
import bcrypt from "bcryptjs";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
    const { document, password } = req.body as CreateSessionDTO;

    const user = await getUser({ document });
    if (!user) {
        return res.status(401).json({
            error: true,
            message: "Usuário não cadastrado",
        });
    }
    if (
        !user ||
        (user.passwordHash && !bcrypt.compareSync(password, user.passwordHash))
    ) {
        return res.status(401).json({
            error: true,
            message: "E-mail ou senha inválido.",
        });
    }

    const { token, refreshToken } = await generateJwtAndRefreshToken(document, {
        permissions: user.permissions,
        roles: user.roles,
    });

    return res.json({
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
        document: user.document,
        token,
        refreshToken,
        permissions: user.permissions,
        roles: user.roles,
    });
});

export default handler;
