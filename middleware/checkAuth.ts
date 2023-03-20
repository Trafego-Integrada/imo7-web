import { auth } from "@/config/config";
import prisma from "@/lib/prisma";
import { DecodedToken } from "@/types/auth";
import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
    const { authorization, imobiliaria } = req.headers;

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
        const decoded = jwt.verify(
            token as string,
            auth.secret
        ) as DecodedToken;

        const user = await prisma.usuario.findUnique({
            where: { id: Number(decoded.sub) },
            include: {
                conta: true,
                imobiliaria: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                error: true,
                code: "user.naoExiste",
                message: "Usuário não existe",
            });
        }

        if (!user?.status) {
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
            code: "token.expired",
            message: "Token invalid.",
        });
    }
};
