import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handler = nextConnect();
import { cors } from "@/middleware/cors";
import { ca } from "date-fns/locale";
handler.use(cors);

handler.post(async (req, res) => {
    try {
        const { id } = req.query;

        const data = await prisma.fichaCadastral.update({
            where: {
                id,
            },
            data: {
                importadaJb: true,
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
