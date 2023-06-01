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
        let { filtro, pagina, linhas, query, tipoCadastro, categoria } =
            req.query;
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

        const data = await prisma.regraNotificacao.findMany({
            where: {
                ...filtroQuery,

                imobiliariaId: req.user.imobiliariaId,
            },
            include: {
                tipoEnvio: true,
                canalMidia: true,
            },
            ...paginacao,
            // include:{
            //     prestador:true,
            //     solicitante:true,
            //     chamado:true
            // }
        });
        const total = await prisma.regraNotificacao.count({
            where: {
                ...filtroQuery,

                imobiliariaId: req.user.imobiliariaId,
            },
        });
        res.send({
            success: true,
            data,
            total,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message,
        });
    }
});

//CREATE
handle.post(async (req, res) => {
    try {
        console.log("foi");
        const { tipo, dias, assunto, mensagem, hora, canalMidia } = req.body;
        const imobiliaria = req.user.imobiliariaId;
        const data = await prisma.regraNotificacao.create({
            data: {
                imobiliariaId: imobiliaria,
                tipoEnvioId: Number(tipo),
                diasReferencia: Number(dias),
                assunto: assunto,
                mensagem: mensagem,
                horaEnvio: hora || null,
                canalMidiaId: Number(canalMidia),
            },
        });

        res.send({
            data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: err.message,
        });
    }
});

//Selecionar ou buscar
// handle.get('
export default handle;
