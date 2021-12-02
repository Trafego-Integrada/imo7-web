import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import Auth from "../../../../../middleware/Auth";

interface NextApiRequestWithUser extends NextApiRequest {
    user: any;
}

function handle(req: NextApiRequestWithUser, res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            store(req, res);
            break;
        default:
            res.status(500).send("Método inválido");
            break;
    }
}

async function store(req: NextApiRequestWithUser, res: NextApiResponse) {
    const { mensagem } = req.body;
    if (!mensagem) {
        return res
            .status(403)
            .json({ message: "Preencha todos os campos obrigatórios" });
    }
    const chamado = await prisma.interacaoChamado.create({
        data: {
            mensagem,
            chamado: {
                connect: {
                    id: parseInt(req.query.id),
                },
            },
        },
    });

    res.status(201).json(chamado);
}

export default Auth(handle);
