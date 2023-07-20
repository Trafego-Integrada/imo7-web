import { checkAuth } from "@/middleware/checkAuth";
import { Prisma } from "@prisma/client";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
handle.use(cors);
handle.get(checkAuth);
handle.get(async (req, res) => {
    try {
        const { imobiliaria } = req.headers;
        let {
            query,
            codigo,
            vencimento,
            proprietario,
            inquilino,
            fiador,
            endereco,
            numero,
            bairro,
            cidade,
            estado,
            pagina,
            linhas,
            proprietarioId,
            inquilinoId,
            dataReajuste,
            dataInicio,
            dataFim,
            dataCriacao,
            imobiliariaId,
        } = req.query;
        let filtroQuery: Prisma.ContratoWhereInput = {};
        imobiliariaId = req.user.imobiliariaId
            ? req.user.imobiliariaId
            : Number(imobiliariaId);
        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    ...filtroQuery.OR,
                    {
                        codigo: {
                            contains: query,
                        },
                    },
                    {
                        fiadores: {
                            some: {
                                OR: [
                                    {
                                        nome: {
                                            contains: query,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        proprietarios: {
                            some: {
                                OR: [
                                    {
                                        nome: {
                                            contains: query,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        inquilinos: {
                            some: {
                                OR: [
                                    {
                                        nome: {
                                            contains: query,
                                        },
                                    },
                                ],
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
                    {
                        codigo: {
                            contains: codigo,
                        },
                    },
                ],
            };
        }
        if (vencimento) {
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
                    { diaVencimento: Number(vencimento) },
                ],
            };
        }
        if (dataReajuste) {
            dataReajuste = JSON.parse(dataReajuste);
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
                        dataReajuste: {
                            gte: dataReajuste[0]
                                ? moment(dataReajuste[0]).startOf("d").format()
                                : null,
                            lte: dataReajuste[1]
                                ? moment(dataReajuste[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }
        if (dataInicio) {
            dataInicio = JSON.parse(dataInicio);
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
                        dataInicio: {
                            gte: dataInicio[0]
                                ? moment(dataInicio[0]).startOf("d").format()
                                : null,
                            lte: dataInicio[1]
                                ? moment(dataInicio[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }
        if (dataFim) {
            dataFim = JSON.parse(dataFim);
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
                        dataFim: {
                            gte: dataFim[0]
                                ? moment(dataFim[0]).startOf("d").format()
                                : null,
                            lte: dataFim[1]
                                ? moment(dataFim[1]).endOf("d").format()
                                : null,
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
        if (proprietario) {
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
                        proprietarios: {
                            every: {
                                nome: {
                                    contains: proprietario,
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (inquilino) {
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
                        inquilinos: {
                            every: {
                                nome: {
                                    contains: inquilino,
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (fiador) {
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
                        fiadores: {
                            every: {
                                nome: {
                                    contains: fiador,
                                },
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
        if (proprietarioId) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        proprietarios: {
                            some: {
                                id: Number(proprietarioId),
                            },
                        },
                    },
                ],
            };
        }
        if (inquilinoId) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    ...filtroQuery.OR,
                    {
                        inquilinos: {
                            some: {
                                id: Number(inquilinoId),
                            },
                        },
                    },
                ],
            };
        }
        if (imobiliariaId) {
            filtroQuery = {
                ...filtroQuery,
                imobiliaria: {
                    id: Number(imobiliariaId),
                },
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
        if (imobiliaria) {
            filtroQuery = {
                ...filtroQuery,
                imobiliaria: { url: imobiliaria },
            };
        }

        const data = await prisma.contrato.findMany({
            where: {
                ...filtroQuery,
            },
            ...paginacao,
            include: {
                imovel: true,
                inquilinos: true,
                proprietarios: true,
                fiadores: true,
            },
        });
        const total = await prisma.contrato.count({
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
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
handle.delete(async (req, res) => {
    try {
        const { ids } = req.query;
        let arrayIds = JSON.parse(ids);

        if (!arrayIds.length) {
            return res
                .status(400)
                .send({ success: false, message: "Nenhum id informado" });
        }

        await prisma.contrato.deleteMany({
            where: {
                id: {
                    in: arrayIds,
                },
            },
        });
        return res.send({ success: true });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error?.message,
        });
    }
});
export default handle;
