import { NextApiResponse } from "next";
import { NextApiRequestWithUser } from "@/types/auth";
import nextConnect from "next-connect";
import { cors } from "@/middleware/cors";
import axios from "axios";
import prisma from "@/lib/prisma";

import * as os from "oci-objectstorage";
import slug from "slug";
import moment from "moment";
import fs from "fs";
import { statSync } from "fs";
import { removerCaracteresEspeciais } from "@/helpers/helpers";

import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
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

            return process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation;
        })
        .catch((err) => {
            console.log(err);
        });

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
