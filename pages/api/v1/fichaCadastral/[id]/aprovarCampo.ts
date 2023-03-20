import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handler = nextConnect();
import { cors } from "@/middleware/cors";
import { ca } from "date-fns/locale";
handler.use(cors);

handler.post(async (req, res) => {
    try {
        const { id } = req.query;
        const { campoCodigo } = req.body;

        const data = await prisma.fichaCadastralPreenchimento.update({
            where: {
                fichaCadastralId_campoFichaCadastralCodigo: {
                    fichaCadastralId: id,
                    campoFichaCadastralCodigo: campoCodigo,
                },
            },
            data: {
                aprovado: true,
                motivoReprovacao: null,
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
export default handler;
