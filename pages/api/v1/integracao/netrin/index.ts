import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "@/middleware/checkAuth";
import { apiNetrinService } from "@/services/apiNetrin";
import { cors } from "@/middleware/cors";
import { removerCaracteresEspeciais } from "@/helpers/helpers";
import { Prisma } from "@prisma/client";
import puppeteer from "puppeteer";
import fs from "fs";

import st from "stream";
import { providerStorage } from "@/lib/storage";
import slug from "slug";
import * as os from "oci-objectstorage";
import { createReadStream, statSync } from "fs";

const handle = nextConnect<NextApiRequest, NextApiResponse>();
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { processoId, fichaCadastralId } = req.query;
    console.log(req.query);

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
                    s: "protestos-cenprot",
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
            console.log(retornoNetrin2);
        }
        if (!retornoNetrin) {
            res.status(400).json({
                success: false,
                errorCode: "R01",
                message: "Recibo não encontrado",
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
        const client = new os.ObjectStorageClient({
            authenticationDetailsProvider: providerStorage,
        });
        const bucket = "imo7-standard-storage";

        const request: os.requests.GetNamespaceRequest = {};
        const response = await client.getNamespace(request);

        const namespace = response.value;

        const getBucketRequest: os.requests.GetBucketRequest = {
            namespaceName: namespace,
            bucketName: bucket,
        };
        const getBucketResponse = await client.getBucket(getBucketRequest);

        const extension = ".pdf";
        const nameLocation = `anexo/${slug(
            `${moment()}${Math.random() * (999999999 - 100000000) + 100000000}`
        )}.${extension}`;
        // Create read stream to file
        // const stats = statSync(anexos.path);
        // const nodeFsBlob = new os.NodeFSBlob(anexos.path, stats.size);
        // const objectData = await nodeFsBlob.getData();
        // const imageData = fs.readFileSync(anexos.path);
        // const base64Data = imageData.toString("base64");

        // const buff = Buffer.from(base64Data, "base64");
        const putObjectRequest: os.requests.PutObjectRequest = {
            namespaceName: namespace,
            bucketName: bucket,
            putObjectBody: pdf,
            objectName: nameLocation,
            //contentLength: stats.size,
        };
        const putObjectResponse = await client.putObject(putObjectRequest);

        const getObjectRequest: os.requests.GetObjectRequest = {
            objectName: nameLocation,
            bucketName: bucket,
            namespaceName: namespace,
        };
        const getObjectResponse = await client.getObject(getObjectRequest);

        if (getObjectResponse) {
            const anexo = await prisma.anexo.create({
                data: {
                    nome: `${
                        data.tipoConsulta == "processos_pf"
                            ? `Consulta Processos Pessoa Física - CPF: ${data.requisicao?.cpf}`
                            : data.tipoConsulta == "processos_pj"
                            ? `Consulta Processos Pessoa Jurídica - CNPJ: ${data.requisicao?.cnpj}`
                            : data.tipoConsulta == "protestos_pf"
                            ? `Consulta Protestos Pessoa Física - CPF: ${data.requisicao?.cpf}`
                            : data.tipoConsulta == "protestos_pj"
                            ? `Consulta Protestos Pessoa Jurídica - CNPJ: ${data.requisicao?.cnpj}`
                            : "Consultas"
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
                            id: req.user.id,
                        },
                    },
                },
            });
        }

        res.send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message, error });
    }
});

export default handle;
