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
        let { deletedAt, createdAt, nomeImobiliaria } = req.query;

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
                imobiliaria: { nomeFantasia: { contains: nomeImobiliaria } }
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
            select: {
                cpf: true,
                createAt: true,
                deletedAt: true,
                ficha: true,
                fichaCadastralId: true,
                fichaCadastralPreenchimentoCampoFichaCadastralCodigo: true,
                fichaCadastralPreenchimentoFichaCadastralId: true,
                fotoUrl: true,
                id: true,
                imobiliaria: true,
                imobiliariaId: true,
                pin: true,
                preenchimento: true,
                resultado: true,
                status: true,
            },
            orderBy: {
                createAt: "desc"
            }
        });

        const count = await prisma.validacaoFacial.count({
            where: {
                ...filtroQuery,
            },
        });

        const imobiliarias = await prisma.imobiliaria.findMany({
            select: { nomeFantasia: true, id: true }
        })

        res.send({ data, total: count, imobiliarias });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle