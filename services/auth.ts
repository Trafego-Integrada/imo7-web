import jwt from "jsonwebtoken";

import { auth } from "../config/config";
import { createRefreshToken } from "./database/auth";

export async function generateJwtAndRefreshToken(
    document: string,
    payload: object = {}
) {
    const token = jwt.sign(payload, auth.secret, {
        subject: document,
        expiresIn: 60 * 15, // 15 minutes
    });

    const refreshToken = await createRefreshToken(document);

    return {
        token,
        refreshToken,
    };
}
