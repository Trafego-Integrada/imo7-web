import prisma from '@/lib/prisma'
import { checkAuth } from '@/middleware/checkAuth'
import { cors } from '@/middleware/cors'
import { Prisma } from '@prisma/client'
import moment from 'moment'
import nextConnect from 'next-connect'

const handle = nextConnect()

handle.use(cors)
handle.use(checkAuth)

handle.get(async (req, res) => {
    try {
        let { deletedAt, createdAt, nomeImobiliaria } = req.query;
        let filtroQueryConsultaNetrin: Prisma.ConsultaNetrinWhereInput = { AND: [] };
        let filtroQueryImobiliaria: Prisma.ImobiliariaWhereInput = { AND: [] };

        if (deletedAt) {
            filtroQueryConsultaNetrin = {
                ...filtroQueryConsultaNetrin,
                deletedAt: {
                    not: null,
                },
            };
        } else {
            filtroQueryConsultaNetrin = {
                ...filtroQueryConsultaNetrin,
                deletedAt: null,
            };
        }

        if (nomeImobiliaria) {
            filtroQueryImobiliaria = {
                ...filtroQueryImobiliaria,
                nomeFantasia: { contains: nomeImobiliaria }
            };
        }

        if (createdAt) {
            createdAt = JSON.parse(createdAt);
            if (!filtroQueryConsultaNetrin.AND) {
                filtroQueryConsultaNetrin = {
                    ...filtroQueryConsultaNetrin,
                    AND: [],
                };
            }
            filtroQueryConsultaNetrin = {
                ...filtroQueryConsultaNetrin,
                AND: [
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

        const imobiliarias = await prisma.imobiliaria.findMany({
            where: {
                ...filtroQueryImobiliaria
            },
            select: {
                id: true,
                nomeFantasia: true,
                limiteConsultas: true,
            }
        })

        let consultas: any[] = await Promise.all(imobiliarias.map(async (imobiliaria) => {
            const consultasEncontradas = await prisma.consultaNetrin.findMany({
                where: {
                    ...filtroQueryConsultaNetrin,
                    imobiliariaId: imobiliaria.id
                },
                select: {
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' }
            })
            const count = consultasEncontradas.length
            const excedeu = count - imobiliaria.limiteConsultas

            return { imobiliaria, consultas: consultasEncontradas, count, excedeu }
        }))

        const resultados = consultas.length
        res.send({ consultas, resultados })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
})

export default handle
