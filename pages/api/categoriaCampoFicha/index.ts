import nextConnect from "next-connect";

import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";
handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        const { tipoFicha } = req.query;
        let filtroQuery: Prisma.CategoriaCampoFichaCadastralWhereInput = {};

        if (tipoFicha) {
            filtroQuery = {
                ...filtroQuery,
                campos: {
                    some: {
                        tipoFicha,
                    },
                },
            };
        }

        const data = await prisma.categoriaCampoFichaCadastral.findMany({
            where: {
                ...filtroQuery,
            },
            include: {
                campos: {
                    where: {
                        tipoFicha,
                        deletedAt: null,
                    },
                    orderBy: {
                        ordem: "asc",
                    },
                    include: {
                        dependencia: true,
                    },
                },
            },
            orderBy: {
                ordem: "asc",
            },
        });

        const count = await prisma.categoriaCampoFichaCadastral.count({
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
        const { nome, descricao, ordem } = req.body;
        const data = await prisma.categoriaCampoFichaCadastral.create({
            data: {
                nome,
                descricao,
                ordem: Number(ordem),
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
