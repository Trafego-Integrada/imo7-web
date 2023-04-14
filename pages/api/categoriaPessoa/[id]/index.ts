import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.categoriaPessoa.findFirst({
        where: {
            id,
        },
       
    });
  
    res.send(data);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const {
        tipo, nome
    } = req.body;

    

    const data = await prisma.categoriaPessoa.update({
        where: {
            id,
        },
        data: {
            tipo, nome
        },
    });
    res.send(data);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.categoriaPessoa.findFirst({
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
    await prisma.categoriaPessoa.delete({
        where: { id },
    });
    res.send();
});

export default handle;
