import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.usuario.findFirst({
        where: {
            id: Number(id),
        },
        include: {
            cargos: true,
            boletos: true,
            conta: true,
            contratosFiador: true,
            contratosInquilino: true,
            contratosProprietario: true,
            imobiliaria: true,
            imoveis: true,
            permissoes: true,
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "U01",
            message: "Usuário não encontrado",
        });
    }
    res.send(data);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const { nome, email, documento, celular, senha } = req.body;
    const data = await prisma.usuario.update({
        where: {
            id: Number(id),
        },
        data: {
            nome,
            email,
            documento,
            celular,
        },
    });
    res.send(data);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.usuario.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "U01",
            message: "Usuário não encontrado",
        });
    }
    await prisma.usuario.delete({
        where: { id: Number(id) },
    });
    res.send();
});

export default handle;
