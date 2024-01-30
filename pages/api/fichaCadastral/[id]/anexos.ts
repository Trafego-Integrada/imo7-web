import nextConnect from 'next-connect'
import prisma from '@/lib/prisma'
import { cors } from '@/middleware/cors'
import { multiparty } from '@/middleware/multipart'
import moment from 'moment'
import slug from 'slug'
import fs from 'fs'

import { Upload } from '@aws-sdk/lib-storage'
import { S3Client } from '@aws-sdk/client-s3'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nextConnect()
handler.use(cors)
handler.use(multiparty)
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query

        await Promise.all(
            Object.entries(req.files).map(async (i: any) => {
                const extension = i[1].name.slice(
                    (Math.max(0, i[1].name.lastIndexOf('.')) || Infinity) + 1,
                )
                const nameLocation = `fichaCadastral/${id}/anexos/${slug(
                    `${i[0]}-${moment()}${
                        Math.random() * (999999999 - 100000000) + 100000000
                    }`,
                )}.${extension}`
                // Create read stream to file
                const imageData = fs.readFileSync(i[1].path)
                console.log(imageData)
                const base64Data = imageData.toString('base64')
                const buff = Buffer.from(base64Data, 'base64')

                new Upload({
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
                    .then(async () => {
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
                                                    campoFichaCadastralCodigo:
                                                        i[0],
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
                        })
                    })
                    .catch(() => {
                        return res.status(400).send({
                            message: `Não conseguimos salvar o arquivo ${i[0]}, verifique o arquivo. Caso persista, contate o suporte.`,
                        })
                    })
            }),
        )

        return res.status(201).send({})
    } catch (error: any) {
        return res.status(error?.status || 400).send({
            success: false,
            message: error.message,
        })
    }
})
export const config = {
    api: {
        bodyParser: false,
    },
}
export default handler
