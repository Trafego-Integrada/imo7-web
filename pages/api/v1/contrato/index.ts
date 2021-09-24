import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const contratos = await prisma.contrato.findMany();
    res.send(contratos);
});

handle.post(async (req, res) => {
    const { codigo } = req.body;
    const contrato = await prisma.contrato.create({
        data: {
            codigo,
        },
    });

    res.send(contrato);
});

export default handle;
