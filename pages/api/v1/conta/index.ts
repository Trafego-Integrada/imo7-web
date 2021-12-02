import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const contas = await prisma.conta.findMany({
        where: {},
    });
    res.send(contas);
});

handle.post(async (req, res) => {
    const { codigo, nome } = req.body;
    const conta = await prisma.conta.create({
        data: {
            codigo,
            nome,
        },
    });
    res.send(conta);
});

export default handle;
