import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.boleto.findUnique({
        where: {
            id: Number(id),
        },
    });
    res.send(data);
});

export default handle;
