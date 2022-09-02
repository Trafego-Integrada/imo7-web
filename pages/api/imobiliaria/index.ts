import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { query, contaId } = req.query;
    const imobiliarias = await prisma.imobiliaria.findMany({
        where: {
            OR: [
                {
                    contaId: req.user.conta[0].id,
                },
                {
                    nomeFantasia: {
                        contains: query,
                    },
                },
                {
                    razaoSocial: {
                        contains: query,
                    },
                },
            ],
        },
        include: {
            conta: true,
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
        contaId,
        usuario,
    } = req.body;
    const data = await prisma.imobiliaria.create({
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
            contaId: req.user.conta[0].id,
        },
    });

    const usuarioExiste = await prisma.usuario.findUnique({
        where: {
            documento: usuario.documento,
        },
    });
    if (usuarioExiste) {
        await prisma.usuario.update({
            where: {
                documento: usuario.documento,
            },
            data: {
                nome: usuario.nome,
                documento: usuario.documento,
                email: usuario.email,
                imobiliaria: {
                    connect: {
                        id: data.id,
                    },
                },
                cargos: {
                    connect: {
                        id: 2,
                    },
                },
            },
        });
    } else {
        await prisma.usuario.create({
            data: {
                nome: usuario.nome,
                documento: usuario.documento,
                email: usuario.email,
                imobiliaria: {
                    connect: {
                        id: data.id,
                    },
                },
                cargos: {
                    connect: {
                        id: 2,
                    },
                },
            },
        });
    }

    res.send(data);
});

export default handle;
