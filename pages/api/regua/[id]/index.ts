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
        const { tipo, dias, assunto, mensagem, hora } = req.body;
        const imobiliaria = req.user.imobiliariaId;
        const data = await prisma.regraNotificacao.update({
             where: {
                id: Number(id),
                },
            data: {
                imobiliariaId: imobiliaria,
                tipoEnvioId: tipo,
                diasReferencia: dias,
                assunto: assunto,
                mensagem: mensagem,
                horaEnvio: hora ?? null
            },
        });

    res.send{
        data
    }
    } catch (error) {
         res.status(500).send({
            success: false,
            message: err.message,
        });
    }


});
//DELETE

handle.delete(async(req, res) => {
    //softdelete
    const {id} = req.query;
    const data = await prisma.regraNotificacao.update({
        where: {id: Number(id)},
        data:{
            deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        }
    })

    res.send(data);
})

export default handle;
