import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import addUserToRequest from "../../../middleware/addUserToRequest";
import { generateJwtAndRefreshToken } from "../../../services/auth";
import {
    checkRefreshTokenIsValid,
    invalidateRefreshToken,
} from "../../../services/database/auth";
import { getUser } from "../../../services/database/user";
import { NextApiRequestWithUser } from "../../../types/auth";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(addUserToRequest);

handler.post(async (req, res) => {
    const { document } = req.user;
    const { refreshToken } = req.body;

    const user = await getUser({ document });

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
        document,
        refreshToken
    );

    if (!isValidRefreshToken) {
        return res
            .status(401)
            .json({ error: true, message: "Refresh token is invalid." });
    }

    await invalidateRefreshToken(document, refreshToken);

    const { token, refreshToken: newRefreshToken } =
        await generateJwtAndRefreshToken(document, {
            permissions: user.permissions,
            roles: user.roles,
        });

    return res.json({
        name: user.name,
        avatar: user.avatar,
        document: user.document,
        email: user.email,
        token,
        refreshToken: newRefreshToken,
        permissions: user.permissions,
        roles: user.roles,
    });
});

export default handler;
