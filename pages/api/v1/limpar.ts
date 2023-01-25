import { NextApiResponse } from "next-auth/internals/utils";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextApiRequest } from "next";

const handle = nextConnect<NextApiRequest, NextApiResponse>();

handle.get(async (req, res) => {
    await prisma.contrato.deleteMany({});
    await prisma.itemExtrato.deleteMany({});
    await prisma.extrato.deleteMany({});
    await prisma.boleto.deleteMany({});
    await prisma.usuario.deleteMany({
        where: {
            id: {
                notIn: [1, 2, 3],
            },
        },
    });
    res.send();
});

export default handle;
