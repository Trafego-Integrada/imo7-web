import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);

// Listar todos tipo de envio Notificação
handle.get(async (req, res) => {
    try {
        const data = await prisma.tipoEnvioNotificacao.findMany({
            where: {},
        });

        res.status(200).send({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
