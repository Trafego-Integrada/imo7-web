import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

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
        ultimaParcPaga,
        ultimoRecebimento,
        ultimoBomPara,
        ultimoRepasse,
        proprietarios,
        inquilinos,
        fiadores,
        dataReajuste,
        indiceReajuste,
        formaPagamento,
        formaRepasse,
        juros,
        multa,
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
            ultimaParcPaga: ultimaParcPaga ? Number(ultimaParcPaga) : null,
            ultimoRecebimento: ultimoRecebimento
                ? moment(ultimoRecebimento, "DD/MM/YYYY").format()
                : null,
            ultimoBomPara: ultimoBomPara
                ? moment(ultimoBomPara, "DD/MM/YYYY").format()
                : null,
            ultimoRepasse: ultimoRepasse
                ? moment(ultimoRepasse, "DD/MM/YYYY").format()
                : null,
            valorAluguel: valorAluguel ? Number(valorAluguel) : null,
            valorBonus: valorBonus ? Number(valorAluguel) : null,
            diaVencimento: diaVencimento ? Number(diaVencimento) : null,
            diaRecebimento: diaRecebimento ? Number(diaRecebimento) : null,
            diaDeposito: diaDeposito ? Number(diaDeposito) : null,
            dataReajuste: dataReajuste
                ? moment(dataReajuste, "DD/MM/YYYY").format()
                : null,
            indiceReajuste,
            formaPagamento,
            formaRepasse,
            juros,
            multa,
            observacoes,
            imobiliaria: {
                connect: {
                    id: Number(imobiliariaId),
                },
            },
            conta: {
                connect: {
                    id: 1,
                },
            },
            imovel: {
                connect: {
                    id: Number(imovelId),
                },
            },
        },
    });
    if (proprietarios) {
        if (Array.isArray(proprietarios) && proprietarios.length > 0) {
            await Promise.all(
                proprietarios.map(async (item) => {
                    await prisma.usuario.update({
                        where: {
                            id: Number(item),
                        },
                        data: {
                            contratosProprietario: {
                                connect: {
                                    id: conta.id,
                                },
                            },
                        },
                    });
                })
            );
        } else {
            await prisma.usuario.update({
                where: {
                    id: Number(proprietarios),
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
    }

    if (inquilinos) {
        if (Array.isArray(inquilinos) && inquilinos.length > 0) {
            await Promise.all(
                inquilinos.map(async (item) => {
                    await prisma.usuario.update({
                        where: {
                            id: Number(item),
                        },
                        data: {
                            contratosInquilino: {
                                connect: {
                                    id: conta.id,
                                },
                            },
                        },
                    });
                })
            );
        } else {
            await prisma.usuario.update({
                where: {
                    id: Number(inquilinos),
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
    }

    if (fiadores) {
        if (Array.isArray(fiadores) && fiadores.length > 0) {
            await Promise.all(
                fiadores.map(async (item) => {
                    await prisma.usuario.update({
                        where: {
                            id: Number(item),
                        },
                        data: {
                            contratosFiador: {
                                connect: {
                                    id: conta.id,
                                },
                            },
                        },
                    });
                })
            );
        } else {
            await prisma.usuario.update({
                where: {
                    id: Number(fiadores),
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
    }

    const data = await prisma.contrato.findUnique({
        where: {
            id: conta.id,
        },
        include: {
            inquilinos: true,
            proprietarios: true,
            fiadores: true,
        },
    });
    res.send(data);
});

export default handle;
