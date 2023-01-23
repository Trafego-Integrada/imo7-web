import { NextApiResponse } from "next-auth/internals/utils";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextApiRequest } from "next";

const handle = nextConnect<NextApiRequest, NextApiResponse>();

handle.get(async (req, res) => {
    const data = await prisma.usuario.findMany({});
    res.send(data);
});

handle.post(async (req, res) => {
    try {
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
        } = req.body;

        const usuarioExiste = await prisma.usuario.findFirst({
            where: {
                OR: [
                    {
                        email,
                    },
                    { documento },
                ],
                imobiliariaId: Number(imobiliariaId),
            },
        });

        if (usuarioExiste) {
            res.send(usuarioExiste);
        } else {
            const data = await prisma.usuario.create({
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
                    senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
                },
            });

            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
