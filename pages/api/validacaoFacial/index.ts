import { removerCaracteresEspeciais } from "@/helpers/helpers";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";
import nextConnect from "next-connect";

const handle = nextConnect();

handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        let { deletedAt, campoCodigo } = req.query;

        let filtroQuery: Prisma.ValidacaoFacialWhereInput = { AND: [] };

        if (deletedAt) {
            filtroQuery = {
                ...filtroQuery,
                deletedAt: {
                    not: null,
                },
            };
        } else {
            filtroQuery = {
                ...filtroQuery,
                deletedAt: null,
            };
        }

        if (campoCodigo) {
            filtroQuery = {
                ...filtroQuery,
                fichaCadastralPreenchimentoCampoFichaCadastralCodigo: {
                    contains: campoCodigo,
                },
            };
        }

        const data = await prisma.validacaoFacial.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId: req?.user?.imobiliariaId,
            },
        });

        const count = await prisma.validacaoFacial.count({
            where: {
                ...filtroQuery,
                imobiliariaId: req?.user?.imobiliariaId,
            },
        });

        res.send({ data, total: count });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

handle.post(async (req, res) => {
    try {
        const { fichaCadastralId, cpf, campoFichaCadastralCodigo } = req.body;

        const data = await prisma.validacaoFacial.create({
            data: {
                cpf: removerCaracteresEspeciais(cpf),
                preenchimento: {
                    connect: {
                        fichaCadastralId_campoFichaCadastralCodigo: {
                            campoFichaCadastralCodigo,
                            fichaCadastralId,
                        },
                    },
                },
                ficha: {
                    connect: {
                        id: fichaCadastralId,
                    },
                },
                imobiliaria: {
                    connect: {
                        id: req.user.imobiliariaId,
                    },
                },
            },
        });
        return res.send({
            success: true,
            data,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
