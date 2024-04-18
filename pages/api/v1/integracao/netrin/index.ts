import { removerCaracteresEspeciais } from "@/helpers/helpers";
import prisma from "@/lib/prisma";
import { format, parse } from "date-fns";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { apiNetrinService } from "@/services/apiNetrin";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import puppeteer from "puppeteer";
import slug from "slug";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";

const handle = nextConnect<NextApiRequest, NextApiResponse>();

handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    const { processoId, fichaCadastralId } = req.query;

    let filtro: Prisma.ConsultaNetrinWhereInput = {};

    if (processoId) {
        filtro = {
            ...filtro,
            processoId,
        };
    }

    if (fichaCadastralId) {
        filtro = {
            ...filtro,
            fichaCadastralId,
        };
    }

    const data = await prisma.consultaNetrin.findMany({
        where: {
            imobiliariaId: req.user.imobiliariaId,
            ...filtro,
        },
    });

    res.send(data);
});

handle.post(async (req, res) => {
    try {
        const { tipoConsulta, requisicao, processoId, fichaCadastralId } =
            req.body;

        let requisicaoBody = {
            ...requisicao,
        };

        let requisicaoBody2 = {
            ...requisicao,
        };

        if (tipoConsulta == "processos_pf") {
            if (!requisicao.cpf) {
                return res
                    .status(400)
                    .send({ message: "Informe um CPF válido" });
            } else {
                requisicaoBody = {
                    s: "processos-cpf",
                    cpf: removerCaracteresEspeciais(requisicao?.cpf),
                };
            }
        } else if (tipoConsulta == "processos_pj") {
            if (!requisicao.cnpj) {
                return res
                    .status(400)
                    .send({ message: "Informe um CNPJ válido" });
            } else {
                requisicaoBody = {
                    s: "processos-cnpj",
                    cnpj: removerCaracteresEspeciais(requisicao.cnpj),
                };
            }
        } else if (tipoConsulta == "protestos_pf") {
            if (!requisicao.cpf) {
                return res
                    .status(400)
                    .send({ message: "Informe um CPF válido" });
            } else {
                requisicaoBody = {
                    s: "protestos-cenprot-sp",
                    cpf: removerCaracteresEspeciais(requisicao.cpf),
                    "govbr-senha": "trafego10",
                    "govbr-cpf": "30156844850",
                };
                requisicaoBody2 = {
                    s: "protestos-cenprot-sp",
                    cpf: removerCaracteresEspeciais(requisicao.cpf),
                    "govbr-senha": "trafego10",
                    "govbr-cpf": "30156844850",
                };
            }
        } else if (tipoConsulta == "protestos_pj") {
            if (!requisicao.cnpj) {
                return res
                    .status(400)
                    .send({ message: "Informe um CNPJ válido" });
            } else {
                requisicaoBody = {
                    s: "protestos-cenprot",
                    cnpj: removerCaracteresEspeciais(requisicao.cnpj),
                    "govbr-senha": "trafego10",
                    "govbr-cpf": "30156844850",
                };
                requisicaoBody2 = {
                    s: "protestos-cenprot-sp",
                    cnpj: removerCaracteresEspeciais(requisicao.cnpj),
                    "govbr-senha": "trafego10",
                    "govbr-cpf": "30156844850",
                };
            }
        } else if (tipoConsulta == "receita_federal_cnd_cpf") {
            requisicaoBody = {
                s: "receita-federal-cnd",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
            };
        } else if (tipoConsulta == "receita_federal_cnd_cnpj") {
            requisicaoBody = {
                s: "receita-federal-cnd",
                cnpj: removerCaracteresEspeciais(requisicao.cnpj),
            };
        } else if (tipoConsulta == "sefaz_cnd") {
            requisicaoBody = {
                s: "sefaz-cnd",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
                uf: requisicao.uf,
            };
        } else if (tipoConsulta == "cnd_trabalhista") {
            requisicaoBody = {
                s: "cnd-trabalhista",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
            };
        } else if (tipoConsulta == "cnd_trabalhista_mte_cpf") {
            requisicaoBody = {
                s: "cnd-trabalhista-mte",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
                "govbr-senha": "trafego10",
                "govbr-cpf": "30156844850",
            };
        } else if (tipoConsulta == "cnd_trabalhista_mte_cnpj") {
            requisicaoBody = {
                s: "cnd-trabalhista-mte",
                cnpj: removerCaracteresEspeciais(requisicao.cnpj),
                "govbr-senha": "trafego10",
                "govbr-cpf": "30156844850",
            };
        } else if (tipoConsulta == "receita_federal_cnpj") {
            requisicaoBody = {
                s: "receita-federal-cnpj",
                cnpj: removerCaracteresEspeciais(requisicao.cnpj),
            };
        } else if (tipoConsulta == "receita_federal_cnpj_qsa") {
            requisicaoBody = {
                s: "receita-federal-cnpj-qsa",
                cnpj: removerCaracteresEspeciais(requisicao.cnpj),
            };
        } else if (tipoConsulta == "receita_federal_cpf_data_nascimento") {
            requisicaoBody = {
                s: "receita-federal-cpf-data-nascimento",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
            };
        } else if (tipoConsulta == "endereco_cpf") {
            requisicaoBody = {
                s: "endereco-cpf",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
            };
        } else if (tipoConsulta == "receita_federal_cpf") {
            const formatedDate = format(
                parse(requisicao.dataNascimento, "yyyyMMdd", new Date()),
                "ddMMyyy"
            );

            requisicaoBody = {
                s: "receita-federal-cpf",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
                "data-nascimento": formatedDate,
            };
        } else if (tipoConsulta == "empresas_relacionadas_cpf") {
            requisicaoBody = {
                s: "empresas-relacionadas-cpf",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
            };
        } else if (tipoConsulta === "pessoas_relacionadas_cnpj") {
            requisicaoBody = {
                s: "pessoas-relacionadas-cnpj",
                cnpj: removerCaracteresEspeciais(requisicao.cnpj),
            };
        } else if (tipoConsulta === "pep_kyc_cpf") {
            requisicaoBody = {
                s: "pep-kyc-cpf",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
            };
        } else if (tipoConsulta === "receita_federal_cnpj_qsa") {
            requisicaoBody = {
                s: "receita-federal-cnpj-qsa",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
            };
        } else if (tipoConsulta === "cnd_trabalhista_cnpj") {
            requisicaoBody = {
                s: "cnd-trabalhista",
                cnpj: removerCaracteresEspeciais(requisicao.cnpj),
            };
        } else if (tipoConsulta === "cnd_trabalhista_cpf") {
            requisicaoBody = {
                s: "cnd-trabalhista",
                cpf: removerCaracteresEspeciais(requisicao.cpf),
            };
        }

        // Consulta Netrin
        const retornoNetrin = await apiNetrinService().consultaComposta(
            requisicaoBody
        );

        if (tipoConsulta == "protestos_pf") {
            // Consulta Netrin
            const retornoNetrin2 = await apiNetrinService().consultaComposta(
                requisicaoBody
            );
            //console.log(retornoNetrin2);
        }

        if (!retornoNetrin) {
            res.status(400).json({
                success: false,
                errorCode: "R01",
                message: "Recibo não encontrado",
            });
        }

        if (
            tipoConsulta === "receita_federal_cpf" &&
            retornoNetrin?.receitaFederal?.code === 606
        ) {
            return res.status(401).json({
                success: false,
                message: "A data de nascimento está divergente com o CPF!",
            });
        }

        const data = await prisma.consultaNetrin.create({
            data: {
                tipoConsulta,
                requisicao,
                retorno: retornoNetrin,
                imobiliaria: {
                    connect: {
                        id: req.user?.imobiliariaId,
                    },
                },
                processo: processoId
                    ? {
                          connect: {
                              id: processoId,
                          },
                      }
                    : {},
                fichaCadastral: fichaCadastralId
                    ? {
                          connect: {
                              id: fichaCadastralId,
                          },
                      }
                    : {},
            },
            include: {
                imobiliaria: true,
            },
        });

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        if (tipoConsulta == "sefaz_cnd") {
            const extension = ".pdf";
            const nameLocation = `anexo/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${extension}`;
            const response = await axios.get(
                retornoNetrin.sefazCND.urlComprovante,
                {
                    responseType: "blob",
                }
            );
            UploadAnexo({
                fichaCadastralId,
                nameLocation,
                processoId,
                requisicao,
                tipoConsulta,
                user: req.user,
                blob: response.data,
            });
        } else if (tipoConsulta == "receita_federal_cnd") {
            const extension = ".pdf";
            const nameLocation = `anexo/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${extension}`;
            const response = await axios.get(
                retornoNetrin.receitaFederalCND.urlComprovante,
                {
                    responseType: "blob",
                }
            );
            UploadAnexo({
                fichaCadastralId,
                nameLocation,
                processoId,
                requisicao,
                tipoConsulta,
                user: req.user,
                blob: response.data,
            });
        } else if (tipoConsulta == "cnd_trabalhista") {
            const extension = ".pdf";
            const nameLocation = `anexo/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${extension}`;
            const response = await axios.get(
                retornoNetrin.tribunalSuperiorTrabalhoCNDT.urlComprovante,
                {
                    responseType: "blob",
                }
            );
            UploadAnexo({
                fichaCadastralId,
                nameLocation,
                processoId,
                requisicao,
                tipoConsulta,
                user: req.user,
                blob: response.data,
            });
        } else if (tipoConsulta == "receita_federal_cnpj") {
            const extension = ".pdf";
            const nameLocation = `anexo/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${extension}`;
            const response = await axios.get(
                retornoNetrin.receitaFederal.urlComprovante,
                {
                    responseType: "blob",
                }
            );
            UploadAnexo({
                fichaCadastralId,
                nameLocation,
                processoId,
                requisicao,
                tipoConsulta,
                user: req.user,
                blob: response.data,
            });
        } else if (tipoConsulta == "receita_federal_cnpj_qsa") {
            const extension = ".pdf";
            const nameLocation = `anexo/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${extension}`;
            const response = await axios.get(
                retornoNetrin.receitaFederalQsa.urlComprovante,
                {
                    responseType: "blob",
                }
            );
            UploadAnexo({
                fichaCadastralId,
                nameLocation,
                processoId,
                requisicao,
                tipoConsulta,
                user: req.user,
                blob: response.data,
            });
        } else {
            await page.goto(
                process.env.NODE_ENV == "production"
                    ? "https://" +
                          data?.imobiliaria.url +
                          ".imo7.com.br/consultas/" +
                          data.id +
                          "/pdf"
                    : "http://" +
                          data?.imobiliaria.url +
                          ".localhost:3000/consultas/" +
                          data.id +
                          "/pdf",
                {
                    waitUntil: "networkidle0",
                }
            );
            await page.emulateMediaType("screen");
            const pdf = await page.pdf({
                format: "A4",
                margin: {
                    top: "20px",
                    right: "20px",
                    bottom: "20px",
                    left: "20px",
                },
            });

            await browser.close();

            const extension = ".pdf";
            const nameLocation = `anexo/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${extension}`;
            // Create read stream to file
            // const stats = statSync(anexos.path);
            // const nodeFsBlob = new os.NodeFSBlob(anexos.path, stats.size);
            // const objectData = await nodeFsBlob.getData();
            // const imageData = fs.readFileSync(anexos.path);
            // const base64Data = imageData.toString("base64");

            // const buff = Buffer.from(base64Data, "base64");
            UploadAnexo({
                fichaCadastralId,
                nameLocation,
                processoId,
                requisicao,
                tipoConsulta,
                user: req.user,
                blob: pdf,
            });
        }

        res.send(data);
    } catch (error) {
        //console.log(error.response);
        return res.status(500).send({ message: error.message, error });
    }
});

export default handle;

const UploadAnexo = ({
    user,
    tipoConsulta,
    requisicao,
    processoId,
    fichaCadastralId,
    nameLocation,
    blob,
}) => {
    new Upload({
        client: new S3Client({
            credentials: {
                accessKeyId: process.env.STORAGE_KEY,
                secretAccessKey: process.env.STORAGE_SECRET,
            },
            region: process.env.STORAGE_REGION,
            endpoint: process.env.STORAGE_ENDPOINT,
            tls: false,
            forcePathStyle: true,
        }),
        params: {
            ACL: "public-read",
            Bucket: process.env.STORAGE_BUCKET,
            Key: nameLocation,
            Body: blob,
        },
    })
        .done()
        .then(async (data) => {
            //console.log(data);
            // if (getObjectResponse.contentLength == 0) {
            //     return res.status(400).send({
            //         message: `O arquivo ${i[0]} está corrompido ou sem conteúdo. Caso persista, contate o suporte.`,
            //     });
            // }
            const anexo = await prisma.anexo.create({
                data: {
                    nome: `${
                        tipoConsulta == "processos_pf"
                            ? `Consulta Processos Pessoa Física - CPF: ${requisicao?.cpf}`
                            : tipoConsulta == "processos_pj"
                            ? `Consulta Processos Pessoa Jurídica - CNPJ: ${requisicao?.cnpj}`
                            : tipoConsulta == "protestos_pf"
                            ? `Consulta Protestos Pessoa Física - CPF: ${requisicao?.cpf}`
                            : tipoConsulta == "protestos_pj"
                            ? `Consulta Protestos Pessoa Jurídica - CNPJ: ${requisicao?.cnpj}`
                            : `Consultas: ${tipoConsulta}`
                    }`,
                    anexo: process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation,
                    processo: processoId
                        ? {
                              connect: {
                                  id: processoId,
                              },
                          }
                        : {},
                    fichaCadastral: fichaCadastralId
                        ? {
                              connect: {
                                  id: fichaCadastralId,
                              },
                          }
                        : {},
                    usuario: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });
        })
        .catch((err) => {
            throw new Error(
                `Não conseguimos salvar o arquivo, verifique o arquivo. Caso persista, contate o suporte.`
            );
        });
};
