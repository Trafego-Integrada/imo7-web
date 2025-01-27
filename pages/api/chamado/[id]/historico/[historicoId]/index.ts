import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id, conversaId } = req.query;
    const data = await prisma.historicoChamado.findUnique({
        where: {
            id: Number(id),
        },
       
    });
    res.send(data);
});

handle.post(async (req, res) => {
    const { historicoId } = req.query;
    const { descricao, } = req.body;
    const data = await prisma.historicoChamado.update({
        where:{
            id:Number(historicoId)
        },
        data: {
            descricao,usuario:{
                connect:{
                    id: Number(req.user.id)
                }
            },
        },
    });
    res.send(data);
});


export default handle;
