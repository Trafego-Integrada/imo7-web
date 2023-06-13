import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.reguaCobranca.findUnique({
        where: {
            id,
        },
    });

    res.send(data);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const { tipo, tipoEnvio, formaEnvio, assunto, conteudo } = req.body;

    const data = await prisma.reguaCobranca.update({
        where: {
            id,
        },
        data: {
            tipo,
            tipoEnvio,
            formaEnvio,
            assunto,
            conteudo,
        },
    });
    res.send(data);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.reguaCobranca.findFirst({
        where: {
            id,
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "U01",
            message: "Regua não encontrada",
        });
    }
    await prisma.reguaCobranca.delete({
        where: { id },
    });
    res.send();
});

export default handle;
