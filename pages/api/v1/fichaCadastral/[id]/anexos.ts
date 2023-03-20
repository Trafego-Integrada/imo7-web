import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { providerStorage } from "@/lib/storage";
import * as os from "oci-objectstorage";

const handler = nextConnect();
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";
import { multiparty } from "@/middleware/multipart";
import moment from "moment";
import { statSync } from "fs";
import slug from "slug";

handler.use(cors);
handler.use(multiparty);
handler.post(async (req, res) => {
    try {
        const { id } = req.query;
        console.log(id);
        console.log(req.files);
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
        console.log(getBucketResponse);
        await Promise.all(
            Object.entries(req.files).map(async (i) => {
                console.log(i);
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

                const putObjectRequest: os.requests.PutObjectRequest = {
                    namespaceName: namespace,
                    bucketName: bucket,
                    putObjectBody: objectData,
                    objectName: nameLocation,
                    contentLength: stats.size,
                };
                const putObjectResponse = await client.putObject(
                    putObjectRequest
                );
                console.log(putObjectResponse);
                const getObjectRequest: os.requests.GetObjectRequest = {
                    objectName: nameLocation,
                    bucketName: bucket,
                    namespaceName: namespace,
                };
                const getObjectResponse = await client.getObject(
                    getObjectRequest
                );
                console.log(getObjectResponse);
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

        res.send();
    } catch (error) {
        console.log(error);
        console.log(error?.response);
        res.status(500).send({
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
