import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(cors);
handler.use(checkAuth);
handler.get(async (req, res) => {
    try {
        const { periodo } = req.query;

        let abreviacaoPeriodo = "D";
        let valorSubstr = 1;
        let periodoSubstr = "M";
        if (periodo) {
            switch (periodo) {
                case "mensal":
                    abreviacaoPeriodo = "D";
                    valorSubstr = 1;
                    periodoSubstr = "M";
                    break;
                case "semanal":
                    abreviacaoPeriodo = "D";
                    valorSubstr = 1;
                    periodoSubstr = "W";
                    break;
                case "trimestral":
                    abreviacaoPeriodo = "D";
                    valorSubstr = 3;
                    periodoSubstr = "M";
                    break;
                case "semestral":
                    abreviacaoPeriodo = "D";
                    valorSubstr = 6;
                    periodoSubstr = "M";
                    break;
                case "anual":
                    abreviacaoPeriodo = "D";
                    valorSubstr = 1;
                    periodoSubstr = "Y";
                    break;
            }
        }

        const boletos = await prisma.boleto.findMany({
            where: {
                // data_vencimen: {
                //     gte: moment()
                //         .subtract(valorSubstr, periodoSubstr)
                //         .startOf(abreviacaoPeriodo)
                //         .format(),
                //     lte: moment().endOf(abreviacaoPeriodo).format(),
                // },
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const extratos = await prisma.extrato.findMany({
            where: {
                // dataDeposito: {
                //     gte: moment()
                //         .subtract(valorSubstr, periodoSubstr)
                //         .startOf(abreviacaoPeriodo)
                //         .format(),
                //     lte: moment().endOf(abreviacaoPeriodo).format(),
                // },
                imobiliariaId: req.user.imobiliariaId,
            },
            include: {
                itens: true,
            },
        });

        const emailBoletoEnviados = await prisma.filaEnvio.count({
            where: {
                reguaCobranca: {
                    formaEnvio: "email",
                    tipo: "boleto",
                },
                // dataEnvio: {
                //     gte: moment()
                //         .subtract(valorSubstr, periodoSubstr)
                //         .startOf(abreviacaoPeriodo)
                //         .format(),
                //     lte: moment().endOf(abreviacaoPeriodo).format(),
                // },
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const whatsappBoletoEnviados = await prisma.filaEnvio.count({
            where: {
                reguaCobranca: {
                    formaEnvio: "whatsapp",
                    tipo: "boleto",
                },
                // dataEnvio: {
                //     gte: moment()
                //         .subtract(valorSubstr, periodoSubstr)
                //         .startOf(abreviacaoPeriodo)
                //         .format(),
                //     lte: moment().endOf(abreviacaoPeriodo).format(),
                // },
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const emailExtratoEnviados = await prisma.filaEnvio.count({
            where: {
                reguaCobranca: {
                    formaEnvio: "email",
                    tipo: "extrato",
                },
                // dataEnvio: {
                //     gte: moment()
                //         .subtract(valorSubstr, periodoSubstr)
                //         .startOf(abreviacaoPeriodo)
                //         .format(),
                //     lte: moment().endOf(abreviacaoPeriodo).format(),
                // },
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const whatsappExtratoEnviados = await prisma.filaEnvio.count({
            where: {
                reguaCobranca: {
                    formaEnvio: "whatsapp",
                    tipo: "extrato",
                },
                // dataEnvio: {
                //     gte: moment()
                //         .subtract(valorSubstr, periodoSubstr)
                //         .startOf(abreviacaoPeriodo)
                //         .format(),
                //     lte: moment().endOf(abreviacaoPeriodo).format(),
                // },
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const fichasCadastrais = await prisma.fichaCadastral.findMany({
            where: {
                // createdAt: {
                //     gte: moment()
                //         .subtract(valorSubstr, periodoSubstr)
                //         .startOf(abreviacaoPeriodo)
                //         .format(),
                //     lte: moment().endOf(abreviacaoPeriodo).format(),
                // },
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const tarefas = await prisma.tarefa.findMany({
            where: {
                // dataVencimento: {
                //     gte: moment()
                //         .subtract(valorSubstr, periodoSubstr)
                //         .startOf(abreviacaoPeriodo)
                //         .format(),
                //     lte: moment().endOf(abreviacaoPeriodo).format(),
                // },
                status: {
                    notIn: ["finalizada"],
                },
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const contratosReajuste = await prisma.contrato.count({
            where: {
                dataReajuste: {
                    gte: moment().startOf("D").format(),
                    lte: moment().add(30, "d").endOf("M").format(),
                },
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const contratosInicio = await prisma.contrato.count({
            where: {
                dataInicio: {
                    gte: moment().subtract(30, "d").startOf("D").format(),
                    lte: moment().endOf("D").format(),
                },
                imobiliariaId: req.user.imobiliariaId,
            },
        });

        const contratosFim = await prisma.contrato.count({
            where: {
                dataFim: {
                    gte: moment().startOf("D").format(),
                    lte: moment().add(30, "d").endOf("D").format(),
                },
                imobiliariaId: req.user.imobiliariaId,
            },
        });
        return res.send({
            boletos,
            extratos,
            whatsappBoletoEnviados,
            emailBoletoEnviados,
            whatsappExtratoEnviados,
            emailExtratoEnviados,
            fichasCadastrais,
            tarefas,
            contratosReajuste,
            contratosInicio,
            contratosFim,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handler;
