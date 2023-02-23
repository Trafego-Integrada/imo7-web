import jwtDecode from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { DecodedToken, NextApiRequestWithUser } from "@/types/auth";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            error: true,
            code: "token.invalid",
            message: "Token not present.",
        });
    }

    const [, token] = authorization?.split(" ");

    if (!token) {
        return res.status(401).json({
            error: true,
            code: "token.invalid",
            message: "Token not present.",
        });
    }

    try {
        const decoded = jwtDecode(token as string) as DecodedToken;

        const user = await prisma.usuario.findFirst({
            where: { id: Number(decoded.sub) },
        });
        if (!user.status) {
            return res.status(401).json({
                error: true,
                code: "user.status",
                message: "Usuário inativo",
            });
        }
        req.user = user;

        return next();
    } catch (err) {
        return res.status(401).json({
            error: true,
            code: "token.invalid",
            message: "Invalid token format.",
        });
    }
});

export default handler;
