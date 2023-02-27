import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handler = nextConnect();
import { cors } from "@/middleware/cors";
handler.use(cors);

handler.post(async (req, res) => {
    try {
        const { id } = req.query;
        const { campoCodigo, motivoReprovacao } = req.body;

        const data = await prisma.fichaCadastralPreenchimento.upsert({
            where: {
                fichaCadastralId_campoFichaCadastralCodigo: {
                    fichaCadastralId: id,
                    campoFichaCadastralCodigo: campoCodigo,
                },
            },
            update: {
                aprovado: false,
                motivoReprovacao,
            },
            create: {
                aprovado: false,
                motivoReprovacao,
                campo: {
                    connect: {
                        codigo: campoCodigo,
                    },
                },
                ficha: {
                    connect: {
                        id: id,
                    },
                },
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
