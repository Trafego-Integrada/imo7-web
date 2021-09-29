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
            imobiliariaId,
            contaId: 1,
        },
    });

    res.send(imovel);
});

export default handle;
