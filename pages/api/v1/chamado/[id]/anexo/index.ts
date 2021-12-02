import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs, { createReadStream, statSync } from "fs";
import Auth from "../../../../../../middleware/Auth";
import * as os from "oci-objectstorage";
import { ConfigFileAuthenticationDetailsProvider } from "oci-common";
import st from "stream";

interface NextApiRequestWithUser extends NextApiRequest {
    user: any;
}

const provider: ConfigFileAuthenticationDetailsProvider =
    new ConfigFileAuthenticationDetailsProvider("~/.oci/config", "DEFAULT");

const saveFile = async (file, name) => {
    const data = fs.readFileSync(file.path);
    fs.writeFileSync(`./tmp/${name}`, data);
    await fs.unlinkSync(file.path);
    return;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

function handle(req: NextApiRequestWithUser, res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            upload(req, res);
            break;
        default:
            res.status(500).send("Método inválido");
            break;
    }
}

async function upload(req: NextApiRequestWithUser, res: NextApiResponse) {
    try {
        const client = new os.ObjectStorageClient({
            authenticationDetailsProvider: provider,
        });
        const compartmentId =
            "ocid1.compartment.oc1..aaaaaaaaqi5nahbfq2z6mmcih77dl6isbnaebi4xjq76r47izuscy5muxila";
        const bucket = "imo7-standard-storage";
        const object = "teste/index.ts";
        const fileLocation = "./next.config.js";

        console.log("Carregando namespace...");
        const request: os.requests.GetNamespaceRequest = {};
        const response = await client.getNamespace(request);
        const namespace = response.value;

        console.log("Bucket criado. Lendo bucket.");
        const getBucketRequest: os.requests.GetBucketRequest = {
            namespaceName: namespace,
            bucketName: bucket,
        };
        const getBucketResponse = await client.getBucket(getBucketRequest);
        console.log("Bucket capturado." + getBucketResponse.bucket);

        // Create read stream to file
        const stats = statSync(fileLocation);
        const nodeFsBlob = new os.NodeFSBlob(fileLocation, stats.size);
        const objectData = await nodeFsBlob.getData();

        console.log("Bucket existe. Adicionando imagem ao bucket.");
        const putObjectRequest: os.requests.PutObjectRequest = {
            namespaceName: namespace,
            bucketName: bucket,
            putObjectBody: objectData,
            objectName: object,
            contentLength: stats.size,
        };
        const putObjectResponse = await client.putObject(putObjectRequest);
        console.log("Upload realizado com sucesso" + putObjectResponse);

        console.log("Buscando arquivo");
        const getObjectRequest: os.requests.GetObjectRequest = {
            objectName: object,
            bucketName: bucket,
            namespaceName: namespace,
        };
        const getObjectResponse = await client.getObject(getObjectRequest);

        console.log("Encontrado");

        const isSameStream = compareStreams(
            objectData,
            getObjectResponse.value as st.Readable
        );
        console.log(`Upload e download realizado com sucesso? ${isSameStream}`);

        console.log("Deletar imagem");
        const deleteObjectRequest: os.requests.DeleteObjectRequest = {
            namespaceName: namespace,
            bucketName: bucket,
            objectName: object,
        };
        const deleteObjectResponse = await client.deleteObject(
            deleteObjectRequest
        );
        console.log("Arquivo deletado com sucesso" + deleteObjectResponse);

        console.log("Tentar deletar bucket");
        const deleteBucketRequest: os.requests.DeleteBucketRequest = {
            namespaceName: namespace,
            bucketName: bucket,
        };
        const deleteBucketResponse = await client.deleteBucket(
            deleteBucketRequest
        );
        console.log("Bucket deletado com sucesso" + deleteBucketResponse);

        // [imobiliariaId]/[contratoId]/[chamadoId]/anexos/[ano]/[mes]/[dia]/md5()
    } catch (error) {
        console.log("Error executing example " + error);
    }
}

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

export default Auth(handle);
