import { emailBoleto, emailExtrato } from "@/lib/layoutEmail";
import prisma from "@/lib/prisma";
import { mail } from "@/services/mail";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    try {
        const filaEnvio = await prisma.filaEnvio.findMany({
            where: {
                previsaoEnvio: {
                    gte: moment().startOf("D").format(),
                    lte: moment().endOf("D").format(),
                },
                dataEnvio: null,
            },
            include: {
                reguaCobranca: true,
                imobiliaria: true,
            },
            take: 500,
        });

        await Promise.all(
            filaEnvio.map(async (item) => {
                const email = await mail.sendMail({
                    from: "IMO7 <contato@imo7.com.br>",
                    to: `${item.nomeDestinatario} <${item.destinatario}>`,
                    subject: item.reguaCobranca?.assunto
                        ? item.reguaCobranca?.assunto
                        : item.reguaCobranca.tipo == "boleto"
                        ? "2ª via de boleto online"
                        : "Resumo do extrato",
                    html:
                        item.reguaCobranca.tipo === "boleto"
                            ? emailBoleto({
                                  conteudo: item.reguaCobranca.conteudo,
                                  imobiliaria: item?.imobiliaria,
                                  nomeDestinatario: item.nomeDestinatario,
                                  ...item.parametros,
                              })
                            : item.reguaCobranca.tipo == "extrato"
                            ? emailExtrato({
                                  imobiliaria: item?.imobiliaria,
                                  nomeDestinatario: item?.nomeDestinatario,
                                  ...item.parametros,
                              })
                            : "",
                });
                await prisma.filaEnvio.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        dataEnvio: new Date(),
                    },
                });
            })
        );

        return res.send({ success: true });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message,
        });
    }
});

export default handler;
