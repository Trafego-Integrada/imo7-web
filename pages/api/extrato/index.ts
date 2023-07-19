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
        let {
            query,
            codigo,
            proprietario,
            dataInicio,
            vencimento,
            status,
            endereco,
            numero,
            bairro,
            cidade,
            estado,
            pagina,
            linhas,
            contratoId,
            dataVencimento,
            dataDeposito,
            dataCriacao,
            imobiliariaId,
        } = req.query;
        imobiliariaId = req.user.imobiliariaId
            ? req.user.imobiliariaId
            : Number(imobiliariaId);
        let filtroQuery: Prisma.ExtratoWhereInput = {
            AND: [],
        };
        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        contrato: {
                            codigo: {
                                contains: query,
                            },
                        },
                    },
                    {
                        vencimento: {
                            contains: query,
                        },
                    },
                    {
                        contrato: {
                            inquilinos: {
                                every: {
                                    nome: {
                                        contains: inquilino,
                                    },
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (contratoId) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        contrato: {
                            id: Number(contratoId),
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
                        contrato: {
                            codigo: {
                                contains: codigo,
                            },
                        },
                    },
                ],
            };
        }

        if (proprietario) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        contrato: {
                            proprietarios: {
                                every: {
                                    nome: {
                                        contains: proprietario,
                                    },
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (endereco) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        contrato: {
                            imovel: {
                                endereco: {
                                    contains: endereco,
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (numero) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        contrato: {
                            imovel: {
                                numero: {
                                    contains: numero,
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (bairro) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        contrato: {
                            imovel: {
                                bairro: {
                                    contains: bairro,
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (cidade) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        contrato: {
                            imovel: {
                                cidade: {
                                    contains: cidade,
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (estado) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        contrato: {
                            imovel: {
                                estado: {
                                    contains: estado,
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (dataVencimento) {
            dataVencimento = JSON.parse(dataVencimento);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        vencimento: {
                            gte: dataVencimento[0]
                                ? moment(dataVencimento[0])
                                      .utc()
                                      .startOf("d")
                                      .format()
                                : null,
                            lte: dataVencimento[1]
                                ? moment(dataVencimento[1])
                                      .utc()
                                      .endOf("d")
                                      .format()
                                : null,
                        },
                    },
                ],
            };
        }
        if (dataDeposito) {
            dataDeposito = JSON.parse(dataDeposito);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        dataDeposito: {
                            gte: dataDeposito[0]
                                ? moment(dataDeposito[0])
                                      .utc()
                                      .startOf("d")
                                      .format()
                                : null,
                            lte: dataDeposito[1]
                                ? moment(dataDeposito[1])
                                      .utc()
                                      .endOf("d")
                                      .format()
                                : null,
                        },
                    },
                ],
            };
        }
        if (dataCriacao) {
            dataCriacao = JSON.parse(dataCriacao);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        createdAt: {
                            gte: dataCriacao[0]
                                ? moment(dataCriacao[0])
                                      .utc()
                                      .startOf("d")
                                      .format()
                                : null,
                            lte: dataCriacao[1]
                                ? moment(dataCriacao[1])
                                      .utc()
                                      .endOf("d")
                                      .format()
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
        if (imobiliariaId) {
            filtroQuery = {
                ...filtroQuery,
                imobiliaria: {
                    id: Number(imobiliariaId),
                },
            };
        }
        const data = await prisma.extrato.findMany({
            where: {
                ...filtroQuery,
            },
            ...paginacao,
            include: {
                conta: true,
                contrato: {
                    include: {
                        imovel: true,
                        inquilinos: true,
                        proprietarios: true,
                    },
                },
                imobiliaria: true,
                proprietario: true,
                itens: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const total = await prisma.extrato.count({
            where: {
                ...filtroQuery,
                deletedAt: null,
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

handle.delete(async (req, res) => {
    try {
        const { ids } = req.query;
        let arrayIds = JSON.parse(ids);

        if (!arrayIds.length) {
            return res
                .status(400)
                .send({ success: false, message: "Nenhum id informado" });
        }

        await prisma.extrato.deleteMany({
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
