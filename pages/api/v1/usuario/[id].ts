import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handle = nextConnect();

handle.get(async (req, res) => {
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
    res.send(data);
});

handle.put(async (req, res) => {
    const { id } = req.query;
    const { nome, email, documento, imobiliariaId, senha } = req.body;
    const data = await prisma.usuario.update({
        where: {
            id: Number(id),
        },
        data: {
            nome,
            email,
            documento,
            imobiliariaId,
            profissao,
            endereco,
            cidade,
            bairro,
            cep,
            estado,
            celular,
            fone,
            senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
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
