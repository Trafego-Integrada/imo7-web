import { NextApiResponse } from "next-auth/internals/utils";
import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

const handle = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handle.get(async (req, res) => {
    const data = await prisma.usuario.findMany({});
    res.send(data);
});

handle.post(async (req, res) => {
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
    const data = await prisma.usuario.create({
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
            telefone,
            senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
        },
    });

    res.send(data);
});

export default handle;
