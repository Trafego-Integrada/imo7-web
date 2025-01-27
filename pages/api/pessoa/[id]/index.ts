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
    const data = await prisma.pessoa.findFirst({
        where: {
            id,
        },include:{
            categoria:true
        },
       
    });
  
    res.send(data);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const {
        tipoCadastro,
                tipoPessoa,
                razaoSocial,
                categoria, 
                cep,
                bairro, 
                cidade, 
                estado,
                email, 
                celular,
                telefone,
                documento,
                endereco,complemento,observacoes,tags,numero
    } = req.body;

    

    const data = await prisma.pessoa.update({
        where: {
            id,
        },
        data: {
            tipoCadastro,
                tipoPessoa,
                razaoSocial,
                categoria:{
                    connect:{
                        id:categoria.id
                    }
                }, 
                cep,
                bairro, 
                cidade, 
                estado,
                email, 
                celular,
                telefone,
                documento,
                endereco,complemento,observacoes,tags,numero,
                
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
