import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { providerStorage } from "@/lib/storage";
import * as os from "oci-objectstorage";

const handler = nextConnect();
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";
import { multiparty } from "@/middleware/multipart";
handler.use(cors);

handler.get(async (req, res) => {
    try {
        const { id } = req.query;
        const data = await prisma.fichaCadastral.findUnique({
            where: {
                id,
            },
            include: {
                modelo: true,
                preenchimento: {
                    include: {
                        campo: true,
                    },
                },
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            error,
            message: error.message,
        });
    }
});
handler.post(async (req, res) => {
    try {
        let {
            modelo,
            descricao,
            nome,
            documento,
            email,
            telefone,
            preenchimento,
            status,
            motivoReprovacao,
        } = req.body;

        let dataPreenchimento = {};

        if (preenchimento && !Array.isArray(preenchimento)) {
            console.log(preenchimento);
            dataPreenchimento = {
                preenchimento: {
                    upsert: Object.entries(preenchimento).map((item) => {
                        return {
                            where: {
                                fichaCadastralId_campoFichaCadastralCodigo: {
                                    fichaCadastralId: req.query.id,
                                    campoFichaCadastralCodigo: item[0],
                                },
                            },
                            create: {
                                campoFichaCadastralCodigo: item[0],
                                valor: item[1],
                            },
                            update: {
                                valor: item[1],
                            },
                        };
                    }),
                },
            };
        }

        const data = await prisma.fichaCadastral.update({
            where: {
                id: req.query.id,
            },
            data: {
                modelo: {
                    connect: {
                        id: modelo.id,
                    },
                },
                descricao,
                nome,
                documento,
                email,
                telefone,
                status,
                motivoReprovacao,
                ...dataPreenchimento,
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
export default handler;
