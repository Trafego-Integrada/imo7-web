import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "../../../../../../lib/prisma";

const handle = nextConnect();
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id, conversaId } = req.query;
    const data = await prisma.interacaoChamado.findMany({
        where: {
            chamadoId: Number(id),
            conversaChamadoId: Number(conversaId),
        },
        include: {
            usuario: {
                include: {
                    contratosFiador: true,
                    contratosInquilino: true,
                    contratosProprietario: true,
                },
            },
            anexos: true,
        },
        orderBy: {
            id: "asc",
        },
    });
    res.send(data);
});

handle.post(async (req, res) => {
    const { id, conversaId } = req.query;
    const { mensagem } = req.body;
    const data = await prisma.interacaoChamado.create({
        data: {
            chamado: {
                connect: {
                    id: Number(id),
                },
            },
            conversa: {
                connect: {
                    id: Number(conversaId),
                },
            },
            mensagem,
            usuario: {
                connect: {
                    id: req.user.id,
                },
            },
        },
    });
    res.send(data);
});

export default handle;
