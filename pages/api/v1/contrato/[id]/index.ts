import nextConnect from "next-connect";
import prisma from "../../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const { id } = req.query;
    const conta = await prisma.contrato.findUnique({
        where: {
            id: Number(id),
        },
    });
    res.send(conta);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const { codigo, imobiliariaId } = req.body;
    const conta = await prisma.contrato.update({
        where: {
            id: id,
        },
        data: {
            codigo,
            imobiliariaId,
            contaId: 1,
        },
    });
    res.send(conta);
});

export default handle;
