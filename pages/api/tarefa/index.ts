import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
const handle = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    try {
        let {
            filtro,
            pagina, 
            linhas,chamadoId
            
        } = req.query;
        let filtroQuery = {};
      
        if (filtro) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        razaoSocial: {
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
        if(chamadoId) {
            filtroQuery = {
                ...filtroQuery,
                chamadoId:Number(chamadoId)
            }
        }
        const data = await prisma.tarefa.findMany({
            where: {
                ...filtroQuery,
            },
            ...paginacao,
            include:{
                departamento:true,
                membros:true,
                responsaveis:true
            }
        });
        const total = await prisma.tarefa.count({
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
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

handle.post(async (req, res) => {
    try {
        const {
           dataEntrega, dataVencimento, departamento, descricao, prioridade, titulo, status,
           membros,responsaveis, tipoServico, chamadoId
        } = req.body;

        const data = await prisma.tarefa.create({
            data: {
                dataEntrega:dataEntrega?moment(dataEntrega).format():null,
                dataVencimento:dataVencimento?moment(dataVencimento).format():null,
                departamento:departamento ?{
                    connect:{
                        id:departamento.id
                    }
                }:{},
                descricao,
                prioridade,
                titulo, 
                status,
                membros:membros.length> 0 ? {
                    connect:membros.map(item => {
                        return {
                            id:item.id
                        }
                    })
                } :{},
                responsaveis:responsaveis.length> 0 ?{
                    connect:responsaveis.map(item => {
                        return {
                            id:item.id
                        }
                    })
                }:{},tipoServico, chamado:chamadoId? {
                    connect:{
                        id:Number(chamadoId)
                    }
                } : {}
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
