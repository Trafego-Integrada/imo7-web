import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const contas = await prisma.contrato.findMany({
        where: {
            contaId: 1,
        },
    });
    res.send(contas);
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
        ultimaParcPaga,
        ultimoRecebimento,
        ultimoBomPara,
        ultimoRepasse,
        proprietarios,
        inquilinos,
        fiadores,
        dataReajuste,
    } = req.body;

    const existe = await prisma.contrato.findFirst({
        where: {
            codigo,
            imobiliariaId: Number(imobiliariaId),
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
