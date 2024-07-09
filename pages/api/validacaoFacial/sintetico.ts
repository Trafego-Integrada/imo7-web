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

        let filtroValidacaoFacial: Prisma.ValidacaoFacialWhereInput = { AND: [], pin: { not: null } };
        let filtroImobiliaria: Prisma.ImobiliariaWhereInput = {}

        if (deletedAt) {
            filtroValidacaoFacial = {
                ...filtroValidacaoFacial,
                deletedAt: {
                    not: null,
                },
            };
        } else {
            filtroValidacaoFacial = {
                ...filtroValidacaoFacial,
                deletedAt: null,
            };
        }

        if (createdAt) {
            createdAt = JSON.parse(createdAt);
            if (!filtroValidacaoFacial.AND) {
                filtroValidacaoFacial = {
                    ...filtroValidacaoFacial,
                    AND: [],
                };
            }
            filtroValidacaoFacial = {
                ...filtroValidacaoFacial,
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

        if (nomeImobiliaria) {
            filtroImobiliaria = {
                ...filtroImobiliaria,
                razaoSocial: {
                    contains: nomeImobiliaria
                }
            }
        }

        const imobiliarias = await prisma.imobiliaria.findMany({
            where: {
                ...filtroImobiliaria
            },
            include: {
                ValidacaoFacial: {
                    where: {
                        ...filtroValidacaoFacial
                    }
                }
            },
        });

        const data = imobiliarias
            .filter(({ ValidacaoFacial }) => ValidacaoFacial.length > 0)
            .map(({ ValidacaoFacial, razaoSocial, id }) => {
                return {
                    id,
                    razaoSocial,
                    totalValidacaoFacial: ValidacaoFacial.length
                }
            })

        res.send(data);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle