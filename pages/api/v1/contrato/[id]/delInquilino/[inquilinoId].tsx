import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();

handle.post(async (req, res) => {
    const { inquilinoId, id } = req.query;
    const conta = await prisma.usuario.update({
        where: {
            id: Number(inquilinoId),
        },
        data: {
            contratosInquilino: {
                disconnect: {
                    id: Number(id),
                },
            },
        },
        include: {
            contratosInquilino: true,
        },
    });
    res.send(conta);
});

export default handle;
