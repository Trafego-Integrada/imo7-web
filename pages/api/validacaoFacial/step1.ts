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
    const ACCESS_TOKEN = await getToken();
    console.log(ACCESS_TOKEN);
    const PIN = await getPin(ACCESS_TOKEN, req.body.cpf);

    console.log("PIN = " + PIN);

    if (req.body["foto"] === undefined || req.body["foto"] == "") {
        res.status(200).send({
            status: 0,
            message: "Falha no envio da foto - 1",
        });
        return;
    }

    console.log("PIN OK");

    await savePhoto(req.body.imobiliariaId, req.body.foto);

    let fotoUrl = await uploadPhoto(req.body.imobiliariaId, req.body.foto);

    console.log("FOTO URL");
    console.log(fotoUrl);

    if (!fotoUrl) {
        return res.status(200).send({
            status: 0,
            message: "Falha no envio da foto - WRITE FAILED ",
        });
    }

    console.log(1);

    const PHOTO = await setPhoto(
        ACCESS_TOKEN,
        PIN,
        req.body.cpf,
        req.body.foto
    );

    console.log("APOS SET PHOTO");
    console.log(PHOTO);

    if (PHOTO != "OK") {
        console.log("PHOTO IS DIFF OK");
    }

    if (PHOTO != "OK") {
        console.log("DIFF OK");
        res.status(200).send({ status: 0, message: PHOTO.mensagem });
        return;
    }

    console.log("PHOTO RESPONSE");
    console.log(PHOTO);
    console.log(2);

    try {
        let data = {
            imobiliariaId: req.body.imobiliariaId,
            cpf: req.body.cpf,
            pin: PIN,
            fotoUrl: fotoUrl,
        };

        const resValidacaoFacial = await prisma.validacaofacial.create({
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
        console.log("catch error");
        console.log(error);

        return res
            .status(200)
            .send({ status: 0, message: "Falha na validação" });
    }
});

const savePhoto = async (imobiliariaId: string, photoBase64: string) => {
    console.log("savePhoto");

    const extension = "jpg";

    //  const folder  = "d:\\";
    const folder = "/tmp/";
    const filepath = folder + new Date().getTime() + "." + extension;

    console.log("filepath = " + filepath);

    let base64Image = photoBase64.split(";base64,").pop();
    console.log(base64Image);
    console.log("writeFile -> start");
    let buff = Buffer.from(base64Image, "base64");
    let result = await fs.writeFileSync(filepath, buff, "base64");

    console.log("Result", result);
    console.log("writeFile -> end");
    console.log("filepath = " + filepath);
};

const uploadPhoto = async (imobiliariaId: string, photoBase64: string) => {
    console.log("uploadPhoto");

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

    console.log("getBucketResponse -> start");

    const getBucketResponse = await client.getBucket(getBucketRequest);

    const extension = "jpg";
    const nameLocation = `imobiliarias/${imobiliariaId}/validacaoFacial/${slug(
        `${moment()}${Math.random() * (999999999 - 100000000) + 100000000}`
    )}.${extension}`;

    //  const folder  = "d:\\";
    const folder = "/tmp/";
    const filepath = folder + new Date().getTime() + "." + extension;

    console.log("filepath = " + filepath);

    // console.log("photoBase64 substring")
    // console.log(photoBase64.substring(0,50))

    let base64Image = photoBase64.split(";base64,").pop();

    // let base64Image = photoBase64;
    // console.log("base64Image substring")
    // console.log(base64Image.substring(0,50))
    // console.log("base64Image")
    // console.log(base64Image)

    console.log("writeFile -> start");

    let buff = Buffer.from(base64Image, "base64");
    let result = await fs.writeFileSync(filepath, buff, {
        encoding: "base64",
    });

    console.log("writeFile -> result");
    console.log(result);

    // console.log("delay 5 seconds")
    // await new Promise(resolve => setTimeout(resolve, 5000));

    const stats = statSync(filepath);
    const nodeFsBlob = new os.NodeFSBlob(filepath, stats.size);
    const objectData = await nodeFsBlob.getData();

    console.log("photoBase64.lenght = " + photoBase64?.length);
    console.log("base64Image.lenght = " + base64Image?.length);
    console.log("stats.size = " + stats.size);
    console.log(stats);
    console.log("objectData.lenght = ", objectData);

    const putObjectRequest: os.requests.PutObjectRequest = {
        namespaceName: namespace,
        bucketName: bucket,
        putObjectBody: buff,
        objectName: nameLocation,
        contentLength: stats.size,
    };

    // console.log("putObjectRequest")
    // console.log(putObjectRequest)

    console.log("putObject -> start");

    const putObjectResponse = await client.putObject(putObjectRequest);

    console.log("putObjectResponse");
    console.log(putObjectResponse);

    const getObjectRequest: os.requests.GetObjectRequest = {
        objectName: nameLocation,
        bucketName: bucket,
        namespaceName: namespace,
    };

    console.log("getObject -> start");

    const getObjectResponse = await client.getObject(getObjectRequest);

    console.log("getObject -> after");

    if (getObjectResponse) {
        console.log("ARQUIVO ONLINE");
        console.log(process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation);
        return process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation;
    } else {
        console.log("getObjectResponse");
        console.log(getObjectResponse);
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
        console.log(data);
        return data.data.access_token;
    } catch (e) {
        console.log("GET PIN CATCH");
        console.log(e);
        return e;
    }
};

const getPin = async (access_token: string, cpf: number) => {
    console.log("Get Pin CPF = " + cpf);

    try {
        const resPin = await axios.post(
            "https://gateway.apiserpro.serpro.gov.br/biovalid/v1/token",
            "",
            {
                params: {
                    cpf: cpf,
                },
                headers: {
                    Authorization: "Bearer " + access_token,
                },
            }
        );

        console.log("res pin");
        console.log(resPin);
        console.log(resPin.data);

        return resPin.data;
    } catch (e) {
        console.log("GET PIN CATCH");
        console.log(e);
        return e;
    }
};

const setPhoto = async (
    access_token: string,
    pin: string,
    cpf: number,
    photoBase64: string
) => {
    console.log("setPhoto");

    photoBase64 = photoBase64.substring("data:image/jpeg;base64,".length);

    /*  SALVAR FOTO LOCALMENTE PARA DEBUG */
    // require("fs").writeFile("out.jpg", photoBase64, 'base64', (err) => {
    //   console.log("Photo To Disk")
    //   console.log(err);
    // });

    /* USAR FOTO LOCAL COM QUALIDADE PARA TESTE */
    // const fs = require('fs').promises;
    // photoBase64 = await fs.readFile('foto.jpeg', {encoding: 'base64'});
    console.log("teste", access_token);
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
                    "x-cpf": cpf,
                    "x-pin": pin,
                    "x-device": "Computador",
                },
            }
        )
        .catch((error) => {
            console.log("error");
            console.log(error.response.data);

            return error.response;
        });

    // console.log("response")
    // console.log(response)
    // console.log("response.data")
    console.log("RESPONSE");
    console.log(response.data);

    return response.data;
};

handler.get(async (req, res) => {
    return res.status(200).send("GET NOT FOUND");
});

export default handler;
