import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.orcamento.findFirst({
        where: {
            id,
        },
        include:{
            prestador:true,
            solicitante:true,
            chamado:true
        }
       
    });
  
    res.send(data);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const {
        dataVisita, observacoes, prestador, responsavel, valor,status
    } = req.body;

    

    const data = await prisma.orcamento.update({
        where: {
            id,
        },
        data: {
            dataVisita:dataVisita ? moment(dataVisita).format():null,
                observacoes,
                prestador:{
                    connect:{
                        id:prestador.id
                    }
                },
                responsavel,
                valor,
                status,
                solicitante:{
                    connect:{
                        id: req.user.id
                    }
                }
        },
    });
    res.send(data);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.pessoa.findFirst({
        where: {
            id,
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "U01",
            message: "Usuário não encontrado",
        });
    }
    await prisma.pessoa.delete({
        where: { id },
    });
    res.send();
});

export default handle;
