import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
handle.use(cors);
handle.use(checkAuth);
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
            _count: {
                select: {
                    Anexo: true,
                    ConsultaNetrin: true,
                    fichas: {
                        where: {
                            deletedAt: null,
                        },
                    },
                },
            },
        },
    });
    res.send(data);
});
handle.put(async (req, res) => {
    try {
        const { id } = req.query;
        const {
            tipoProcesso,
            tipoGarantia,
            campos,
            imovelId,
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
                tipoGarantia: tipoGarantia ? tipoGarantia : "NENHUMA",
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
    } catch (error) {
        res.status(500).send({
            message: error?.message,
        });
    }
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
