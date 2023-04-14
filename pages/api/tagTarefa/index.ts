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
            linhas
            
        } = req.query;
        let filtroQuery = {};
      
        if (filtro) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        nome: {
                            contains: filtro,
                        },
                    },
                ],
            };
        }
      
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
       
        const data = await prisma.tagTarefa.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId:req.user.imobiliariaId
            },
            ...paginacao,
        });
        const total = await prisma.tagTarefa.count({
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
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

handle.post(async (req, res) => {
    try {
        const {
            nome
        } = req.body;

        const data = await prisma.tagTarefa.create({
            data: {
               nome,
               imobiliaria:{
               connect:{
                id:req.user.imobiliariaId
               }
               }
            },
        });

        res.send(data);
           
      
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
