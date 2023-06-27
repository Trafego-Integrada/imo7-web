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

    console.log("QUERY VALIDACAO FACIAL")

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
        } = req.query;

        let filtroQuery: Prisma.FichaCadastralWhereInput = { AND: [] };


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

        const data = await prisma.validacaofacial.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const count = await prisma.validacaofacial.count({
            where: {
                ...filtroQuery,
                 imobiliariaId: req.user.imobiliariaId,
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
