import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.contrato.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            anexos: true,
            boletos: true,
            chamados: {
                include: {
                    assunto: {
                        include: {
                            departamento: true,
                        },
                    },
                    criador: true,
                    participantes: true,
                    interacoes: true,
                    contrato: {
                        include: {
                            imovel: true,
                        },
                    },
                },
            },
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
