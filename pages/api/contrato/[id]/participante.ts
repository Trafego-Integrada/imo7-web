import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.usuario.findMany({
        where: {
            OR: [
                {
                    contratosFiador: {
                        some: {
                            id: Number(id),
                        },
                    },
                },
                {
                    contratosInquilino: {
                        some: {
                            id: Number(id),
                        },
                    },
                },
                {
                    contratosProprietario: {
                        some: {
                            id: Number(id),
                        },
                    },
                },
            ],
        },
        include: {
            contratosFiador: true,
            contratosInquilino: true,
            contratosProprietario: true,
        },
    });
    res.send(data);
});

export default handle;
