import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
const handler = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
import { checkAuth } from "@/middleware/checkAuth";
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
                        validacaoFacial: true,
                    },
                },
                responsavel: true,
                imovel: true,
                imobiliaria: true,

                Processo: true,
            },
        });
        let newObj = {};
        let newArq = {};
        let analise = {};
        data.preenchimento.map((item) => {
            newObj[item.campoFichaCadastralCodigo] = item.valor;
            analise[item.campoFichaCadastralCodigo] = {
                aprovado: item.aprovado,
                motivoReprovacao: item.motivoReprovacao,
            };
        });
        data.preenchimento = newObj;
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
        const { id } = req.query;
        let { preenchimento } = req.body;

        let dataPreenchimento = {};

        if (preenchimento && !Array.isArray(preenchimento)) {
            //console.log(preenchimento);
            dataPreenchimento = {
                preenchimento: {
                    upsert: Object.entries(preenchimento).map((item) => {
                        return {
                            where: {
                                fichaCadastralId_campoFichaCadastralCodigo: {
                                    fichaCadastralId: id,
                                    campoFichaCadastralCodigo: item[0],
                                },
                            },
                            create: {
                                campoFichaCadastralCodigo: item[0],
                                valor: item[1],
                            },
                            update: {
                                valor: item[1],
                                motivoReprovacao: null,
                            },
                        };
                    }),
                },
            };
        }

        const data = await prisma.fichaCadastral.update({
            where: {
                id: id,
            },
            data: {
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
