import { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "@/middleware/checkAuth";
import { getUser } from "@/services/database/user";
import { NextApiRequestWithUser } from "@/types/auth";
import nextConnect from "next-connect";
import { cors } from "@/middleware/cors";
import axios from "axios";
import prisma from "@/lib/prisma";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(cors);

handler.get(async (req, res) => {
    try {
        const data = await prisma.validacaoFacial.findMany({
            take: 1,
            where: { imobiliariaId: req.body.imobiliariaId, cpf: req.body.cpf },
            orderBy: {
                updatedAt: "asc",
            },
        });

        if (data.length == 0) res.send({ status: 0, msg: "Sem registros" });

        return res.status(200).send({ status: 1, data: data[0] });
    } catch (error) {
        return res.status(200).send({ status: -1, error: error });
    }
});

export default handler;
