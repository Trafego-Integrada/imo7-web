import { NextApiResponse } from 'next'

import { NextApiRequestWithUser } from '@/types/auth'

import nextConnect from 'next-connect'
import { cors } from '@/middleware/cors'

import axios from 'axios'
import prisma from '@/lib/prisma'

//https://github.com/auth0/node-jsonwebtoken
import jwt from 'jsonwebtoken'
const jwksClient = require('jwks-rsa')

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>()

handler.use(cors)

handler.get(async (req, res) => {
    const ACCESS_TOKEN = await getToken()

    // const data = await prisma.validacaoFacial.findMany({
    //     take: 5,
    //     where: {
    //         status: 0,
    //         fotoUrl: {
    //             not: null,
    //         },
    //         resultado: null,
    //     },
    //     orderBy: {
    //         updatedAt: 'asc',
    //     },
    // })

    const data = await prisma.validacaoFacialHistorico.findMany({
        where: {
            status: 0,
            resultado: null,
        },
        orderBy: {
            createdAt: 'asc',
        },
    })

    if (data.length == 0) {
        console.log("Cron executado (No records)");
        res.send({ status: 0, msg: 'No records' })
        return
    }

    data.forEach(async (data) => {
        const id = data.id

        const response = await getResponse(
            ACCESS_TOKEN,
            data.cpf,
            data.pin,
        )

        // const responseDecoded = Buffer.from(response, 'base64').toString('utf8')

        var client = jwksClient({
            jwksUri: 'https://d-biodata.estaleiro.serpro.gov.br/api/v1/jwks',
        })

        let token = response
        let options = { algorithms: 'RS512' }

        function getKey(header, callback) {
            client.getSigningKey(header.kid, function (err, key) {
                var signingKey = key.publicKey || key.rsaPublicKey
                callback(null, signingKey)
            })
        }

        try {
            console.log({
                token, 
                getKey, 
                options
            });

            jwt.verify(token, getKey, options, async (err, decoded) => {
                // failed
                if (err) {
                    await prisma.validacaoFacial.update({
                        where: { id: data.validacaoFacialId },
                        data: {
                            resultado: JSON.stringify(err),
                            status: -1,
                        },
                    })

                    await prisma.validacaoFacialHistorico.update({
                        where: { id },
                        data: {
                            resultado: JSON.stringify(err),
                            status: -1,
                        },
                    })

                    return console.log(`JWT VERIFY ON ID ${id}. ERROR: ` + err)
                }

                // success
                await prisma.validacaoFacial.update({
                    where: { id: data.validacaoFacialId },
                    data: {
                        resultado: JSON.stringify(decoded),
                        status: 1,
                    },
                })

                await prisma.validacaoFacialHistorico.update({
                    where: { id },
                    data: {
                        resultado: JSON.stringify(decoded),
                        status: 1,
                    },
                })

                console.log(
                    `The record with ID: ${id} was succefully processed`,
                )
            })
        } catch (e) {
            console.log(e)
        }
    })

    console.log("Cron executado (All records were processed successfully)");
    res.send({ status: 1, msg: 'All records were processed successfully' })
})

export default handler

const getToken = async () => {
    const resToken = await axios.post(
        'https://gateway.apiserpro.serpro.gov.br/token',
        new URLSearchParams({
            grant_type: 'client_credentials',
        }),
        {
            headers: {
                authorization:
                    'Basic dTNoS1hUWF8zemZfczlNRExSY0lVUW5TMVlJYTpBSFRPVmR1THB5TThKMjhRcncxN2dHcXlOeFlh',
            },
        },
    )
    return resToken.data.access_token
}

const getResponse = async (accessToken: string, cpf: string, pin: string) => {
    try {
        const response = await axios.get(
            'https://gateway.apiserpro.serpro.gov.br/biovalid/v1/token',
            {
                params: {
                    cpf: cpf,
                    token: pin,
                },
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                },
            },
        )

        return response.data
    } catch (error) {
        return error.response.data
    }
}
