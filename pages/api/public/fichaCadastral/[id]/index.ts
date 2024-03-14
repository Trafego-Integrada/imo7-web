import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import moment from "moment";
import nextConnect from "next-connect";
const handler = nextConnect();
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
        let { preenchimento, status } = req.body;

        let dataPreenchimento = {};

        if (preenchimento && !Array.isArray(preenchimento)) {
            //console.log(JSON.stringify(status));
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

        const dadosAntigos = await prisma.fichaCadastral.findUnique({
            where: {
                id: id,
            },
        });
        console.log(JSON.stringify(dadosAntigos?.status));

        // Valida se usuário iniciou preenchimento
        if (!dadosAntigos?.dataInicioPreenchimento) {
            //console.log(`!dadosAntigos?.dataInicioPreenchimento`)
            dataPreenchimento = {
                ...dataPreenchimento,
                dataInicioPreenchimento: moment().format(),
            };
            await prisma.historico.create({
                data: {
                    descricao: "iniciou preenchimento",
                    tabela: "FichaCadastral",
                    tabelaId: id,
                },
            });
        }

        // Valida se usuário
        if (dadosAntigos?.status != "preenchida" && status == "preenchida") {
            //console.log(`dadosAntigos?.status != "preenchida" && status == "preenchida"`)
            dataPreenchimento = {
                ...dataPreenchimento,
                dataFimPreenchimento: moment().format(),
            };
            await prisma.historico.create({
                data: {
                    descricao: "finalizou preenchimento",
                    tabela: "FichaCadastral",
                    tabelaId: id,
                },
            });
        }

        const ficha = await prisma.fichaCadastral.update({
            where: {
                id: id,
            },
            data: {
                ...dataPreenchimento,
            },
            include: {
                modelo: true,
                preenchimento: true,
            },
        });

        // Atualizar Porcentagem de Preenchimento
        const campos = await prisma.campoFichaCadastral.findMany({
            include: {
                dependencia: true,
            },
        });
        const camposObrigatorios = Object.entries(ficha.modelo.campos).filter(
            (i) => {
                if (
                    i[1].obrigatorio &&
                    campos.find((c) => c.codigo == i[0])?.dependenciaId != null
                ) {
                    const campoAtual = campos.find((c) => c.codigo == i[0]);
                    const codigoCampoDependente = campos.find(
                        (c) => c.codigo == i[0]
                    )?.dependencia?.codigo;
                    const preenchimentoDoCampoDependente =
                        ficha.preenchimento.find(
                            (i) =>
                                i.campoFichaCadastralCodigo ==
                                codigoCampoDependente
                        );
                    if (
                        campoAtual?.dependenciaValor?.includes(
                            preenchimentoDoCampoDependente?.valor
                        )
                    ) {
                        return true;
                    }

                    //return true;
                } else if (i[1].obrigatorio) {
                    return true;
                }
                return false;
            }
        );
        console.log(
            "Campos Obrigatórios c/ base no preenchimento atual:",
            camposObrigatorios.length
        );

        console.log(
            "Campos Obrigatórios Preenchidos:",
            camposObrigatorios.filter((c) => {
                const preenchimento = ficha.preenchimento.find(
                    (i) => i.campoFichaCadastralCodigo == c[0]
                );
                if (
                    preenchimento?.valor != null &&
                    preenchimento?.valor != ""
                ) {
                    return true;
                }
            }).length
        );
        const porcentagemPreenchimento =
            (camposObrigatorios.filter((c) => {
                const preenchimento = ficha.preenchimento.find(
                    (i) => i.campoFichaCadastralCodigo == c[0]
                );
                if (
                    preenchimento?.valor != null &&
                    preenchimento?.valor != ""
                ) {
                    return true;
                }
            }).length /
                18) *
            100;
        await prisma.fichaCadastral.update({
            where: {
                id: id,
            },
            data: {
                porcentagemPreenchimento,
            },
        });

        res.send(ficha);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handler;
