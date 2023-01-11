import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
import { statSync } from "fs";
export const config = {
    api: {
        bodyParser: false,
    },
};
import { checkAuth } from "@/middleware/checkAuth";
import { multiparty } from "@/middleware/multipart";
import * as os from "oci-objectstorage";
import { providerStorage } from "@/lib/storage";
import slug from "slug";
handle.use(cors);
handle.use(checkAuth);
handle.use(multiparty);
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
    } = req.body;
    const { logo, bg } = req.files;
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
        },
    });

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

    if (logo) {
        const extension = logo.name.slice(
            (Math.max(0, logo.name.lastIndexOf(".")) || Infinity) + 1
        );
        const nameLocation = `logos/${slug(
            `${moment()}${Math.random() * (999999999 - 100000000) + 100000000}`
        )}.${extension}`;
        // Create read stream to file
        const stats = statSync(logo.path);
        const nodeFsBlob = new os.NodeFSBlob(logo.path, stats.size);
        const objectData = await nodeFsBlob.getData();

        const putObjectRequest: os.requests.PutObjectRequest = {
            namespaceName: namespace,
            bucketName: bucket,
            putObjectBody: objectData,
            objectName: nameLocation,
            contentLength: stats.size,
        };
        const putObjectResponse = await client.putObject(putObjectRequest);

        const getObjectRequest: os.requests.GetObjectRequest = {
            objectName: nameLocation,
            bucketName: bucket,
            namespaceName: namespace,
        };
        const getObjectResponse = await client.getObject(getObjectRequest);

        if (getObjectResponse) {
            const anexo = await prisma.imobiliaria.update({
                where: {
                    id: Number(id),
                },
                data: {
                    logo: process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation,
                },
            });
        }
    }
    if (bg) {
        const extension = bg.name.slice(
            (Math.max(0, bg.name.lastIndexOf(".")) || Infinity) + 1
        );
        const nameLocation = `bgs/${slug(
            `${moment()}${Math.random() * (999999999 - 100000000) + 100000000}`
        )}.${extension}`;
        // Create read stream to file
        const stats = statSync(bg.path);
        const nodeFsBlob = new os.NodeFSBlob(bg.path, stats.size);
        const objectData = await nodeFsBlob.getData();

        const putObjectRequest: os.requests.PutObjectRequest = {
            namespaceName: namespace,
            bucketName: bucket,
            putObjectBody: objectData,
            objectName: nameLocation,
            contentLength: stats.size,
        };
        const putObjectResponse = await client.putObject(putObjectRequest);

        const getObjectRequest: os.requests.GetObjectRequest = {
            objectName: nameLocation,
            bucketName: bucket,
            namespaceName: namespace,
        };
        const getObjectResponse = await client.getObject(getObjectRequest);

        if (getObjectResponse) {
            const anexo = await prisma.imobiliaria.update({
                where: {
                    id: Number(id),
                },
                data: {
                    bg: process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation,
                },
            });
        }
    }

    res.send(imobiliaria);
});

export default handle;
