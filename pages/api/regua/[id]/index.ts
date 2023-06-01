import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
handle.use(cors);
handle.use(checkAuth);

//FIND
handle.get(async (req, res) => {
    try {
        const { id } = req.query;
        const data = await prisma.regraNotificacao.findFirst({
            where: { id: Number(id) },
            include: {
                tipoEnvio: true,
            },
        });

        res.send({
            tipo: data.tipoEnvioId,
            dias: data.diasReferencia,
            hora: data.horaEnvio ?? "",
            canalMidia: data.canalMidiaId,
            ...data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

//UPDATE
handle.post(async (req, res) => {
    try {
        const { id } = req.query;
        console.log("update", id);
        const { tipo, dias, assunto, mensagem, hora } = req.body;
        const data = await prisma.regraNotificacao.update({
            where: {
                id: Number(id),
            },
            data: {
                tipoEnvioId: tipo,
                diasReferencia: Number(dias),
                assunto: assunto,
                mensagem: mensagem,
                horaEnvio: hora || null,
            },
        });

        res.send({
            ...data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
//DELETE
handle.delete(async (req, res) => {
    //softdelete
    const { id } = req.query;
    console.log("delete", id);
    const data = await prisma.regraNotificacao.delete({
        where: { id: Number(id) },
    });

    res.send(data);
});

export default handle;
