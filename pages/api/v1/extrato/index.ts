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
            dataDeposito,
            observacao1,
            observacao2,
            observacao3,
            observacao4,
            observacao5,
            parcela,
            vencimento,
            periodo,
            responsavel,
            contratoId,
            proprietarioId,
            imobiliariaId,
            itens,
        } = req.body;
        const data = await prisma.extrato.create({
            data: {
                dataDeposito: dataDeposito
                    ? moment(dataDeposito, "DD/MM/YYYY").format()
                    : null,
                observacao1,
                observacao2,
                observacao3,
                observacao4,
                observacao5,
                parcela: Number(parcela),
                periodo,
                vencimento: dataDeposito
                    ? moment(vencimento, "DD/MM/YYYY").format()
                    : null,
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
                proprietario: {
                    connect: {
                        id: Number(proprietarioId),
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
                                valor: Number(item.valor.replaceAll('.','').replace(',','.')),
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
                proprietario: true,
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default handle;
