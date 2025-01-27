import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";
import nextConnect from "next-connect";

const handle = nextConnect();
handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        const { query, categoria, tipoFicha } = req.query;
        let filtroQuery: Prisma.CampoFichaCadastralWhereInput = {};
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
                        nome: {
                            contains: query,
                        },
                    },
                ],
            };
        }
        if (tipoFicha) {
            filtroQuery = {
                ...filtroQuery,
                tipoFicha,
            };
        }
        if (categoria) {
            filtroQuery = {
                ...filtroQuery,
                categoriaId: categoria,
            };
        }

        const data = await prisma.campoFichaCadastral.findMany({
            where: {
                ...filtroQuery,
            },
            include: {
                categoria: true,
                dependencia: true,
            },
        });

        const count = await prisma.campoFichaCadastral.count({
            where: {
                ...filtroQuery,
            },
        });

        res.send({ data, total: count });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
handle.post(async (req, res) => {
    try {
        const { id } = req.query;
        const {
            nome,
            descricao,
            ordem,
            colSpan,
            tipoCampo,
            tipoFicha,
            codigo,
            categoria,
            camposEndereco,
            opcoes,
            dependencia,
            dependenciaValor,
        } = req.body;
        const data = await prisma.campoFichaCadastral.create({
            data: {
                nome,
                descricao,
                ordem: Number(ordem),
                codigo,
                colSpan: colSpan ? Number(colSpan) : null,
                tipoCampo,
                categoria: {
                    connect: {
                        id: categoria.id,
                    },
                },
                tipoFicha,
                camposEndereco: camposEndereco ? camposEndereco : {},

                opcoes: opcoes ? opcoes : [],
                dependencia: dependencia
                    ? {
                          connect: {
                              id: dependencia.id,
                          },
                      }
                    : {},
                dependenciaValor: dependenciaValor
                    ? JSON.stringify(dependenciaValor)
                    : null,
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error,
        });
    }
});
export default handle;
