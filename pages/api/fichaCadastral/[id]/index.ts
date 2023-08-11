import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
const handler = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
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
            responsavel,
            imovel,
            codigoImovel,
            cepImovel,
            enderecoImovel,
            numeroImovel,
            complementoImovel,
            bairroImovel,
            cidadeImovel,
            estadoImovel,
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
                                motivoReprovacao: null,
                            },
                        };
                    }),
                },
            };
        }
        if (responsavel) {
            dataPreenchimento = {
                ...dataPreenchimento,
                responsavel: {
                    connect: {
                        id: Number(responsavel.id),
                    },
                },
            };
        }
        if (imovel) {
            dataPreenchimento = {
                ...dataPreenchimento,
                imovel: {
                    connect: {
                        id: Number(imovel.id),
                    },
                },
            };
        } else {
            dataPreenchimento = {
                ...dataPreenchimento,
                imovel: {
                    disconnect: true,
                },
            };
        }
        const dadosAntigos = await prisma.fichaCadastral.findUnique({
            where: {
                id: req.query.id,
            },
        });

        if (dadosAntigos.status != "aprovada" && status == "aprovada") {
            dataPreenchimento = {
                ...dataPreenchimento,
                dataAprovacao: moment().format(),
            };
        }
        if (dadosAntigos.status != "reprovada" && status == "reprovada") {
            dataPreenchimento = {
                ...dataPreenchimento,
                dataReprovacao: moment().format(),
            };
        }
        if (status != "aprovada" && status != "reprovada") {
            dataPreenchimento = {
                ...dataPreenchimento,
                dataReprovacao: null,
                dataAprovacao: null,
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
                codigoImovel,
                cepImovel,
                enderecoImovel,
                numeroImovel,
                complementoImovel,
                bairroImovel,
                cidadeImovel,
                estadoImovel,
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

handler.delete(async (req, res) => {
    try {
        const data = await prisma.fichaCadastral.delete({
            where: {
                id: req.query.id,
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
