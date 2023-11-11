import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { multiparty } from "@/middleware/multipart";
import { statSync } from "fs";
import moment from "moment";
import nextConnect from "next-connect";
import * as os from "oci-objectstorage";
import slug from "slug";
import fs from "fs";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
const handle = nextConnect();

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "200mb", // Set desired value here
        },
    },
};
handle.use(cors);
handle.use(checkAuth);
// handle.use(multiparty);
handle.get(async (req, res) => {
    const { id } = req.query;
    const imobiliarias = await prisma.imobiliaria.findUnique({
        where: {
            id: Number(id),
        },
    });
    res.send(imobiliarias);
});

handle.post(async (req, res) => {
    try {
        const { id } = req.query;
        const {
            codigo,
            cnpj,
            razaoSocial,
            bairro,
            cep,
            cidade,
            email,
            endereco,
            estado,
            ie,
            nomeFantasia,
            url,
            telefone,
            site,
            numero,
            removerLogo,
            removerBg,
            smtpHost,
            smtpPort,
            smtpUser,
            smtpPass,
            smtpSecure,
            smtpFrom,
            smtpReplyTo,
            diasDownloadBoleto,
            emailEnvioBoleto,
            emailEnvioExtrato,
            emailAssuntoExtrato,
            emailMensagemExtrato,
            enviarEmail,
            enviarWhatsapp,
            contaId,
            logo,
            bg,
        } = req.body;
        let limparLogo = {};
        let limparBg = {};
        if (removerLogo) {
            limparLogo = {
                logo: null,
            };
        }
        if (limparBg) {
            limparBg = {
                bg: null,
            };
        }
        const imobiliaria = await prisma.imobiliaria.update({
            where: {
                id: Number(id),
            },
            data: {
                codigo,
                cnpj,
                razaoSocial,
                bairro,
                cep,
                cidade,
                email,
                endereco,
                estado,
                ie,
                nomeFantasia,
                url,
                telefone,
                site,
                numero,
                smtpHost,
                smtpPort,
                smtpUser,
                smtpPass,
                smtpSecure: JSON.parse(smtpSecure),
                smtpFrom,
                smtpReplyTo,
                diasDownloadBoleto: JSON.parse(diasDownloadBoleto)
                    ? Number(diasDownloadBoleto)
                    : null,
                emailEnvioBoleto,
                emailEnvioExtrato,
                emailAssuntoExtrato,
                emailMensagemExtrato,
                enviarEmail: JSON.parse(enviarEmail),
                enviarWhatsapp: JSON.parse(enviarWhatsapp),
                ...limparLogo,
                ...limparBg,
                contaId: Number(contaId),
            },
        });

        if (logo) {
            const nameLocation = `logos/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${logo.extensao}`;
            // Create read stream to file
            // const stats = statSync(logo.path);
            // const nodeFsBlob = new os.NodeFSBlob(logo.path, stats.size);
            // const objectData = await nodeFsBlob.getData();
            // const imageData = fs.readFileSync(logo.path);
            // const base64Data = imageData.toString("base64");
            const buff = Buffer.from(logo.base64, "base64");
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
                    Body: buff,
                },
            })
                .done()
                .then(async (data) => {
                    console.log(data);
                    // if (getObjectResponse.contentLength == 0) {
                    //     return res.status(400).send({
                    //         message: `O arquivo ${i[0]} está corrompido ou sem conteúdo. Caso persista, contate o suporte.`,
                    //     });
                    // }
                    const anexo = await prisma.imobiliaria.update({
                        where: {
                            id: Number(id),
                        },
                        data: {
                            logo:
                                process.env.NEXT_PUBLIC_URL_STORAGE +
                                nameLocation,
                        },
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(400).send({
                        message: `Não conseguimos salvar o arquivo, verifique o arquivo. Caso persista, contate o suporte.`,
                    });
                });
        }
        if (bg) {
            // const extension = bg.name.slice(
            //     (Math.max(0, bg.name.lastIndexOf(".")) || Infinity) + 1
            // );
            const nameLocation = `bgs/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${bg.extensao}`;
            // Create read stream to file
            // const stats = statSync(bg.path);
            // const nodeFsBlob = new os.NodeFSBlob(bg.path, stats.size);
            // const objectData = await nodeFsBlob.getData();
            // const imageData = fs.readFileSync(bg.path);
            // const base64Data = imageData.toString("base64");
            const buff = Buffer.from(bg.base64, "base64");
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
                    Body: buff,
                },
            })
                .done()
                .then(async (data) => {
                    console.log(data);
                    // if (getObjectResponse.contentLength == 0) {
                    //     return res.status(400).send({
                    //         message: `O arquivo ${i[0]} está corrompido ou sem conteúdo. Caso persista, contate o suporte.`,
                    //     });
                    // }
                    const anexo = await prisma.imobiliaria.update({
                        where: {
                            id: Number(id),
                        },
                        data: {
                            bg:
                                process.env.NEXT_PUBLIC_URL_STORAGE +
                                nameLocation,
                        },
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(400).send({
                        message: `Não conseguimos salvar o arquivo, verifique o arquivo. Caso persista, contate o suporte.`,
                    });
                });
        }

        res.send(imobiliaria);
    } catch (error) {
        res.status(500).send(error);
    }
});
handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.imobiliaria.delete({
        where: {
            id: Number(id),
        },
    });
    res.send(data);
});
export default handle;
