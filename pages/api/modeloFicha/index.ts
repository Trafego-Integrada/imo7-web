import nextConnect from "next-connect";

import st from "stream";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        const { contratoId } = req.query;
        let filtroQuery = {};
        if (contratoId) {
            filtroQuery = {
                ...filtroQuery,
                contratoId: Number(contratoId),
            };
        }

        const data = await prisma.modeloFichaCadastral.findMany({
            where: {
                ...filtroQuery,
                imobiliaria: {
                    id: req.user.imobiliariaId,
                },
                status: true,
            },
            orderBy: {
                id: "desc",
            },
        });

        const count = await prisma.modeloFichaCadastral.count({
            where: {
                ...filtroQuery,
                status: true,
            },
        });

        res.send({ data, total: count });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
handle.post(async (req, res) => {
    try {
        const { tipo, nome, descricao, campos, instrucoes, checkbox } =
            req.body;

        const data = await prisma.modeloFichaCadastral.create({
            data: {
                tipo,
                nome,
                descricao,
                campos,
                instrucoes,
                checkbox: checkbox ? checkbox : [],
                imobiliaria: {
                    connect: {
                        id: req.user.imobiliariaId,
                    },
                },
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
function compareStreams(stream1: st.Readable, stream2: st.Readable): boolean {
    return streamToString(stream1) === streamToString(stream2);
}

function streamToString(stream: st.Readable) {
    let output = "";
    stream.on("data", function (data) {
        output += data.toString();
    });
    stream.on("end", function () {
        return output;
    });
}

export default handle;
