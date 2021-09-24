import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const imobiliarias = await prisma.imobiliaria.findMany();
    res.send(imobiliarias);
});

handle.post(async (req, res) => {
    const { codigo } = req.body;
    const imobiliaria = await prisma.imobiliaria.create({
        data: {
            codigo,
        },
    });

    res.send(imobiliaria);
});

export default handle;
