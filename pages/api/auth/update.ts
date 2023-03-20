import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import { getUser } from "@/services/database/user";
import * as bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(cors);

handler.post(async (req, res) => {
   try {
    const { imobiliaria } = req.headers;
    const { documento, password, confirmPassword, email,contrato, celular } = req.body;
 
    const user = await getUser({ documento: documento, imobiliaria });
    if (!user) {
        return res.status(401).json({
            error: true,
            message: "Usuário não cadastrado",
        });
    }
    if (!user.status) {
        return res.status(401).json({
            error: true,
            message: "Usuário inátivo, contate o administrador.",
        });
    }

    if (!contrato) {
        return res.status(401).json({
            error: true,
            message: "Informe o número do contrato",
        });
    }

    const contratoExiste = await prisma.contrato.findFirst({
        where:{
            imobiliaria:{
                url:imobiliaria
            },
            codigo:contrato,
            OR:[{
                inquilinos:{
                    some:{
                        documento
                    }
                }
            },{
                proprietarios:{
                    some:{
                        documento
                    }
                }
            },{
                fiadores:{
                    some:{
                        documento
                    }
                }
            }]
        }
    })
    if(!contratoExiste) {
        return res.status(401).json({
            error: true,
            message: "Não encontramos nenhum contrato com este código",
        });
    }
    
    await prisma.usuario.update({
        where:{
            imobiliariaId_documento:{
                documento, 
                imobiliariaId:user.imobiliariaId
            }
        },
        data:{
            email, 
            celular,
            senhaHash:bcrypt.hashSync(password, 10)
        }
    })

    return res.json({
        id: user.id,
        nome: user.nome,
        atualizar:false
    });
   } catch (error) {
    return res.status(500).json({
        error: true,
        message: error.message
    });
   }
});

export default handler;
