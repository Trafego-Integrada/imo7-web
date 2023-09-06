import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id } = req.query;
    const conta = await prisma.historico.findUnique({
        where: {
            id,
        },
        include: {
            usuario: true,
        },
    });
    res.send(conta);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const { descricao } = req.body;
    const conta = await prisma.historico.update({
        where: {
            id,
        },
        data: {
            descricao,
        },
    });
    res.send(conta);
});
handle.delete(async (req, res) => {
    const { id } = req.query;
    const conta = await prisma.historico.delete({
        where: {
            id,
        },
    });
    res.send(conta);
});

export default handle;
