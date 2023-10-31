import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import * as os from "oci-objectstorage";

import { statSync } from "fs";
const handler = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
import slug from "slug";
import { checkAuth } from "@/middleware/checkAuth";
import { multiparty } from "@/middleware/multipart";
import fs from "fs";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

handler.use(cors);
handler.use(checkAuth);
handler.use(multiparty);

handler.get(async (req, res) => {
    try {
        const { id } = req.query;
        const data = await prisma.anexo.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                usuariosPermitidos: true,
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send(error);
    }
});
handler.post(async (req, res) => {
    try {
        const { id } = req.query;

        const {
            contratoId,
            usuarioId,
            chamadoId,
            conversaId,
            nome,
            usuariosPermitidos,
        } = req.body;
        console.log(JSON.parse(usuariosPermitidos));
        const { anexos } = req.files;
        const anexo = await prisma.anexo.update({
            where: {
                id: Number(id),
            },
            data: {
                nome,

                usuariosPermitidos: usuariosPermitidos
                    ? {
                          connect: JSON.parse(usuariosPermitidos).map(
                              (item) => {
                                  return {
                                      id: item.id,
                                  };
                              }
                          ),
                      }
                    : {},
            },
        });
        if (anexos) {
            const extension = anexos.name.slice(
                (Math.max(0, anexos.name.lastIndexOf(".")) || Infinity) + 1
            );

            const nameLocation = `anexo/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${extension}`;

            // Create read stream to file
            const stats = statSync(anexos.path);
            const nodeFsBlob = new os.NodeFSBlob(anexos.path, stats.size);
            const objectData = await nodeFsBlob.getData();
            const imageData = fs.readFileSync(anexos.path);
            const base64Data = imageData.toString("base64");
            let buff = Buffer.from(base64Data, "base64");
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
                    const anexo = await prisma.anexo.update({
                        where: {
                            id: Number(id),
                        },
                        data: {
                            nome,
                            anexo:
                                process.env.NEXT_PUBLIC_URL_STORAGE +
                                nameLocation,
                            contrato: contratoId
                                ? {
                                      connect: {
                                          id: Number(contratoId),
                                      },
                                  }
                                : {},
                            chamado: chamadoId
                                ? {
                                      connect: {
                                          id: Number(chamadoId),
                                      },
                                  }
                                : {},
                            conversa: conversaId
                                ? {
                                      connect: {
                                          id: Number(conversaId),
                                      },
                                  }
                                : {},
                            usuario: {
                                connect: {
                                    id: req.user.id,
                                },
                            },
                            usuariosPermitidos: usuariosPermitidos
                                ? {
                                      connect: JSON.parse(
                                          usuariosPermitidos
                                      ).map((item) => {
                                          return {
                                              id: item.id,
                                          };
                                      }),
                                  }
                                : {},
                        },
                    });
                    if (conversaId && chamadoId) {
                        await prisma.interacaoChamado.create({
                            data: {
                                conversa: {
                                    connect: {
                                        id: Number(conversaId),
                                    },
                                },
                                chamado: {
                                    connect: {
                                        id: Number(chamadoId),
                                    },
                                },
                                anexos: {
                                    connect: {
                                        id: anexo.id,
                                    },
                                },
                                mensagem: "Arquivo atualizado",
                                usuario: {
                                    connect: {
                                        id: req.user.id,
                                    },
                                },
                            },
                        });
                    }
                    if (chamadoId) {
                        await prisma.historicoChamado.create({
                            data: {
                                chamado: {
                                    connect: {
                                        id: Number(chamadoId),
                                    },
                                },
                                usuario: {
                                    connect: {
                                        id: req.user.id,
                                    },
                                },
                                descricao: `Arquivo anexado foi alterado: ${
                                    nome ? nome : ""
                                } <a href="${
                                    process.env.NEXT_PUBLIC_URL_STORAGE +
                                    nameLocation
                                }" target="_blank">Visualizar arquivo</a>`,
                            },
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(400).send({
                        message: `Não conseguimos salvar o arquivo ${i[0]}, verifique o arquivo. Caso persista, contate o suporte.`,
                    });
                });
        }

        res.send({
            success: true,
            data: null,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
function compareStreams(stream1: st.Readable, stream2: st.Readable): boolean {
    return streamToString(stream1) === streamToString(stream2);
}

function streamToString(stream: st.Readable) {
    let output = "";
    stream.on("data", function (data) {
        output += data.toString();
    });
    stream.on("end", function () {
        return output;
    });
}
export const config = {
    api: {
        bodyParser: false,
    },
};
handler.delete(async (req, res) => {
    try {
        const { id } = req.query;

        const foto = await prisma.anexo.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (foto) {
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
            // console.log(
            //     foto.anexo.replace(process.env.NEXT_PUBLIC_URL_STORAGE, "")
            // );
            // const deleteObjectRequest: os.requests.DeleteObjectRequest = {
            //     namespaceName: namespace,
            //     bucketName: bucket,
            //     objectName: foto.anexo.replace(
            //         process.env.NEXT_PUBLIC_URL_STORAGE,
            //         ""
            //     ),
            // };
            // const putObjectResponse = await client.deleteObject(
            //     deleteObjectRequest
            // );
            // console.log(putObjectResponse);
            await prisma.anexo.delete({
                where: {
                    id: Number(id),
                },
            });
        }
        res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
        });
    }
});
export default handler;
