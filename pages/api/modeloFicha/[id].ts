import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { providerStorage } from "@/lib/storage";
import * as os from "oci-objectstorage";

const handler = nextConnect();
import { cors } from "@/middleware/cors";
handler.use(cors);
handler.get(async (req, res) => {
    try {
        const { id } = req.query;

        const data = await prisma.modeloFichaCadastral.findUnique({
            where: {
                id,
            },
        });
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message,
            error,
        });
    }
});
handler.post(async (req, res) => {
    try {
        const { tipo, nome, descricao, campos } = req.body;

        const data = await prisma.modeloFichaCadastral.update({
            where: {
                id: req.query.id,
            },
            data: {
                tipo,
                nome,
                descricao,
                campos,
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
