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
      
        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        razaoSocial: {
                            contains: query,
                        },
                    },
                ],
            };
        }
        if (tipoCadastro) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    {
                        tipoCadastro
                    },
                ],
            };
        }
        if (categoria) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    {
                        categoria: {
                            id: JSON.parse(categoria).id
                            
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
       
        const data = await prisma.pessoa.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId:req.user.imobiliariaId
            },
            include:{
                categoria:true
            },
            ...paginacao,
        });
        const total = await prisma.pessoa.count({
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

        const data = await prisma.pessoa.create({
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
                endereco,complemento,observacoes,tags,numero,imobiliaria:{
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
