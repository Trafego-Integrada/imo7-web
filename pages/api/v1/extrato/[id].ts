import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.extrato.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "E01",
            message: "Boleto não encontrado",
        });
    }
    res.send(data);
});

handle.post(async (req, res) => {
    try {
        const { id } = req.query;
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
        const data = await prisma.extrato.update({
            where: {
                id: Number(id),
            },
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
                                valor: Number(item.valor.replaceAll('.','').replace('.','')),
                            };
                        }),
                    },
                },
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.extrato.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "E01",
            message: "Extrato não encontrado",
        });
    }
    await prisma.extrato.delete({
        where: { id: Number(id) },
    });
    res.send();
});

export default handle;
