import prisma from '@/lib/prisma'
import { cors } from '@/middleware/cors'
import { NextApiRequestWithUser } from '@/types/auth'
import axios from 'axios'
import { NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import { removerCaracteresEspeciais } from '@/helpers/helpers'
import fs, { statSync } from 'fs'
import moment from 'moment'
import * as os from 'oci-objectstorage'
import slug from 'slug'

import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
var FOLDER

if (process.platform == 'linux') FOLDER = '/tmp/'
else FOLDER = 'd:\\'

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>()

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Set desired value here
        },
    },
}

handler.use(cors)
// handler.use(multiparty);

handler.post(async (req, res) => {
    const { id, cpf, foto } = req.body

    const validacao = await prisma.validacaoFacial.findUnique({
        where: {
            id,
        },
    })

    const ACCESS_TOKEN = await getToken()
    console.log('VALIDAÇÃO FACIAL::LINHA 46: ', ACCESS_TOKEN)

    const PIN = await getPin(ACCESS_TOKEN, cpf)

    if (foto === undefined || foto == '') {
        return res.status(400).send({
            status: 0,
            message: 'Falha no envio da foto - 1',
        })
    }

    await savePhoto(validacao?.imobiliariaId!, foto)

    let fotoUrl = await uploadPhoto(validacao?.imobiliariaId, foto)
    //console.log(fotoUrl);
    if (!fotoUrl) {
        return res.status(400).send({
            status: 0,
            message: 'Falha no envio da foto - WRITE FAILED ',
        })
    }

    const PHOTO: any = await setPhoto(ACCESS_TOKEN, PIN, validacao?.cpf!, foto)

    console.log('VALICAÇÃO FACIA :: LINHA 70: ', PHOTO)

    if (!PHOTO) {
        return res.status(400).send({ status: 0, message: PHOTO.mensagem })
    }

    try {
        let data = {
            pin: PIN,
            fotoUrl: fotoUrl,
        }

        const resValidacaoFacial = await prisma.validacaoFacial.update({
            where: {
                id: validacao?.id,
            },
            data: data,
        })
        const id = resValidacaoFacial.id

        if (id) {
            return res
                .status(201)
                .send({ status: 1, message: 'Validação enviada com sucesso.' })
        }

        return res
            .status(400)
            .send({ status: 0, message: 'Falha no banco de dados.' })
    } catch (error: any) {
        return res.status(400).send({
            status: 0,
            message: error?.message || 'ocorreu um erro inesperado!',
        })
    }
})

const savePhoto = async (imobiliariaId: number, photoBase64: any) => {
    const extension = 'jpg'

    const path = FOLDER + new Date().getTime() + '.' + extension

    let base64Image = photoBase64.split(';base64,').pop()

    let buff = Buffer.from(base64Image, 'base64')
    let result = fs.writeFileSync(path, buff, 'base64')
}

const uploadPhoto = async (imobiliariaId: number, photoBase64: any) => {
    const extension = 'jpg'
    //const nameLocation = randomBytes(16).toString("hex");
    const nameLocation = `imobiliarias/${imobiliariaId}/validacaoFacial/${slug(
        `${moment()}${Math.random() * (999999999 - 100000000) + 100000000}`,
    )}.${extension}`

    const path = FOLDER + new Date().getTime() + '.' + extension

    let base64Image = photoBase64.split(';base64,').pop()

    let buff = Buffer.from(base64Image!, 'base64')
    let result = fs.writeFileSync(path, buff, {
        encoding: 'base64',
    })

    const stats = statSync(path)
    const nodeFsBlob = new os.NodeFSBlob(path, stats.size)
    const objectData = await nodeFsBlob.getData()

    const url = new Upload({
        client: new S3Client({
            credentials: {
                accessKeyId: process.env.STORAGE_KEY!,
                secretAccessKey: process.env.STORAGE_SECRET!,
            },
            region: process.env.STORAGE_REGION,
            endpoint: process.env.STORAGE_ENDPOINT,
            tls: false,
            forcePathStyle: true,
        }),
        params: {
            ACL: 'public-read',
            Bucket: process.env.STORAGE_BUCKET,
            Key: nameLocation,
            Body: buff,
        },
    })
        .done()
        .then(async (data) => {
            //console.log(data);
            // if (getObjectResponse.contentLength == 0) {
            //     return res.status(400).send({
            //         message: `O arquivo ${i[0]} está corrompido ou sem conteúdo. Caso persista, contate o suporte.`,
            //     });
            // }

            return process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation
        })
        .catch((err) => {
            //console.log(err);
        })

    return url
}

const getToken = async () => {
    try {
        const buffer = Buffer.from(
            'u3hKXTX_3zf_s9MDLRcIUQnS1YIa:AHTOVduLpyM8J28Qrw17gGqyNxYa',
            'utf-8',
        )

        const data = await axios.post(
            'https://gateway.apiserpro.serpro.gov.br/token',
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: 'Basic ' + buffer.toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        )
        return data.data.access_token
    } catch (e: any) {
        console.log('VALIDAÇÃO FACIAL::LINHA191: ', e?.message || e)
        return e
    }
}

const getPin = async (access_token: string, cpf: string) => {
    try {
        const resPin = await axios.post(
            'https://gateway.apiserpro.serpro.gov.br/biovalid/v1/token',
            '',
            {
                params: {
                    cpf: removerCaracteresEspeciais(cpf),
                },
                headers: {
                    Authorization: 'Bearer ' + access_token,
                },
            },
        )
        console.log('VALIDAÇÃO FACIAL::LINHA 210: ', resPin.data)
        return resPin.data
    } catch (e: any) {
        console.log('VALIDAÇÃO FACIAL::LINHA 213: ', e?.message || e)
        return e
    }
}

const setPhoto = async (
    access_token: string,
    pin: string,
    cpf: string,
    photoBase64: string,
) => {
    photoBase64 = photoBase64.substring('data:image/jpeg;base64,'.length)

    console.log({ access_token })
    console.log({ pin })
    console.log({ cpf })
    console.log({ photoBase64 })

    const response = await axios
        .put(
            'https://gateway.apiserpro.serpro.gov.br/biovalid/v1/liveness',
            {
                selfie: photoBase64,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + access_token,
                    'x-cpf': removerCaracteresEspeciais(cpf),
                    'x-pin': pin,
                    'x-device': 'Computador',
                },
            },
        )
        .catch((error) => {
            console.log(
                'VALIDAÇÃO FACIAL:: LINHA 249: ',
                error?.message || error,
            )
            return error.response
        })

    console.log('VALIDAÇÃO FACIAL:: LINHA 255: ', response.data)

    return response.data
}

handler.get(async (req, res) => {
    return res.status(404).send('GET NOT FOUND')
})

export default handler
