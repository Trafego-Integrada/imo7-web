import nextConnect from "next-connect";

import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();

handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    const { tabela, tabelaId } = req.query;
    const data = await prisma.historico.findMany({
        where: {
            tabela,
            tabelaId,
        },
        orderBy: {
            createdAt: "asc",
        },
        include: {
            usuario: true,
        },
    });
    return res.send(data);
});

handle.post(async (req, res) => {
    try {
        const { descricao, tabela, tabelaId } = req.body;

        const data = await prisma.historico.create({
            data: {
                descricao,
                tabela,
                tabelaId,
                usuario: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });
        return res.send(data);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
});

export default handle;
