import nextConnect from "next-connect";

import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import fs, { statSync } from "fs";
import moment from "moment";
import * as os from "oci-objectstorage";
import slug from "slug";
import st from "stream";

import { cors } from "@/middleware/cors";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "1000mb", // Set desired value here
        },
    },
};
const handle = nextConnect();
handle.use(cors);
handle.use(checkAuth);
// handle.use(multiparty);

handle.get(async (req, res) => {
    try {
        const { contratoId, chamadoId, processoId, fichaCadastralId } =
            req.query;
        let filtroQuery = {};
        if (contratoId) {
            filtroQuery = {
                ...filtroQuery,
                contratoId: Number(contratoId),
            };
        }

        if (chamadoId) {
            filtroQuery = {
                ...filtroQuery,
                chamadoId: Number(chamadoId),
            };
        }
        if (processoId) {
            filtroQuery = {
                ...filtroQuery,
                processoId,
            };
        }
        if (fichaCadastralId) {
            filtroQuery = {
                ...filtroQuery,
                fichaCadastralId,
            };
        }

        const data = await prisma.anexo.findMany({
            where: {
                ...filtroQuery,
            },
            include: {
                usuario: true,
            },
            orderBy: {
                id: "desc",
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
handle.post(async (req, res) => {
    try {
        const { id } = req.query;

        const {
            contratoId,
            chamadoId,
            conversaId,
            processoId,
            fichaCadastralId,
            nome,
            usuariosPermitidos,
            anexos,
        } = req.body;
        // const { anexos } = req.files;

        //console.log(req.body);
        if (anexos && Array.isArray(anexos) && anexos.length > 0) {
            for await (const foto of anexos) {
                const extension = nome.slice(
                    (Math.max(0, nome.lastIndexOf(".")) || Infinity) + 1
                );
                const nameLocation = `anexo/${slug(
                    `${moment()}${
                        Math.random() * (999999999 - 100000000) + 100000000
                    }`
                )}.${extension}`;
                // Create read stream to file
                const stats = statSync(foto.path);
                const nodeFsBlob = new os.NodeFSBlob(foto.path, stats.size);
                const objectData = await nodeFsBlob.getData();
                const imageData = fs.readFileSync(foto.path);
                const base64Data = imageData.toString("base64");

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
                        Body: base64Data,
                    },
                })
                    .done()
                    .then(async (data) => {
                        //console.log(data);
                        const anexo = await prisma.anexo.create({
                            data: {
                                nome: nome,
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
                                usuariosPermitidos: usuariosPermitidos
                                    ? {
                                          connect: usuariosPermitidos.map(
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
                                    mensagem: "Arquivos anexados",
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
                                    descricao: `Arquivo anexado: ${
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
                        //console.log(err);
                        return res.status(400).send({
                            message: `Não conseguimos salvar o arquivo ${i[0]}, verifique o arquivo. Caso persista, contate o suporte.`,
                        });
                    });
            }
        } else if (anexos) {
            const nameLocation = `anexo/${slug(
                `${moment()}${
                    Math.random() * (999999999 - 100000000) + 100000000
                }`
            )}.${anexos.extensao}`;
            // Create read stream to file
            // const stats = statSync(anexos.path);
            // const nodeFsBlob = new os.NodeFSBlob(anexos.path, stats.size);
            // const objectData = await nodeFsBlob.getData();
            // const imageData = fs.readFileSync(anexos.path);
            // const base64Data = imageData.toString("base64");
            const buff = Buffer.from(anexos.base64, "base64");
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
                    //console.log(data);
                    const anexo = await prisma.anexo.create({
                        data: {
                            nome: nome,
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
                                mensagem: "Arquivos anexados",
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
                                descricao: `Arquivo anexado: ${
                                    nome ? nome : ""
                                } <a href="${
                                    process.env.NEXT_PUBLIC_URL_STORAGE +
                                    nameLocation
                                }" target="_blank">Visualizar arquivo</a>`,
                            },
                        });
                    }
                    res.send({
                        success: true,
                        data: null,
                    });
                })
                .catch((err) => {
                    //console.log(err);
                    return res.status(400).send({
                        message: `Não conseguimos salvar o arquivo ${nome}, verifique o arquivo. Caso persista, contate o suporte.`,
                    });
                });
        }
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

export default handle;
