import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    try {
        const { id } = req.query;
        //console.log(id);
        const data = await prisma.motivoReprovacaoFichaCadastral.findUnique({
            where: {
                id,
            },
        });
        //console.log(data);
        return res.send(data);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            error,
        });
    }
});
handle.post(async (req, res) => {
    try {
        const { id } = req.query;
        const { nome, ativo } = req.body;
        const data = await prisma.motivoReprovacaoFichaCadastral.update({
            where: {
                id,
            },
            data: {
                nome,
                ativo,
            },
        });
        return res.send(data);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            error,
        });
    }
});

handle.delete(async (req, res) => {
    try {
        const { id } = req.query;
        const data = await prisma.motivoReprovacaoFichaCadastral.delete({
            where: {
                id,
            },
        });
        res.send(data);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            error,
        });
    }
});

export default handle;
