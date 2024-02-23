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
        const { imobiliaria } = req.headers;

        let filtroQuery = {};
        let {
            filtro,
            nome,
            documento,
            telefone,
            pagina,
            linhas,
            inquilino,
            proprietario,
            admImobiliaria,
            admConta,
            adm,
            contaId,
            imobiliariaId,
            status,
        } = req.query;
        //console.log("dados", req.query);
        imobiliariaId = req.user.imobiliariaId
            ? req.user.imobiliariaId
            : Number(imobiliariaId);

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

        if (imobiliariaId) {
            filtroQuery = {
                ...filtroQuery,
                imobiliaria: {
                    id: Number(imobiliariaId),
                },
            };
        }

        const content = await prisma.regraNotificacao.findMany({
            where: {
                ...filtroQuery,
            },
            include: {
                notificacao: {
                    include: {
                        usuario: {
                            select: {
                                nome: true,
                            },
                        },
                        contrato: {
                            select: {
                                codigo: true,
                            },
                        },
                        canalMidia: {
                            select: {
                                descricao: true,
                            },
                        },
                    },
                },
            },
            ...paginacao,
        });
        const total = 0;
        // const total = await prisma.notificacao.count({
        //     where: {
        //         ...filtroQuery,
        //     },
        // });
        res.send({
            success: true,
            content,
            total,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;

