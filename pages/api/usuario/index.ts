import nextConnect from "next-connect";
import prisma from "../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    try {
        const {
            filtro,
            nome,
            documento,
            telefone,
            pagina,
            linhas,
            inquilino,
            proprietario,
        } = req.query;

        let filtroQuery = {};

        if (filtro) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        nome: {
                            contains: filtro,
                        },
                    },
                ],
            };
        }
        if (nome) {
            filtroQuery = {
                ...filtroQuery,
                nome: {
                    contains: nome,
                },
            };
        }
        if (telefone) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        telefone: {
                            contains: telefone,
                        },
                    },
                    {
                        celular: {
                            contains: telefone,
                        },
                    },
                ],
            };
        }
        if (documento) {
            filtroQuery = {
                ...filtroQuery,
                docmento: {
                    contains: documento,
                },
            };
        }
        if (inquilino) {
            filtroQuery = {
                ...filtroQuery,
                contratosInquilino: {
                    some: {},
                },
            };
        }
        if (proprietario) {
            filtroQuery = {
                ...filtroQuery,
                contratosProprietario: {
                    some: {},
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

        const data = await prisma.usuario.findMany({
            where: {
                ...filtroQuery,
            },
            ...paginacao,
        });
        const total = await prisma.usuario.count({
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
