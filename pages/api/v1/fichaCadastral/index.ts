import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";
import moment from "moment";
import nextConnect from "next-connect";

const handle = nextConnect();
handle.use(cors);
handle.get(async (req, res) => {
    try {
        let {
            tipoFicha,
            query,
            createdAt,
            updatedAt,
            status,
            responsaveis,
            identificacao,
            deletedAt,
            codigo,
            imobiliariaId
        } = req.query;
        let filtroQuery: Prisma.FichaCadastralWhereInput = { AND: [] };

        if (tipoFicha) {
            filtroQuery = {
                ...filtroQuery,
            };
        }
        console.log(req.query);
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

        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        nome: {
                            contains: query,
                        },
                    },
                    {
                        descricao: {
                            contains: query,
                        },
                    },
                    {
                        documento: {
                            contains: query,
                        },
                    },
                    {
                        telefone: {
                            contains: query,
                        },
                    },
                    {
                        email: {
                            contains: query,
                        },
                    },
                    {
                        modelo: {
                            nome: {
                                contains: query,
                            },
                        },
                    },
                ],
            };
        }
        if (identificacao) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        OR: [
                            {
                                nome: {
                                    contains: identificacao,
                                },
                            },
                            {
                                documento: {
                                    contains: identificacao,
                                },
                            },
                            {
                                telefone: {
                                    contains: identificacao,
                                },
                            },
                            {
                                email: {
                                    contains: identificacao,
                                },
                            },
                        ],
                    },
                ],
            };
        }
        if (codigo) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        codigo: Number(codigo),
                    },
                ],
            };
        }
        if (createdAt) {
            createdAt = JSON.parse(createdAt);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        createdAt: {
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
        if (updatedAt) {
            updatedAt = JSON.parse(updatedAt);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        updatedAt: {
                            gte: updatedAt[0]
                                ? moment(updatedAt[0]).startOf("d").format()
                                : null,
                            lte: updatedAt[1]
                                ? moment(updatedAt[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }
        if (status) {
            status = JSON.parse(status);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        status: {
                            in: status,
                        },
                    },
                ],
            };
        }
        if (responsaveis) {
            responsaveis = JSON.parse(responsaveis);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        responsavel: {
                            id: {
                                in: responsaveis.map((i) => i.id),
                            },
                        },
                    },
                ],
            };
        }
        console.log(filtroQuery);
        const data = await prisma.fichaCadastral.findMany({
            where: {
                ...filtroQuery,

                imobiliaria: {
                    id: Number(imobiliariaId)
                },
            },
            include: {
                preenchimento: true,
                responsavel: true,
            },
        });

        const count = await prisma.fichaCadastral.count({
            where: {
                ...filtroQuery,
                imobiliaria: {
                    id: Number(imobiliariaId)
                },
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


export default handle;