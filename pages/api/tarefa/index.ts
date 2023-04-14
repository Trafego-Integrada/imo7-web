import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
const handle = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
import { Prisma } from "@prisma/client";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    try {
        let {
            query,
            pagina, 
            linhas,
            chamadoId,
            dataCriacao,
            dataVencimento,
            dataEntrega,status,codigoContrato,codigoImovel, responsaveis
            
        } = req.query;
        let filtroQuery: Prisma.TarefaWhereInput = {AND:[]};
      
        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        titulo: {
                            contains: query,
                        },
                    },
                    {
                        descricao: {
                            contains: query,
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
        if(status) {
            filtroQuery = {
                ...filtroQuery,
                status
            }
        }
        if(codigoImovel) {
            filtroQuery = {
                ...filtroQuery,
                codigoImovel:{
                    contains:codigoImovel
                }
            }
        }
        if(codigoContrato) {
            filtroQuery = {
                ...filtroQuery,
                codigoContrato:{
                    contains:codigoContrato
                }
            }
        }
        if (responsaveis) {
            responsaveis = JSON.parse(responsaveis);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        responsaveis: {
                            some:{
                                id:{
                                    in:responsaveis.map(r => {
                                        return r.id
                                    })
                                }
                            }
                        }
                    },
                ],
            };
        }
        if (dataCriacao) {
            dataCriacao = JSON.parse(dataCriacao);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        createdAt: {
                            gte: dataCriacao[0]
                                ? moment(dataCriacao[0]).startOf("d").format()
                                : null,
                            lte: dataCriacao[1]
                                ? moment(dataCriacao[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }
        if (dataVencimento) {
            dataVencimento = JSON.parse(dataVencimento);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        dataVencimento: {
                            gte: dataVencimento[0]
                                ? moment(dataVencimento[0]).startOf("d").format()
                                : null,
                            lte: dataVencimento[1]
                                ? moment(dataVencimento[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }
        if (dataEntrega) {
            dataEntrega = JSON.parse(dataEntrega);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        dataEntrega: {
                            gte: dataEntrega[0]
                                ? moment(dataEntrega[0]).startOf("d").format()
                                : null,
                            lte: dataEntrega[1]
                                ? moment(dataEntrega[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }
        const data = await prisma.tarefa.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId:req.user.imobiliariaId
            },
            ...paginacao,
            include:{
                departamento:true,
                membros:true,
                responsaveis:true,tags:true
            }
        });
        const total = await prisma.tarefa.count({
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
           dataEntrega, dataVencimento, departamento, descricao, prioridade, titulo, status,
           membros,responsaveis, tipoServico, chamadoId, tags
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
                membros:membros && membros.length> 0 ? {
                    connect:membros.map(item => {
                        return {
                            id:item.id
                        }
                    })
                } :{},
                responsaveis:responsaveis && responsaveis.length> 0 ?{
                    connect:responsaveis.map(item => {
                        return {
                            id:item.id
                        }
                    })
                }:{},tipoServico, chamado:chamadoId? {
                    connect:{
                        id:Number(chamadoId)
                    }
                } : {},
                tags:{
                    connectOrCreate: tags.length > 0 ?tags.map(tag => {
                        return {
                            where:{
                                id:tag.id? tag.id : '0'
                            },
                            create:{
                                nome: tag.value,
                                imobiliariaId:req.user.imobiliariaId
                            }

                        }
                    }):{},
                    
                },
                imobiliaria:{
                    connect:{
                        id:req.user.imobiliariaId
                    }
                }
            },
        });
        if(chamadoId) {
            await prisma.historicoChamado.create({
                data:{
                    descricao:'Criou uma tarefa # '+data.id,
                    chamado: {
                        connect: {
                            id: Number(chamadoId),
                        },
                    },
                    usuario: {
                        connect: {
                            id: req.user.id,
                        },
                    },
                }
            })
        }
        res.send(data);
           
      
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
