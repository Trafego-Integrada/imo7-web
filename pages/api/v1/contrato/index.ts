import moment from "moment";
import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const conta = await prisma.contrato.findMany({
        where: {
            contaId: 1,
        },
    });
    res.send(conta);
});

handle.post(async (req, res) => {
    const {
        codigo,
        imobiliariaId,
        taxaAdm,
        dataInicio,
        dataFim,
        valorAluguel,
        valorBonus,
        diaVencimento,
        diaRecebimento,
        diaDeposito,
        observacoes,
        imovelId,
        proprietarioId,
        inquilinoId,
        fiadorId,
    } = req.body;

    const existe = await prisma.contrato.findUnique({
        where: {
            codigo: codigo,
        },
    });

    if (existe) {
        res.status(500).send({
            success: false,
            message: "Já existe um contrato com este código",
        });
    }

    const conta = await prisma.contrato.create({
        data: {
            codigo,
            taxaAdm: taxaAdm ? Number(taxaAdm) : null,
            dataInicio: moment(dataInicio, "DD/MM/YYYY").format(),
            dataFim: dataFim ? moment(dataFim, "DD/MM/YYYY").format() : null,
            valorAluguel: valorAluguel ? Number(valorAluguel) : null,
            valorBonus: valorBonus ? Number(valorAluguel) : null,
            diaVencimento: diaVencimento ? Number(diaVencimento) : null,
            diaRecebimento: diaRecebimento ? Number(diaRecebimento) : null,
            diaDeposito: diaDeposito ? Number(diaDeposito) : null,
            observacoes,
            imobiliariaId: Number(imobiliariaId),
            contaId: 1,
            imovelId: Number(imovelId),
        },
    });
    if (proprietarioId) {
        await prisma.usuario.update({
            where: {
                id: Number(proprietarioId),
            },
            data: {
                contratosProprietario: {
                    connect: {
                        id: conta.id,
                    },
                },
            },
        });
    }
    if (inquilinoId) {
        await prisma.usuario.update({
            where: {
                id: Number(inquilinoId),
            },
            data: {
                contratosInquilino: {
                    connect: {
                        id: conta.id,
                    },
                },
            },
        });
    }

    if (fiadorId) {
        await prisma.usuario.update({
            where: {
                id: Number(fiadorId),
            },
            data: {
                contratosFiador: {
                    connect: {
                        id: conta.id,
                    },
                },
            },
        });
    }
    const data = await prisma.contrato.findUnique({
        where: {
            id: conta.id,
        },
        include: {
            inquilinos: true,
            proprietarios: true,
        },
    });
    res.send(data);
});

export default handle;
