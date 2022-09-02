import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const { id } = req.query;
    const conta = await prisma.conta.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            usuarios: true,
            imobiliarias: true,
        },
    });
    res.send(conta);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const { codigo, nome } = req.body;
    const conta = await prisma.conta.update({
        where: {
            id: id,
        },
        data: {
            codigo: Number(codigo),
            nome,
        },
    });
    res.send(conta);
});

export default handle;
