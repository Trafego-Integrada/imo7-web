import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const imobiliarias = await prisma.imobiliaria.findMany({
        where: {
            contaId: 1,
        },
    });
    res.send(imobiliarias);
});

handle.post(async (req, res) => {
    const {
        codigo,
        cnpj,
        razaoSocial,
        bairro,
        cep,
        cidade,
        email,
        endereco,
        estado,
        ie,
        nomeFantasia,
        url,
        telefone,
        site,
        numero,
    } = req.body;
    const imobiliaria = await prisma.imobiliaria.create({
        data: {
            codigo,
            cnpj,
            razaoSocial,
            bairro,
            cep,
            cidade,
            email,
            endereco,
            estado,
            ie,
            nomeFantasia,
            url,
            telefone,
            site,
            numero,
            contaId: 1,
        },
    });

    res.send(imobiliaria);
});

export default handle;
