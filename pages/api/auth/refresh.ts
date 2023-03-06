import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import addUserToRequest from "@/middleware/addUserToRequest";
import { generateJwtAndRefreshToken } from "@/services/auth";
import {
    checkRefreshTokenIsValid,
    invalidateRefreshToken,
} from "@/services/database/auth";
import { getUser } from "@/services/database/user";
import { NextApiRequestWithUser } from "@/types/auth";
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();
handler.use(cors);
handler.use(checkAuth);

handler.post(async (req, res) => {
    const { documento, imobiliaria } = req.user;
    const { refreshToken } = req.body;
    console.log(imobiliaria);
    const user = await getUser({ documento, imobiliria: imobiliaria?.url });

    if (!user) {
        return res.status(401).json({
            error: true,
            message: "User not found.",
        });
    }

    if (!refreshToken) {
        return res
            .status(401)
            .json({ error: true, message: "Refresh token is required." });
    }

    const isValidRefreshToken = await checkRefreshTokenIsValid(
        documento,
        imobiliaria.url,
        refreshToken
    );

    if (!isValidRefreshToken) {
        return res
            .status(401)
            .json({ error: true, message: "Refresh token is invalid." });
    }

    await invalidateRefreshToken(refreshToken);

    const { token, refreshToken: newRefreshToken } =
        await generateJwtAndRefreshToken(documento, {
            permissoes: user.permissoes,
            cargos: user.cargos,
        });

    return res.json({
        nome: user.nome,
        avatar: user.avatar,
        documento: user.documento,
        email: user.email,
        token,
        refreshToken: newRefreshToken,
        permissoes: user.permissoes,
        cargos: user.cargos,
        imobiliaria: user.imobiliaria,
        imobiliariaId: user.imobiliariaId,
        conta: user.conta,
        modulos: user.modulos,
    });
});

export default handler;
