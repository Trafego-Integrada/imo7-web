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
handler.use(multiparty);

handler.post(async (req, res) => {
    try {
        const { id } = req.query;

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

        for await (const i of Object.entries(req.files)) {
            const extension = i[1][0].name?.slice(
                (Math.max(0, i[1][0].name?.lastIndexOf(".")) || Infinity) + 1
            );
            const nameLocation = `teste/${id}/anexos/${slug(
                `${i[0]}-${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${extension}`;
            // Create read stream to file
            const stats = statSync(i[1][0].path);
            const imageData = fs.readFileSync(i[1][0].path);
            const base64Data = imageData.toString("base64");
            const buff = Buffer.from(base64Data, "base64");

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
                                                campoFichaCadastralCodigo: i[0],
                                            },
                                    },
                                    create: {
                                        campoFichaCadastralCodigo: i[0],
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
                        message: `Não conseguimos salvar o arquivo ${i[0]}, verifique o arquivo. Caso persista, contate o suporte.`,
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
export const config = {
    api: {
        bodyParser: false,
    },
};
export default handler;
