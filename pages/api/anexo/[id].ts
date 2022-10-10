import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { providerStorage } from "@/lib/storage";
import * as os from "oci-objectstorage";

const handler = nextConnect();

handler.delete(async (req, res) => {
    try {
        const { id } = req.query;

        const foto = await prisma.anexo.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (foto) {
            const client = new os.ObjectStorageClient({
                authenticationDetailsProvider: providerStorage,
            });
            const bucket = "imo7-standard-storage";

            const request: os.requests.GetNamespaceRequest = {};
            const response = await client.getNamespace(request);
            const namespace = response.value;

            const deleteObjectRequest: os.requests.DeleteObjectRequest = {
                namespaceName: namespace,
                bucketName: bucket,
                objectName: foto.ED_URL_FOTO.replace(
                    process.env.NEXT_PUBLIC_URL_STORAGE,
                    ""
                ),
            };
            await client.deleteObject(deleteObjectRequest);
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
