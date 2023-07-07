import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { providerStorage } from "@/lib/storage";
import * as os from "oci-objectstorage";
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";
import { multiparty } from "@/middleware/multipart";
import moment from "moment";
import { statSync } from "fs";
import slug from "slug";
import fs from "fs";

const handler = nextConnect();
handler.use(cors);
handler.use(multiparty);
handler.post(async (req, res) => {
    try {
        const { id } = req.query;

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

        await Promise.all(
            Object.entries(req.files).map(async (i) => {
                const extension = i[1].name.slice(
                    (Math.max(0, i[1].name.lastIndexOf(".")) || Infinity) + 1
                );
                const nameLocation = `fichaCadastral/${id}/anexos/${slug(
                    `${i[0]}-${moment()}${
                        Math.random() * (999999999 - 100000000) + 100000000
                    }`
                )}.${extension}`;
                // Create read stream to file
                const stats = statSync(i[1].path);
                const nodeFsBlob = new os.NodeFSBlob(i[1].path, stats.size);
                const objectData = await nodeFsBlob.getData();
                const imageData = fs.readFileSync(i[1].path);
                const base64Data = imageData.toString("base64");
                const putObjectRequest: os.requests.PutObjectRequest = {
                    namespaceName: namespace,
                    bucketName: bucket,
                    putObjectBody: base64Data,
                    objectName: nameLocation,
                    contentLength: stats.size,
                };
                const putObjectResponse = await client.putObject(
                    putObjectRequest
                );
                const getObjectRequest: os.requests.GetObjectRequest = {
                    objectName: nameLocation,
                    bucketName: bucket,
                    namespaceName: namespace,
                };
                const getObjectResponse = await client.getObject(
                    getObjectRequest
                );
                if (getObjectResponse) {
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
                }
            })
        );

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
