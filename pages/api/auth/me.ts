import { NextApiRequest, NextApiResponse } from "next";

import { getUser } from "@/services/database/user";
import { NextApiRequestWithUser } from "@/types/auth";
import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";

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
        imobiliaria: user.imobiliaria,
        imobiliariaId: user.imobiliariaId,
        conta: user.conta ? user.conta[0] : null,
    });
});

export default handler;
