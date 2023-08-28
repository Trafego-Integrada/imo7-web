import { Prisma } from "@prisma/client";
import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    try {
        let {
            query,
            pagina,
            linhas,
            endereco,
            numero,
            bairro,
            cidade,
            estado,
            codigo,
            codigoImovel,
            dataCriacao,
        } = req.query;

        let filtroQuery: Prisma.ProcessoWhereInput = {};
        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        codigo: Number(query),
                    },
                    {
                        fichas: {
                            some: {
                                nome: query,
                            },
                        },
                    },
                    {
                        fichas: {
                            some: {
                                descricao: query,
                            },
                        },
                    },
                    {
                        imovel: {
                            codigo: {
                                contains: query,
                            },
                        },
                    },
                ],
            };
        }

        if (endereco) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            endereco: {
                                contains: endereco,
                            },
                        },
                    },
                ],
            };
        }
        if (
            !req.user.permissoes.includes(
                "imobiliaria.processos.visualizarTodos"
            )
        ) {
            filtroQuery = {
                ...filtroQuery,
                responsavelId: req.user.id,
            };
        }
        if (numero) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            numero: {
                                contains: numero,
                            },
                        },
                    },
                ],
            };
        }
        if (bairro) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            bairro: {
                                contains: bairro,
                            },
                        },
                    },
                ],
            };
        }
        if (cidade) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            cidade: {
                                contains: cidade,
                            },
                        },
                    },
                ],
            };
        }
        if (estado) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            estado: {
                                contains: estado,
                            },
                        },
                    },
                ],
            };
        }
        if (codigo) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
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
        if (codigoImovel) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            codigo: {
                                contains: codigoImovel,
                            },
                        },
                    },
                ],
            };
        }
        if (dataCriacao) {
            dataCriacao = JSON.parse(dataCriacao);
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        createdAt: {
                            gte: dataCriacao[0]
                                ? moment(dataCriacao[0]).startOf("d").format()
                                : null,
                            lte: dataCriacao[1]
                                ? moment(dataCriacao[1]).endOf("d").format()
                                : null,
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

        const data = await prisma.processo.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId: req.user?.imobiliariaId,
            },
            ...paginacao,
            include: {
                imovel: true,
                fichas: {
                    include: {
                        _count: {
                            select: {
                                preenchimento: {
                                    where: {
                                        valor: {
                                            not: null,
                                        },
                                    },
                                },
                            },
                        },
                        preenchimento: true,
                        modelo: true,
                    },
                },
                responsavel: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const total = await prisma.processo.count({
            where: {
                ...filtroQuery,
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
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
handle.post(async (req, res) => {
    try {
        const {
            tipoProcesso,
            campos,
            imovelId,
            fichas,
            observacoes,
            responsavelId,
        } = req.body;
        const ultimoProcesso = await prisma.processo.findFirst({
            where: {
                imobiliariaId: req.user.imobiliariaId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const data = await prisma.processo.create({
            data: {
                codigo: ultimoProcesso ? ultimoProcesso?.codigo + 1 : 1,
                tipoProcesso,
                campos,
                status: "EM_ANDAMENTO",
                fichas: {
                    createMany: {
                        data: fichas.map((f) => ({
                            modeloFichaCadastralId: f.modelo?.id,
                            nome: f.nome,
                            imobiliariaId: req.user.imobiliariaId,
                            imovelId,
                            responsavelId,
                        })),
                    },
                },
                observacoes,
                imovel: {
                    connect: {
                        id: imovelId,
                    },
                },
                imobiliaria: {
                    connect: {
                        id: req.user.imobiliariaId,
                    },
                },
                responsavel: {
                    connect: {
                        id: responsavelId,
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
