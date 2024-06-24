import { removerCaracteresEspeciais } from "@/helpers/helpers";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";
import moment from "moment";
import nextConnect from "next-connect";

const handle = nextConnect();

handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        let { createdAt, deletedAt, campoCodigo, token } = req.query;

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

        if (JSON.parse(token)) {
            filtroQuery = {
                ...filtroQuery,
                resultado: { contains: '"token"' }
            };
        }

        if (createdAt) {
            createdAt = JSON.parse(createdAt);
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    {
                        createAt: {
                            gte: createdAt[0]
                                ? moment(createdAt[0]).startOf("d").format()
                                : null,
                            lte: createdAt[1]
                                ? moment(createdAt[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }

        const data = await prisma.validacaoFacial.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId: req?.user?.imobiliariaId,
            },
            include: {
                ValidacaoFacialHistorico: true,
                ficha: {
                    select: {
                        nome: true,
                        id: true,
                        Processo: {
                            select: {
                                imovel: {
                                    select: {
                                        bairro: true,
                                        endereco: true,
                                        numero: true,
                                        complemento: true,
                                        estado: true
                                    }
                                }
                            }
                        }
                    },
                }
            },
            orderBy: {
                createAt: "desc"
            }
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
