import nextConnect from "next-connect";
import prisma from "../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    try {
        const { filtro, pagina, linhas } = req.query;

        let filtroQuery = {};
        if (filtro) {
            if (filtro.filtro) {
                filtroQuery = {
                    ...filtroQuery,
                    OR: [
                        {
                            beneficiario: {
                                contains: filtro.filtro,
                            },
                        },
                        {
                            contrato: {
                                codigo: filtro.filtro,
                            },
                        },
                        {
                            contrato: {
                                fiadores: {
                                    some: {
                                        OR: [
                                            {
                                                nome: {
                                                    contains: filtro.filtro,
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            contrato: {
                                proprietarios: {
                                    some: {
                                        OR: [
                                            {
                                                nome: {
                                                    contains: filtro.filtro,
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            contrato: {
                                inquilinos: {
                                    some: {
                                        OR: [
                                            {
                                                nome: {
                                                    contains: filtro.filtro,
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    ],
                };
            }
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

        const data = await prisma.boleto.findMany({
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
                    },
                },
                imobiliaria: true,
                inquilino: true,
            },
        });
        const total = await prisma.boleto.count({
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
