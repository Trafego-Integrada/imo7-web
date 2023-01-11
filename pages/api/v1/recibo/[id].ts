import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.recibo.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "R01",
            message: "Recibo não encontrado",
        });
    }
    res.send(data);
});

handle.post(async (req, res) => {
    try {
        const { id } = req.query;
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
        const data = await prisma.extrato.update({
            where: {
                id: Number(id),
            },
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
        });
        res.send(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.recibo.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "R01",
            message: "Recibo não encontrado",
        });
    }
    await prisma.extrato.delete({
        where: { id: Number(id) },
    });
    res.send();
});

export default handle;
