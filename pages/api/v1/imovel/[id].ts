import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const { id } = req.query;
    const boleto = await prisma.imovel.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!boleto) {
        res.status(400).json({
            success: false,
            errorCode: "I01",
            message: "Imovel não encontrado",
        });
    }
    res.send(boleto);
});

handle.put(async (req, res) => {
    const { id } = req.query;
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
    } = req.body;
    const boleto = await prisma.imovel.update({
        where: {
            id: Number(id),
        },
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
        },
    });
    res.send(boleto);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const boleto = await prisma.imovel.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!boleto) {
        res.status(400).json({
            success: false,
            errorCode: "I01",
            message: "Imovel não encontrado",
        });
    }
    await prisma.imovel.delete({
        where: { id: Number(id) },
    });
    res.send();
});

export default handle;
