import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import { multiparty } from "@/middleware/multipart";
import moment from "moment";
import { statSync } from "fs";
import slug from "slug";
import fs from "fs";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

const handler = nextConnect();
handler.use(cors);

handler.post(async (req, res) => {
    try {
        const { id } = req.query;
        const { arquivos } = req.body;
        // const client = new os.ObjectStorageClient({
        //     authenticationDetailsProvider: providerStorage,
        // });
        // const bucket = "imo7-standard-storage";

        // const request: os.requests.GetNamespaceRequest = {};
        // const response = await client.getNamespace(request);

        // const namespace = response.value;

        // const getBucketRequest: os.requests.GetBucketRequest = {
        //     namespaceName: namespace,
        //     bucketName: bucket,
        // };
        // const getBucketResponse = await client.getBucket(getBucketRequest);

        for await (const i of arquivos) {
            const extension = i.extensao;
            const nameLocation = `teste/${id}/anexos/${slug(
                `${i.nome}-${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${extension}`;
            //Create read stream to file
            //  const stats = statSync(i[1].path);
            //  const imageData = fs.readFileSync(i[1].path);
            const buff = Buffer.from(i.base64, "base64");
            console.log("Buffer", buff);
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
                    await prisma.fichaCadastral.update({
                        where: {
                            id,
                        },
                        data: {
                            preenchimento: {
                                upsert: {
                                    where: {
                                        fichaCadastralId_campoFichaCadastralCodigo:
                                            {
                                                fichaCadastralId: id,
                                                campoFichaCadastralCodigo:
                                                    i.nome,
                                            },
                                    },
                                    create: {
                                        campoFichaCadastralCodigo: i.nome,
                                        valor:
                                            process.env
                                                .NEXT_PUBLIC_URL_STORAGE +
                                            nameLocation,
                                    },
                                    update: {
                                        valor:
                                            process.env
                                                .NEXT_PUBLIC_URL_STORAGE +
                                            nameLocation,
                                    },
                                },
                            },
                        },
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(400).send({
                        message: `Não conseguimos salvar o arquivo ${i.nome}, verifique o arquivo. Caso persista, contate o suporte.`,
                    });
                });
        }

        return res.send();
    } catch (error) {
        console.log(error?.response);
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handler;
