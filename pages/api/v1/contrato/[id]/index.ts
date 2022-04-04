import moment from "moment";
import nextConnect from "next-connect";
import prisma from "../../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const { id } = req.query;
    const conta = await prisma.contrato.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            boletos: true,
            extratos: true,
            inquilinos: true,
            proprietarios: true,
            imovel: true,
            fiadores: true,
        },
    });
    res.send(conta);
});

handle.post(async (req, res) => {
    const { id } = req.query;
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
    const conta = await prisma.contrato.update({
        where: {
            id: Number(id),
        },
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
            imovelId: Number(imovelId),
        },
    });
    res.send(conta);
});

export default handle;
