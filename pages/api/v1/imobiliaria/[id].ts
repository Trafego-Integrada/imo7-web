import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const { id } = req.query;
    const imobiliarias = await prisma.imobiliaria.findUnique({
        where: {
            id: Number(id),
        },
    });
    res.send(imobiliarias);
});

handle.put(async (req, res) => {
    const { id } = req.query;
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
    const imobiliaria = await prisma.imobiliaria.update({
        where: {
            id: Number(id),
        },
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
        },
    });

    res.send(imobiliaria);
});

export default handle;
