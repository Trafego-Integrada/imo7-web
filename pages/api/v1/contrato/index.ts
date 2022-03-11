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
            taxaAdm,
            dataInicio,
            dataFim,
            valorAluguel,
            valorBonus,
            diaVencimento,
            diaRecebimento,
            diaDeposito,
            observacoes,
            imobiliariaId: Number(imobiliariaId),
            contaId: 1,
            imovelId: Number(imovelId),
        },
    });
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
