import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const imoveis = await prisma.imovel.findMany();
    res.send(imoveis);
});

handle.post(async (req, res) => {
    const {
        codigo,
        bairro,
        caracteristicas,
        cep,
        cidade,
        complemento,
        endereco,
        descricao,
        estado,
        numero,
        pontoReferencia,
        tipo,
        valorAluguel,
        valorCondominio,
        valorVenda,
        quartos,
        suites,
        varandas,
        banheiros,
        cozinhas,
        salas,
        piscinas,
        garagens,
        lavabos,
        terreno,
        areaUtil,
        areaTotal,
        aceitaPet,
        destaque,
        placa,
        mobiliado,
        exclusividade,
        autorizado,
        imobiliariaId,
        proprietarios,
    } = req.body;

    if (!imobiliariaId) {
        res.status(400).json({
            success: false,
            errorCode: "IM02",
            message: "Informe o ID da Imobiliária",
        });
    }

    const existe = await prisma.imobiliaria.findFirst({
        where: {
            id: Number(imobiliariaId),
        },
    });
    if (!existe) {
        res.status(400).json({
            success: false,
            errorCode: "IM03",
            message: "Não há imobiliária cadastrada com este ID",
        });
    }
    const imovel = await prisma.imovel.create({
        data: {
            codigo,
            bairro,
            caracteristicas,
            cep,
            cidade,
            complemento,
            endereco,
            descricao,
            estado,
            numero,
            pontoReferencia,
            tipo,
            valorAluguel,
            valorCondominio,
            valorVenda,
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
                            imoveis: {
                                create: {
                                    imovelId: imovel.id,
                                    porcentagem: 100,
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
                    imoveis: {
                        create: {
                            imovelId: imovel.id,
                            porcentagem: 100,
                        },
                    },
                },
            });
        }
    }

    res.send(imovel);
});

export default handle;
