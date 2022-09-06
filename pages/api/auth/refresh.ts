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

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(addUserToRequest);

handler.post(async (req, res) => {
    const { documento } = req.user;
    const { refreshToken } = req.body;

    const user = await getUser({ documento });

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
        refreshToken
    );

    if (!isValidRefreshToken) {
        return res
            .status(401)
            .json({ error: true, message: "Refresh token is invalid." });
    }

    await invalidateRefreshToken(documento, refreshToken);

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
        conta: user.conta ? user.conta[0] : null,
    });
});

export default handler;
