import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    try {
        const { filtro, pagina, linhas } = req.query;

        let filtroQuery = {};
        if (filtro) {
            if (filtro.codigo) {
                filtroQuery = {
                    ...filtroQuery,

                    OR: [
                        {
                            codigo: {
                                contains: filtro.codigo,
                            },
                        },
                        {
                            fiadores: {
                                some: {
                                    OR: [
                                        {
                                            nome: {
                                                contains: filtro,
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
                                                contains: filtro,
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
                                                contains: filtro,
                                            },
                                        },
                                    ],
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

        const data = await prisma.contrato.findMany({
            where: {
                ...filtroQuery,
            },
            ...paginacao,
            include: {
                imovel: true,
                inquilinos: true,
            },
        });
        const total = await prisma.contrato.count({});
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
