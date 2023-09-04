import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.processo.findUnique({
        where: {
            id,
        },
        include: {
            fichas: {
                where: {
                    deletedAt: null,
                },
                include: {
                    preenchimento: {
                        include: {
                            campo: true,
                            ficha: {
                                include: {
                                    modelo: true,
                                },
                            },
                        },
                    },
                    modelo: true,
                    responsavel: true,
                },
            },
            imovel: true,
            responsavel: true,
        },
    });
    res.send(data);
});
handle.put(async (req, res) => {
    const { id } = req.query;
    const {
        tipoProcesso,
        campos,
        imovelId,
        fichas,
        observacoes,
        responsavelId,
        status,
    } = req.body;
    const data = await prisma.processo.update({
        where: {
            id,
        },
        data: {
            tipoProcesso,
            campos,
            status,
            observacoes,
            imovel: {
                connect: {
                    id: Number(imovelId),
                },
            },
            responsavel: {
                connect: {
                    id: Number(responsavelId),
                },
            },
        },
    });
    res.send(data);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.processo.delete({
        where: {
            id,
        },
    });
    res.send(data);
});

export default handle;
