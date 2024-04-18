import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id, usuarioId, cursor } = req.query;
    let withCursor = {};

    if (cursor != 0) {
        withCursor = {
            skip: 1,
            cursor: {
                id: Number(cursor),
            },
        };
    }

    const data = await prisma.historicoChamado.findMany({
        where: {
            chamadoId: Number(id),
        },
        ...withCursor,
        take: 10,
        include: {
            usuario: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const total = await prisma.historicoChamado.count({
        where: {
            chamadoId: Number(id),
        },
    });
    //console.log(data);
    const lastPostInResults = data[data.length - 1];
    const myCursor = lastPostInResults?.id ? lastPostInResults.id : null;
    res.send({ data, total, nextCursor: myCursor });
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const { descricao } = req.body;
    const data = await prisma.historicoChamado.create({
        data: {
            descricao,
            usuario: {
                connect: {
                    id: Number(req.user.id),
                },
            },
            chamado: {
                connect: {
                    id: Number(id),
                },
            },
        },
    });
    res.send(data);
});

export default handle;
