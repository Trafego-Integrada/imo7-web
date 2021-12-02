import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";
import checkAuth from "../../../../middleware/checkAuth";
import { getUser } from "../../../../services/database/user";
import { NextApiRequestWithUser } from "../../../../types/auth";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(checkAuth);
handler.get(async (req, res) => {
    const { documento } = req.user;
    console.log(documento);
    const user = await getUser({ documento });

    if (!user) {
        return res
            .status(400)
            .json({ error: true, message: "User not found." });
    }

    return res.json({
        id: user.id,
        nome: user.nome,
        documento,
        email: user.email,
        permissoes: user.permissoes,
        cargos: user.cargos,
    });
});

export default handler;
