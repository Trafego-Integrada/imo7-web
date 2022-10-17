import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "../../../../../lib/prisma";

const handle = nextConnect();
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id, usuarioId } = req.query;
    const data = await prisma.conversaChamado.findMany({
        where: {
            chamadoId: Number(id),
            participantes: usuarioId
                ? {
                      some: {
                          id: Number(usuarioId),
                      },
                  }
                : {},
        },
        include: {
            interacoes: true,
            participantes: true,
        },
        orderBy: {
            id: "asc",
        },
    });
    res.send(data);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const { participantes } = req.body;
    const data = await prisma.conversaChamado.create({
        data: {
            chamado: {
                connect: {
                    id: Number(id),
                },
            },
            criador: {
                connect: {
                    id: req.user.id,
                },
            },
            participantes: {
                connect: participantes.map((item) => {
                    return {
                        id: Number(item.id),
                    };
                }),
            },
        },
    });
    res.send(data);
});

export default handle;