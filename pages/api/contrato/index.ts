import { checkAuth } from "@/middleware/checkAuth";
import { Prisma } from "@prisma/client";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(checkAuth);
handle.get(async (req, res) => {
    try {
        const { imobiliaria } = req.headers;
        const {
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
        } = req.query;
        let filtroQuery: Prisma.ContratoWhereInput = {};

        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
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
                codigo: {
                    contains: codigo,
                },
            };
        }
        if (vencimento) {
            filtroQuery = {
                ...filtroQuery,
                diaVencimento: Number(vencimento),
            };
        }
        if (proprietario) {
            filtroQuery = {
                ...filtroQuery,
                proprietarios: {
                    every: {
                        nome: {
                            contains: proprietario,
                        },
                    },
                },
            };
        }
        if (inquilino) {
            filtroQuery = {
                ...filtroQuery,
                inquilinos: {
                    every: {
                        nome: {
                            contains: inquilino,
                        },
                    },
                },
            };
        }
        if (fiador) {
            filtroQuery = {
                ...filtroQuery,
                fiadores: {
                    every: {
                        nome: {
                            contains: fiador,
                        },
                    },
                },
            };
        }
        if (endereco) {
            filtroQuery = {
                ...filtroQuery,
                imovel: {
                    endereco: {
                        contains: endereco,
                    },
                },
            };
        }
        if (numero) {
            filtroQuery = {
                ...filtroQuery,
                imovel: {
                    numero: {
                        contains: numero,
                    },
                },
            };
        }
        if (bairro) {
            filtroQuery = {
                ...filtroQuery,
                imovel: {
                    bairro: {
                        contains: bairro,
                    },
                },
            };
        }
        if (cidade) {
            filtroQuery = {
                ...filtroQuery,
                imovel: {
                    cidade: {
                        contains: cidade,
                    },
                },
            };
        }
        if (estado) {
            filtroQuery = {
                ...filtroQuery,
                imovel: {
                    estado: {
                        contains: estado,
                    },
                },
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

export default handle;
