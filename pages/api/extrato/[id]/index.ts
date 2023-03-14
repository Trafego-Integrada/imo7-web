import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import nextConnect from "next-connect";

const handle = nextConnect();
handle.use(cors);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.extrato.findUnique({
        where: {
            id: Number(id),
        },
    });
    res.send(data);
});

export default handle;
