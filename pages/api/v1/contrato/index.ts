import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const conta = await prisma.contrato.findMany({
        where: {
            contaId: 1,
        },
    });
    res.send(conta);
});

handle.post(async (req, res) => {
    const { codigo, imobiliariaId, imovelId, proprietarioId, inquilinoId } =
        req.body;

    const existe = await prisma.contrato.findUnique({
        where: {
            codigo: codigo,
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
            imobiliariaId: Number(imobiliariaId),
            contaId: 1,
            imovelId: Number(imovelId),
            inquilinos: {
                connect: {
                    id: Number(inquilinoId),
                },
            },
            proprietarios: {
                connect: {
                    id: Number(proprietarioId),
                },
            },
        },
    });
    res.send(conta);
});

export default handle;
