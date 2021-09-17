import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import Auth from "../../../../middleware/Auth";

interface NextApiRequestWithUser extends NextApiRequest {
    user: any;
}

function handle(req: NextApiRequestWithUser, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            index(req, res);
            break;
        case "POST":
            store(req, res);
            break;
        default:
            res.status(500).send("Método inválido");
            break;
    }
}

async function index(req: NextApiRequestWithUser, res: NextApiResponse) {
    const chamados = await prisma.chamado.findMany({
        orderBy: {
            id: "desc",
        },
        include: {
            AnexoInteracao: true,
            Contrato: true,
            InteracaoChamado: true,
            assunto: true,
            criador: true,
            participantes: true,
        },
    });

    res.status(200).json(chamados);
}

async function store(req: NextApiRequestWithUser, res: NextApiResponse) {
    try {
        const { titulo, contratoId, mensagem, assuntoId } = req.body;
        if (!titulo || !contratoId || !mensagem || !assuntoId) {
            return res
                .status(403)
                .json({ message: "Preencha todos os campos obrigatórios" });
        }
        const chamado = await prisma.chamado.create({
            data: {
                titulo,
                assunto: {
                    connect: {
                        id: assuntoId,
                    },
                },
                Contrato: {
                    connect: {
                        id: contratoId,
                    },
                },
                InteracaoChamado: {
                    create: {
                        mensagem: mensagem,
                    },
                },
                criador: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
            include: {
                InteracaoChamado: true,
            },
        });

        res.status(201).json(chamado);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

export default Auth(handle);
