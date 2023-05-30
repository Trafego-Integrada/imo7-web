import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        let {
            filtro,
            pagina, 
            linhas,query, tipoCadastro, categoria
            
        } = req.query;
        let filtroQuery = {};

        let paginacao = {};
        if (pagina && linhas) {
            paginacao = {
                take: Number(linhas),
                skip:
                    pagina && pagina > 1
                        ? Number(pagina) * Number(linhas) - Number(linhas)
                        : 0,
            };
        }

        const data = await prisma.regua.findMany(   {
            where: {
                ...filtroQuery,
                
                imobiliariaId:req.user.imobiliariaId
            },
            ...paginacao,
            // include:{
            //     prestador:true,
            //     solicitante:true,
            //     chamado:true
            // }
        });
        const total = await prisma.orcamento.count({
            where: {
                ...filtroQuery,
                
                imobiliariaId:req.user.imobiliariaId
            },
        });
        res.send({
            success: true,
            data: {
                total,
                data,
            },
        });
        
    } catch(err) {
        res.status(500).send({
            success: false,
            message: err.message,
        });
    }


export default handle;