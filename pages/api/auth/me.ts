import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "../../../lib/prisma";
import checkAuth from "../../../middleware/checkAuth";
import { getUser } from "../../../services/database/user";
import { NextApiRequestWithUser } from "../../../types/auth";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(checkAuth);
handler.get(async (req, res) => {
    const { document } = req.user;
    console.log(document);
    const user = await getUser({ document });
    let account = null;
    if (req.query.accountId) {
        account = await prisma.account.findFirst({
            where: {
                id: Number(req.query.accountId),
                userId: user.id,
            },
        });
    }

    if (!user) {
        return res
            .status(400)
            .json({ error: true, message: "User not found." });
    }

    return res.json({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        document,
        email: user.email,
        permissions: user.permissions,
        roles: user.roles,
        account: account ? account : null,
    });
});

export default handler;
