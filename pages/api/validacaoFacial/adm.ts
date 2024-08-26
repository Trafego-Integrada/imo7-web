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
        let { deletedAt, createdAt, nomeImobiliaria, token } = req.query;

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

        if (nomeImobiliaria) {
            filtroQuery = {
                ...filtroQuery,
                imobiliaria: {
                    OR: [
                        { razaoSocial: { contains: nomeImobiliaria } },
                        { nomeFantasia: { contains: nomeImobiliaria } }
                    ]
                }
            };
        }

        if (token === 'true') {
            filtroQuery = {
                ...filtroQuery,
                pin: {
                    not: null
                }
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
            },
            include: {
                ValidacaoFacialHistorico: true,
                imovel: {
                    select: {
                        bairro: true,
                        endereco: true,
                        numero: true,
                        complemento: true,
                        estado: true
                    }
                },
                imobiliaria: {
                    select: {
                        razaoSocial: true,
                    }
                },
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
                imobiliaria: {
                    razaoSocial: 'asc'
                }
            }
        });

        const imobiliarias = await prisma.imobiliaria.findMany({
            select: {
                id: true,
                razaoSocial: true
            }
        })

        const count = await prisma.validacaoFacial.count({
            where: {
                ...filtroQuery,
            },
        });

        res.send({ data, total: count, imobiliarias });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle