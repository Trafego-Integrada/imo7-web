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
    const { codigo, imobiliariaId } = req.body;
    const conta = await prisma.contrato.create({
        data: {
            codigo,
            imobiliariaId,
            contaId: 1,
        },
    });
    res.send(conta);
});

export default handle;
