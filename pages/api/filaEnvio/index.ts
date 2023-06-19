import { emailBoleto, emailExtrato } from "@/lib/layoutEmail";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { mail } from "@/services/mail";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(cors);
handler.use(checkAuth);
handler.get(async (req, res) => {
    try {
        let {
            query,
            dataEnvio,
            previsaoEnvio,
            createdAt,
            nomeDestinatario,
            destinatario,
        } = req.query;
        let filtroQuery: Prisma.FilaEnvioWhereInput = {};
        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    ...filtroQuery.OR,
                    {
                        nomeDestinatario: {
                            contains: query,
                        },
                    },
                    {
                        destinatario: {
                            contains: query,
                        },
                    },
                    {
                        assunto: {
                            contains: query,
                        },
                    },
                ],
            };
        }
        if (nomeDestinatario) {
            filtroQuery = {
                ...filtroQuery,
                nomeDestinatario: {
                    contains: nomeDestinatario,
                },
            };
        }
        if (destinatario) {
            filtroQuery = {
                ...filtroQuery,
                destinatario: {
                    contains: destinatario,
                },
            };
        }
        if (dataEnvio) {
            dataEnvio = JSON.parse(dataEnvio);
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery?.AND,
                    {
                        dataEnvio: {
                            gte: dataEnvio[0]
                                ? moment(dataEnvio[0]).startOf("d").format()
                                : null,
                            lte: dataEnvio[1]
                                ? moment(dataEnvio[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
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
                    ...filtroQuery?.AND,
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
        if (previsaoEnvio) {
            previsaoEnvio = JSON.parse(previsaoEnvio);
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery?.AND,
                    {
                        previsaoEnvio: {
                            gte: previsaoEnvio[0]
                                ? moment(previsaoEnvio[0]).startOf("d").format()
                                : null,
                            lte: previsaoEnvio[1]
                                ? moment(previsaoEnvio[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }
        const data = await prisma.filaEnvio.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId: req.user?.imobiliariaId,
            },
            include: {
                reguaCobranca: true,
                imobiliaria: true,
            },
        });
        const total = await prisma.filaEnvio.count({
            where: {},
        });

        return res.send({ data, total });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message,
        });
    }
});

export default handler;
