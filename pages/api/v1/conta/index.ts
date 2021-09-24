import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

const handle = nextConnect();

handle.post(async (req, res) => {
    const { nome } = req.body;
    const conta = await prisma.conta.create({
        data: {
            nome,
        },
    });
    res.send(conta);
});

export default handle;
