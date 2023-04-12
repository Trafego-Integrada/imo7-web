import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { checkAuth } from "@/middleware/checkAuth";
const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    try {
        const { page, rows, query, cargoCodigo } = req.query;

        let paginate = {};
        let queries: Prisma.ModuloWhereInput = {};
        let order = {};
        if (page && rows) {
            paginate = {
                take: Number(rows),
                skip: page == 1 ? 0 : Number(rows) * Number(page),
            };
        }
        if (query) {
            queries = {
                OR: [
                    {
                        nome: {
                            contains: query,
                        },
                    },
                ],
            };
        }
        if (cargoCodigo) {
            queries = {
                ...queries,
                cargo: {
                    codigo: cargoCodigo,
                },
            };
        }
        const data = await prisma.modulo.findMany({
            where: {
                ...queries,
            },
            include: {
                cargo: true,
                modulos: {
                    include:{
                        modulos:true,
                        permissoes:true
                    }
                },
                pai: true,
                permissoes: true,
                usuarios: true,
            },
            ...order,
            ...paginate,
        });
        const total = await prisma.modulo.count({
            where: {
                ...queries,
            },
        });

        res.send({
            data,
            total,
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
        const { nome, email, senha, confirmarSenha } = req.body;

        const data = await prisma.usuario.create({
            data: {
                nome,
                email,
                senhaHash: bcrypt.hashSync(senha, 10),
            },
        });

        res.send({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
