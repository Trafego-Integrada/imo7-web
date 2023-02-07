import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";

const handle = nextConnect();
handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        const { tipoFicha, query } = req.query;
        let filtroQuery: Prisma.FichaCadastralWhereInput = {};

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
            },
        });

        const count = await prisma.fichaCadastral.count({
            where: {
                ...filtroQuery,
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
