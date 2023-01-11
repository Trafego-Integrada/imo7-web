import { Prisma } from "@prisma/client";
import moment from "moment";
import nextConnect from "next-connect";
import prisma from "../../../lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    try {
        const {
            query,
            codigo,
            inquilino,
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
        } = req.query;

        let filtroQuery: Prisma.BoletoWhereInput = {};
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
                        data_vencimen: {
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
                contrato: {
                    id: Number(contratoId),
                },
            };
        }
        if (codigo) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    codigo: {
                        contains: codigo,
                    },
                },
            };
        }
        if (vencimento) {
            filtroQuery = {
                ...filtroQuery,
                data_vencimen: moment(vencimento).format(),
            };
        }
        if (inquilino) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    inquilinos: {
                        every: {
                            nome: {
                                contains: inquilino,
                            },
                        },
                    },
                },
            };
        }
        if (endereco) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    imovel: {
                        endereco: {
                            contains: endereco,
                        },
                    },
                },
            };
        }
        if (numero) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    imovel: {
                        numero: {
                            contains: numero,
                        },
                    },
                },
            };
        }
        if (bairro) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    imovel: {
                        bairro: {
                            contains: bairro,
                        },
                    },
                },
            };
        }
        if (cidade) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    imovel: {
                        cidade: {
                            contains: cidade,
                        },
                    },
                },
            };
        }
        if (estado) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    imovel: {
                        estado: {
                            contains: estado,
                        },
                    },
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

        const data = await prisma.departamentoChamado.findMany({
            where: {
                ...filtroQuery,
            },
            ...paginacao,
            include: {
                AssuntoChamado: true,
            },
        });
        const total = await prisma.departamentoChamado.count({
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

export default handle;
