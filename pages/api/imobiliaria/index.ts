import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
const handle = nextConnect();
import { cors } from "@/middleware/cors";

handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    const { query, contaId } = req.query;
    const imobiliarias = await prisma.imobiliaria.findMany({
        where: {
            OR: [
                {
                    contaId: req.user.contaId,
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
            contaId: Number(contaId),
        },
    });

    const usuarioExiste = await prisma.usuario.findFirst({
        where: {
            OR: [
                {
                    email: usuario?.email,
                },
                {
                    documento: usuario?.documento,
                },
            ],
            imobiliariaId: data.id,
            cargos: {
                some: {
                    codigo: "imobiliaria",
                },
            },
        },
    });
    if (usuarioExiste) {
        await prisma.usuario.update({
            where: {
                imobiliariaId_documento: {
                    documento: usuario.documento,
                    imobiliariaId: data.id,
                },
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
                        codigo: "imobiliaria",
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
                        codigo: "imobiliaria",
                    },
                },
            },
        });
    }

    res.send(data);
});
handle.delete(async (req, res) => {
    try {
        const { ids } = req.query;
        let arrayIds = JSON.parse(ids);
        console.log(arrayIds, ids);
        if (!arrayIds.length) {
            return res
                .status(400)
                .send({ success: false, message: "Nenhum id informado" });
        }

        await prisma.imobiliaria.deleteMany({
            where: {
                id: {
                    in: arrayIds.map((i) => Number(i)),
                },
            },
        });
        return res.send({ success: true });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error?.message,
        });
    }
});
export default handle;
