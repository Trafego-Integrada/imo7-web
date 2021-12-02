import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

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
        imobiliariaId,
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
            imobiliria: {
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

    res.send(imovel);
});

export default handle;
