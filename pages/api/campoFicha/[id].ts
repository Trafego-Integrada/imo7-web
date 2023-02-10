import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { providerStorage } from "@/lib/storage";
import * as os from "oci-objectstorage";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
import { cors } from "@/middleware/cors";
import { NextApiRequest, NextApiResponse } from "next";
handler.use(cors);
handler.get(async (req, res) => {
    try {
        const { id } = req.query;
        const data = await prisma.campoFichaCadastral.findUnique({
            where: {
                id,
            },
            include: {
                categoria: true,
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
handler.post(async (req, res) => {
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
        const data = await prisma.campoFichaCadastral.update({
            where: {
                id,
            },
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
handler.delete(async (req, res) => {
    try {
        const { id } = req.query;
        const data = await prisma.campoFichaCadastral.delete({
            where: {
                id,
            },
        });
        res.send();
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error,
        });
    }
});
export default handler;
