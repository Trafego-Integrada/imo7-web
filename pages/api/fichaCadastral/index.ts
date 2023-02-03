import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";

const handle = nextConnect();
handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        const { tipoFicha } = req.query;
        let filtroQuery: Prisma.FichaCadastralWhereInput = {};

        if (tipoFicha) {
            filtroQuery = {
                ...filtroQuery,
            };
        }

        const data = await prisma.fichaCadastral.findMany({
            where: {
                ...filtroQuery,
                imobiliaria: {
                    id: req.user.imobiliariaId,
                },
            },
        });

        const count = await prisma.fichaCadastral.count({
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
        const { tipo, descricao } = req.body;
        res.send();
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
