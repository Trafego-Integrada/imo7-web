import { Prisma } from "@prisma/client";
import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";
handle.use(cors);
handle.use(checkAuth)
handle.get(async (req, res) => {
    try {
        const {
            filtro,
            pagina,
            linhas,
        } = req.query;

        let filtroQuery: Prisma.DepartamentoChamadoWhereInput = {};
        if (filtro) {
            filtroQuery = {
                ...filtroQuery,
                OR: [           
                    {
                        titulo: {
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

        const data = await prisma.departamentoChamado.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId:req.user.imobiliariaId
            },
            ...paginacao,
            include: {
                assuntos: true,
                integrantes:true
            },
        });
        const total = await prisma.departamentoChamado.count({
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
        //console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

handle.post(async (req, res) => {
    try {
        const {
            titulo, ativo, integrantes
        } = req.body; 

        const data = await prisma.departamentoChamado.create({
            data: {
                titulo, 
                ativo,
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
