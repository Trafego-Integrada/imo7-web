import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";
handle.use(cors);
handle.use(checkAuth)
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.departamentoChamado.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            assuntos:true,
            integrantes:true
        },
    });
    res.send(data);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const{titulo, ativo, integrantes} = req.body;
    const data = await prisma.departamentoChamado.update({
        where: {
            id: Number(id),
        },
        data:{
           titulo, ativo,
           integrantes:{
            set:integrantes.map(i => {
                return {
                    id:Number(i.id)
                }
            })
           }
        }
    });
    res.send(data);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.departamentoChamado.delete({
        where: {
            id: Number(id),
        },
    });
    res.send(data);
});
export default handle;
