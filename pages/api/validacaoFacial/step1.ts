import { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "@/middleware/checkAuth";
import { getUser } from "@/services/database/user";
import { NextApiRequestWithUser } from "@/types/auth";
import nextConnect from "next-connect";
import { cors } from "@/middleware/cors";
import axios from "axios";
import prisma from "@/lib/prisma";

import { providerStorage } from "@/lib/storage";
import { multiparty } from "@/middleware/multipart";
import * as os from "oci-objectstorage";
import slug from "slug";
import moment from "moment";
import fs from "fs";
import { statSync } from "fs";
import { encodeBase64 } from "bcryptjs";
import { removerCaracteresEspeciais } from "@/helpers/helpers";

var FOLDER;

if (process.platform == "linux") FOLDER = "/tmp/";
else FOLDER = "d:\\";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb", // Set desired value here
        },
    },
};

handler.use(cors);
// handler.use(multiparty);

handler.post(async (req, res) => {
    const { id, cpf, foto } = req.body;

    const validacao = await prisma.validacaoFacial.findUnique({
        where: {
            id,
        },
    });

    const ACCESS_TOKEN = await getToken();

    const PIN = await getPin(ACCESS_TOKEN, cpf);

    if (foto === undefined || foto == "") {
        res.status(200).send({
            status: 0,
            message: "Falha no envio da foto - 1",
        });
        return;
    }

    await savePhoto(validacao?.imobiliariaId, foto);

    let fotoUrl = await uploadPhoto(validacao?.imobiliariaId, foto);

    if (!fotoUrl) {
        return res.status(200).send({
            status: 0,
            message: "Falha no envio da foto - WRITE FAILED ",
        });
    }

    const PHOTO = await setPhoto(ACCESS_TOKEN, PIN, validacao.cpf, foto);

    if (PHOTO != "OK") {
        res.status(200).send({ status: 0, message: PHOTO.mensagem });
        return;
    }

    try {
        let data = {
            pin: PIN,
            fotoUrl: fotoUrl,
        };

        const resValidacaoFacial = await prisma.validacaoFacial.update({
            where: {
                id: validacao.id,
            },
            data: data,
        });
        const id = resValidacaoFacial.id;

        if (id) {
            return res
                .status(200)
                .send({ status: 1, message: "Validação enviada com sucesso." });
        }

        return res
            .status(200)
            .send({ status: 0, message: "Falha no banco de dados." });
    } catch (error) {
        return res
            .status(200)
            .send({ status: 0, message: "Falha na validação" });
    }
});

const savePhoto = async (imobiliariaId: string, photoBase64: string) => {
    const extension = "jpg";

    const filepath = FOLDER + new Date().getTime() + "." + extension;

    let base64Image = photoBase64.split(";base64,").pop();

    let buff = Buffer.from(base64Image, "base64");
    let result = await fs.writeFileSync(filepath, buff, "base64");
};

const uploadPhoto = async (imobiliariaId: string, photoBase64: string) => {
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

    const extension = "jpg";
    const nameLocation = `imobiliarias/${imobiliariaId}/validacaoFacial/${slug(
        `${moment()}${Math.random() * (999999999 - 100000000) + 100000000}`
    )}.${extension}`;

    const filepath = FOLDER + new Date().getTime() + "." + extension;

    let base64Image = photoBase64.split(";base64,").pop();

    let buff = Buffer.from(base64Image, "base64");
    let result = await fs.writeFileSync(filepath, buff, {
        encoding: "base64",
    });

    const stats = statSync(filepath);
    const nodeFsBlob = new os.NodeFSBlob(filepath, stats.size);
    const objectData = await nodeFsBlob.getData();

    const putObjectRequest: os.requests.PutObjectRequest = {
        namespaceName: namespace,
        bucketName: bucket,
        putObjectBody: buff,
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
        return process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation;
    } else {
    }

    return "";
};

const getToken = async () => {
    try {
        const buffer = Buffer.from(
            "u3hKXTX_3zf_s9MDLRcIUQnS1YIa:AHTOVduLpyM8J28Qrw17gGqyNxYa",
            "utf-8"
        );

        const data = await axios.post(
            "https://gateway.apiserpro.serpro.gov.br/token",
            "grant_type=client_credentials",
            {
                headers: {
                    Authorization: "Basic " + buffer.toString("base64"),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return data.data.access_token;
    } catch (e) {
        return e;
    }
};

const getPin = async (access_token: string, cpf: number) => {
    try {
        const resPin = await axios.post(
            "https://gateway.apiserpro.serpro.gov.br/biovalid/v1/token",
            "",
            {
                params: {
                    cpf: removerCaracteresEspeciais(cpf),
                },
                headers: {
                    Authorization: "Bearer " + access_token,
                },
            }
        );

        return resPin.data;
    } catch (e) {
        return e;
    }
};

const setPhoto = async (
    access_token: string,
    pin: string,
    cpf: number,
    photoBase64: string
) => {
    photoBase64 = photoBase64.substring("data:image/jpeg;base64,".length);

    const response = await axios
        .put(
            "https://gateway.apiserpro.serpro.gov.br/biovalid/v1/liveness",
            {
                selfie: photoBase64,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + access_token,
                    "x-cpf": removerCaracteresEspeciais(cpf),
                    "x-pin": pin,
                    "x-device": "Computador",
                },
            }
        )
        .catch((error) => {
            return error.response;
        });

    return response.data;
};

handler.get(async (req, res) => {
    return res.status(200).send("GET NOT FOUND");
});

export default handler;
