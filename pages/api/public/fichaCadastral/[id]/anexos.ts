import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import moment from "moment";
import nextConnect from "next-connect";
import slug from "slug";

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
                    // if (getObjectResponse.contentLength == 0) {
                    //     return res.status(400).send({
                    //         message: `O arquivo ${i[0]} está corrompido ou sem conteúdo. Caso persista, contate o suporte.`,
                    //     });
                    // }
                    const campo = await prisma.campoFichaCadastral.findUnique({
                        where: {
                            codigo: i.nome,
                        },
                    });
                    if (
                        campo?.tipoCampo == "files" ||
                        campo?.tipoCampo == "file" ||
                        campo?.tipoCampo == "image"
                    ) {
                        let val = [];
                        const existe =
                            await prisma.fichaCadastralPreenchimento.findUnique(
                                {
                                    where: {
                                        fichaCadastralId_campoFichaCadastralCodigo:
                                            {
                                                fichaCadastralId: id,
                                                campoFichaCadastralCodigo:
                                                    i.nome,
                                            },
                                    },
                                }
                            );

                        if (existe) {
                            val = existe.valor ? JSON.parse(existe.valor) : [];
                            val.push(
                                process.env.NEXT_PUBLIC_URL_STORAGE +
                                    nameLocation
                            );
                        } else {
                            val = [
                                process.env.NEXT_PUBLIC_URL_STORAGE +
                                    nameLocation,
                            ];
                        }
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
                                            valor: JSON.stringify(val),
                                        },
                                        update: {
                                            valor: JSON.stringify(val),
                                        },
                                    },
                                },
                            },
                        });
                    } else {
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
                                            valor: JSON.stringify([
                                                process.env
                                                    .NEXT_PUBLIC_URL_STORAGE +
                                                    nameLocation,
                                            ]),
                                        },
                                        update: {
                                            valor: JSON.stringify([
                                                process.env
                                                    .NEXT_PUBLIC_URL_STORAGE +
                                                    nameLocation,
                                            ]),
                                        },
                                    },
                                },
                            },
                        });
                    }
                })
                .catch((err) => {
                    return res.status(400).send({
                        message: `Não conseguimos salvar o arquivo ${i.nome}, verifique o arquivo. Caso persista, contate o suporte.`,
                    });
                });
        }

        return res.send({});
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

handler.delete(async (req, res) => {
    try {
        const { multiple, arquivo, codigo, id } = req.query;

        if (multiple) {
            const preenchimento =
                await prisma.fichaCadastralPreenchimento.findUnique({
                    where: {
                        fichaCadastralId_campoFichaCadastralCodigo: {
                            campoFichaCadastralCodigo: codigo,
                            fichaCadastralId: id,
                        },
                    },
                });

            await prisma.fichaCadastralPreenchimento.update({
                where: {
                    fichaCadastralId_campoFichaCadastralCodigo: {
                        campoFichaCadastralCodigo: codigo,
                        fichaCadastralId: id,
                    },
                },
                data: {
                    valor:
                        JSON.parse(preenchimento?.valor).filter(
                            (i) => i != arquivo
                        ).length != 0
                            ? JSON.stringify(
                                  JSON.parse(preenchimento?.valor).filter(
                                      (i) => i != arquivo
                                  )
                              )
                            : null,
                },
            });
        } else {
            await prisma.fichaCadastralPreenchimento.update({
                where: {
                    fichaCadastralId_campoFichaCadastralCodigo: {
                        campoFichaCadastralCodigo: codigo,
                        fichaCadastralId: id,
                    },
                },
                data: {
                    valor: null,
                },
            });
        }
        return res.send(req.query);
    } catch (error) {
        return res.status(500).send({ error });
    }
});
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "1000mb", // Set desired value here
        },
    },
};
export default handler;
