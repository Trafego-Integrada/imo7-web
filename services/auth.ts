import jwt from "jsonwebtoken";

import { auth } from "../config/config";
import { createRefreshToken } from "./database/auth";

export async function generateJwtAndRefreshToken(
    id: string,
    payload: object = {}
) {
    const token = jwt.sign(payload, auth.secret, {
        subject: id.toString(),
        expiresIn: 60 * 60 * 15, // 15 minutes
    });

    const refreshToken = await createRefreshToken(id);

    return {
        token,
        refreshToken,
    };
}
