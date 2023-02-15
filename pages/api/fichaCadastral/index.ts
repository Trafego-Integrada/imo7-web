import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";
import moment from "moment";

const handle = nextConnect();
handle.use(cors);
handle.use(checkAuth);

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
        } = req.query;
        let filtroQuery: Prisma.FichaCadastralWhereInput = { AND: [] };

        if (tipoFicha) {
            filtroQuery = {
                ...filtroQuery,
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
                    id: req.user.imobiliariaId,
                },
            },
            include: {
                preenchimento: true,
                modelo: true,
                responsavel: true,
            },
        });

        const count = await prisma.fichaCadastral.count({
            where: {
                ...filtroQuery,
                imobiliaria: {
                    id: req.user.imobiliariaId,
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
handle.post(async (req, res) => {
    try {
        const { modelo, descricao, nome, documento, email, telefone } =
            req.body;
        const data = await prisma.fichaCadastral.create({
            data: {
                modelo: {
                    connect: {
                        id: modelo.id,
                    },
                },
                descricao,
                nome,
                documento,
                email,
                telefone,
                status: "aguardando",
                imobiliaria: {
                    connect: {
                        id: req.user.imobiliariaId,
                    },
                },
                responsavel: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
