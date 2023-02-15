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
        let filtroQuery: Prisma.CampoFichaCadastralWhereInput = {};

        if (tipoFicha) {
            filtroQuery = {
                ...filtroQuery,
                tipoFicha,
            };
        }

        const data = await prisma.campoFichaCadastral.findMany({
            where: {
                ...filtroQuery,
            },
            include: {
                categoria: true,
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