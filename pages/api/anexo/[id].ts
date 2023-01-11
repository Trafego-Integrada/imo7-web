import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { providerStorage } from "@/lib/storage";
import * as os from "oci-objectstorage";

const handler = nextConnect();
import { cors } from "@/middleware/cors";
handler.use(cors);
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
