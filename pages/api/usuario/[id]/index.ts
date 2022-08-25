import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";

const handle = nextConnect();

handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.contrato.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            AnexoInteracao: true,
            boletos: true,
            chamados: true,
            conta: true,
            extratos: true,
            fiadores: true,
            imobiliaria: true,
            imovel: true,
            inquilinos: true,
            proprietarios: true,
        },
    });
    res.send({
        success: true,
        data,
    });
});

export default handle;
