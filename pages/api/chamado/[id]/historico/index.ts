import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id, usuarioId } = req.query;
    const data = await prisma.historicoChamado.findMany({
        where: {
            chamadoId: Number(id),
            
        },
        include: {
            usuario:true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
    res.send(data);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const { descricao } = req.body;
    const data = await prisma.historicoChamado.create({
        data: {
            descricao,usuario:{
                connect:{
                    id: Number(req.user.id)
                }
            },chamado:{
                connect:{
                    id:Number(id)
                }
            }
        },
    });
    res.send(data);
});

export default handle;
