import { emailBoleto, emailExtrato } from "@/lib/layoutEmail";
import prisma from "@/lib/prisma";
import { apiWhatsapp } from "@/services/apiWhatsapp";
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
                if (item.reguaCobranca?.formaEnvio === "email") {
                    const email = await mail.sendMail({
                        from: `${item.imobiliaria?.nomeFantasia} <contato@imo7.com.br>`,
                        to: `${item.nomeDestinatario} <${item.destinatario}>`,
                        replyTo:
                            item.reguaCobranca?.tipo == "boleto"
                                ? `${item.imobiliaria?.nomeFantasia} <${item.imobiliaria?.emailEnvioBoleto}>`
                                : `${item.imobiliaria?.nomeFantasia} <${item.imobiliaria?.emailEnvioExtrato}>`,
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
                } else if (
                    item.reguaCobranca?.formaEnvio === "whatsapp" &&
                    item.imobiliaria?.idInstanciaWhatsapp &&
                    item.imobiliaria?.tokenInstanciaWhatsapp
                ) {
                    await apiWhatsapp.post(
                        `instances/${item.imobiliaria?.idInstanciaWhatsapp}/token/${item.imobiliaria?.tokenInstanciaWhatsapp}/send-messages`,
                        {
                            delayMessage: "15",
                            phone: `55${item.destinatario}`,
                            message: `Olá *${item.nomeDestinatario}*, \n\nPara a sua comodidade segue abaixo o link da 2ª via do boleto de seu aluguel que vencera em *${item.parametros?.vencimento}* no valor de *${item.parametros?.valor}*. \n\nLinha digitavel:\n *${item.parametros?.barcode}*`,
                            title: item.reguaCobranca?.assunto,
                            footer: item.reguaCobranca?.conteudo,
                            buttonActions: [
                                {
                                    id: "1",
                                    type: "URL",
                                    url: `https://www.imo7.com.br/boleto/${item.parametros?.idBoleto}?pdf=true`,
                                    label: "Baixar PDF",
                                },
                                {
                                    id: "2",
                                    type: "URL",
                                    url: `https://www.imo7.com.br/boleto/${item.parametros?.idBoleto}`,
                                    label: "Acessar Site",
                                },
                            ],
                        }
                    );
                }
            })
        );

        // Whatsapp envio a cada 30 segundos por imobiliária

        return res.send({ success: true });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message,
        });
    }
});

export default handler;
