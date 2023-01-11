import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { auth } from "../config/config";
import prisma from "../lib/prisma";
import { DecodedToken, NextApiRequestWithUser } from "../types/auth";

export const checkAuth = async (req, res, next) => {
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
