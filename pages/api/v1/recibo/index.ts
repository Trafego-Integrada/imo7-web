import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect<NextApiRequest, NextApiResponse>();

handle.get(async (req, res) => {
    const boletos = await prisma.extrato.findMany({
        where: {
            contaId: 1,
        },
    });
    res.send(boletos);
});

handle.post(async (req, res) => {
    try {
        const {
            parcela,
            vencimento,
            recebimento,
            pagamento,
            responsavel,
            total,
            contratoId,
            imobiliariaId,
            inquilinoId,
            contaId,
            itens,
        } = req.body;

        const data = await prisma.recibo.create({
            data: {
                vencimento: vencimento
                    ? moment(vencimento, "DD/MM/YYYY").format()
                    : null,
                recebimento: recebimento
                    ? moment(recebimento, "DD/MM/YYYY").format()
                    : null,
                pagamento: pagamento
                    ? moment(pagamento, "DD/MM/YYYY").format()
                    : null,
                total: Number(total),
                parcela: Number(parcela),
                responsavel,
                conta: {
                    connect: {
                        id: Number(1),
                    },
                },
                contrato: {
                    connect: {
                        id: Number(contratoId),
                    },
                },
                inquilino: {
                    connect: {
                        id: Number(inquilinoId),
                    },
                },
                imobiliaria: {
                    connect: {
                        id: Number(imobiliariaId),
                    },
                },
                itens: {
                    createMany: {
                        data: eval(itens).map((item) => {
                            return {
                                descricao: item.descricao,
                                valor: Number(item.valor),
                            };
                        }),
                    },
                },
            },
            include: {
                itens: true,
                conta: true,
                contrato: true,
                imobiliaria: true,
                inquilino: true,
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default handle;
