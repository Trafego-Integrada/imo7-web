import { NextApiRequest, NextApiResponse } from "next";

import { NextApiRequestWithUser } from "@/types/auth";
import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import { cors } from "@/middleware/cors";

import axios from 'axios';
import prisma from "@/lib/prisma";

//https://github.com/auth0/node-jsonwebtoken
import jwt from "jsonwebtoken";
const jwksClient = require('jwks-rsa');

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(cors);

function getKey(header, callback){
    client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}


handler.get(async (req, res) => {

    const ACCESS_TOKEN      = await getToken();

    const data = await prisma.validacaofacial.findMany(
    { 
            take: 5,
            where: { status: 0 },
            orderBy: {
                updatedAt: 'asc'
            }
    });

    console.log("Registros encontrados  = " + data.length)
 
    if(data.length == 0) {
        res.send({status: 0, msg: "Sem registros"});
        return
    }
        
    data.forEach(async(resData) => {
  
        const id                = resData.id;

        const response          = await getResponse(ACCESS_TOKEN, resData.cpf, resData.pin);
        const responseDecoded   = Buffer.from(response, 'base64').toString('utf8') 

        var client = jwksClient({jwksUri: 'https://d-biodata.estaleiro.serpro.gov.br/api/v1/jwks' });

        let token   = response;
        let options = { algorithms: 'RS512' }

        jwt.verify(token, getKey, options, async (err, decoded) => {

            // failed 
            if(err) { 

                const dataUpdate = await prisma.validacaofacial.update({
                    where: { id: Number(id) },
                    data: {
                        resultado: JSON.stringify(err),
                        status: -1
                    }
                })
                
                return res.send({status: -1, msg: "Try Again"});
            } 

            // success 
            const dataUpdate = await prisma.validacaofacial.update({
                where: { id: Number(id) },
                data: {
                    resultado: JSON.stringify(decoded),
                    status: 1
                }
            })

            // return res.send({status: 1});

        });

    });


    res.send({status: 1, msg: "Finished"});

});

export default handler;


const getToken = async () => { 
    const resToken = await axios.post( 'https://gateway.apiserpro.serpro.gov.br/token',
      new URLSearchParams({
          'grant_type': 'client_credentials'
      }),
      {
          headers: {
          'authorization': 'Basic dTNoS1hUWF8zemZfczlNRExSY0lVUW5TMVlJYTpBSFRPVmR1THB5TThKMjhRcncxN2dHcXlOeFlh'
          }
      }
    );
    return resToken.data.access_token; 
}


const getResponse = async (accessToken: string, cpf: string, pin: string) => { 

    try {

        const response = await axios.get('https://gateway.apiserpro.serpro.gov.br/biovalid/v1/token', {
            params: {
                'cpf': cpf,
                'token': pin
            },
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        // console.log("response")
        // console.log(response)

        return response.data; 
    
    } catch(error) {

        // console.log("error")
        // console.log(error.response.data);

        return error.response.data; 
    }

}