import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.assuntoChamado.findUnique({
        where: {
            id: Number(id),
        },
    });
    res.send(data);
});
handle.post(async (req, res) => {
    const { id } = req.query;
    const{titulo, ativo} = req.body;
    const data = await prisma.assuntoChamado.update({
        where: {
            id: Number(id),
        },
        data:{
           titulo, ativo
           
        }
    });
    res.send(data);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.assuntoChamado.delete({
        where: {
            id: Number(id),
        },
    });
    res.send(data);
});

export default handle;
