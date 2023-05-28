import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
const handle = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    try {
        let { filtro, pagina, linhas, chamadoId } = req.query;
        let filtroQuery = {};

        if (filtro) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        razaoSocial: {
                            contains: filtro,
                        },
                    },
                ],
            };
        }

        let paginacao = {};
        if (pagina && linhas) {
            paginacao = {
                take: Number(linhas),
                skip:
                    pagina && pagina > 1
                        ? Number(pagina) * Number(linhas) - Number(linhas)
                        : 0,
            };
        }

        if (chamadoId) {
            filtroQuery = {
                ...filtroQuery,
                chamadoId: Number(chamadoId),
            };
        }
        const data = await prisma.orcamento.findMany({
            where: {
                ...filtroQuery,

                imobiliariaId: req.user.imobiliariaId,
            },
            ...paginacao,
            include: {
                prestador: true,
                solicitante: true,
                chamado: true,
            },
        });
        const total = await prisma.orcamento.count({
            where: {
                ...filtroQuery,

                imobiliariaId: req.user.imobiliariaId,
            },
        });
        res.send({
            success: true,
            data: {
                total,
                data,
            },
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

handle.post(async (req, res) => {
    try {
        const {
            dataVisita,
            observacoes,
            prestador,
            solicitante,
            valor,
            status,
            chamadoId,
        } = req.body;

        const data = await prisma.orcamento.create({
            data: {
                dataVisita: dataVisita ? moment(dataVisita).format() : null,
                observacoes,
                prestador: {
                    connect: {
                        id: prestador.id,
                    },
                },
                valor: valor.replace(",", "."),
                status,
                solicitante: {
                    connect: {
                        id: solicitante.id,
                    },
                },
                chamado: chamadoId
                    ? {
                          connect: {
                              id: Number(chamadoId),
                          },
                      }
                    : {},
                imobiliaria: {
                    connect: {
                        id: req.user.imobiliariaId,
                    },
                },
            },
        });
        if (chamadoId) {
            await prisma.historicoChamado.create({
                data: {
                    descricao: "Criou um orçamento",
                    chamado: {
                        connect: {
                            id: Number(chamadoId),
                        },
                    },
                    usuario: {
                        connect: {
                            id: req.user.id,
                        },
                    },
                },
            });
        }

        res.send(data);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
