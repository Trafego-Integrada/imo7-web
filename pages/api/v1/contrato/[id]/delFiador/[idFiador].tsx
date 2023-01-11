import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();

handle.post(async (req, res) => {
    const { idFiador, id } = req.query;
    const conta = await prisma.usuario.update({
        where: {
            id: Number(idFiador),
        },
        data: {
            contratosFiador: {
                disconnect: {
                    id: Number(id),
                },
            },
        },
        include: {
            contratosFiador: true,
        },
    });
    res.send(conta);
});

export default handle;
