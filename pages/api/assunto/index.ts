import { Prisma } from "@prisma/client";
import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    try {
        const {
            query,
            pagina,
            linhas,
            departamentoId
        } = req.query;

        let filtroQuery: Prisma.AssuntoChamadoWhereInput = {};
        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                   
                    {
                        titulo: {
                            contains: query,
                        },
                    },
                    
                ],
            };
        }

        if(departamentoId){
            filtroQuery={
                ...filtroQuery,
                departamentoId:Number(departamentoId)
            }
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

        const data = await prisma.assuntoChamado.findMany({
            where: {
                ...filtroQuery,
            },
            ...paginacao,
            include: {
                departamento: true,
            },
        });
        const total = await prisma.assuntoChamado.count({
            where: {
                ...filtroQuery,
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
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
handle.post(async (req, res) => {
    try {
        const {
            titulo, ativo, departamentoId
        } = req.body; 

        const data = await prisma.assuntoChamado.create({
            data: {
                titulo, 
                ativo,
                departamento:{
                    connect:{
                        id:Number(departamentoId)
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
