import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    const contas = await prisma.conta.findMany({
        where: {},
    });
    res.send(contas);
});

handle.post(async (req, res) => {
    const { codigo, nome, usuario } = req.body;
    const conta = await prisma.conta.create({
        data: {
            codigo: Number(codigo),
            nome,
        },
    });
    const usuarioExiste = await prisma.usuario.findUnique({
        where: {
            documento: usuario.documento,
        },
    });
    if (usuarioExiste) {
        await prisma.usuario.update({
            where: {
                documento: usuario.documento,
            },
            data: {
                nome: usuario.nome,
                documento: usuario.documento,
                email: usuario.email,
                cargos: {
                    connect: {
                        codigo: "adm",
                    },
                },
            },
        });
    } else {
        await prisma.usuario.create({
            data: {
                nome: usuario.nome,
                documento: usuario.documento,
                email: usuario.email,
                cargos: {
                    connect: {
                        codigo: "adm",
                    },
                },
            },
        });
    }
    res.send(conta);
});

export default handle;
