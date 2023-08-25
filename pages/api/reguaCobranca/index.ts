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
        let { pagina, linhas } = req.query;

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

        const data = await prisma.reguaCobranca.findMany({
            where: {
                imobiliariaId: req.user.imobiliariaId,
            },
            ...paginacao,
        });
        const total = await prisma.reguaCobranca.count({
            where: {
                imobiliariaId: req.user.imobiliariaId,
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
        const { tipo, tipoEnvio, formaEnvio, assunto, conteudo, dias } =
            req.body;

        const count = await prisma.reguaCobranca.count({
            where: {
                formaEnvio,
                imobiliariaId: req.user.imobiliariaId,
                deletedAt: null,
            },
        });
        if (count >= 3) {
            return res.status(400).json({
                success: false,
                errorCode: "U01",
                message: "Você já possui 3 reguas cadastradas",
            });
        }
        const data = await prisma.reguaCobranca.create({
            data: {
                tipo,
                tipoEnvio,
                formaEnvio,
                assunto,
                conteudo,
                dias: dias ? Number(dias) : null,
                imobiliaria: {
                    connect: {
                        id: req.user.imobiliariaId,
                    },
                },
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
