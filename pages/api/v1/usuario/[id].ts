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

handle.post(async (req, res) => {
    try {
        const { id } = req.query;
        const {
            nome,
            email,
            documento,
            imobiliariaId,
            senha,
            profissao,
            endereco,
            cidade,
            bairro,
            cep,
            estado,
            celular,
            telefone,
            whatsapp,
            naoEnviarWhatsapp,
        } = req.body;

        const data = await prisma.usuario.update({
            where: {
                id: Number(id),
            },
            data: {
                nome,
                email,
                documento,
                imobiliariaId: Number(imobiliariaId),
                profissao,
                endereco,
                cidade,
                bairro,
                cep,
                estado,
                celular,
                telefone,
                whatsapp,
                naoEnviarWhatsapp: naoEnviarWhatsapp == "1" ? true : false,
            },
        });

        res.send(data);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
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
