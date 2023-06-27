import { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "@/middleware/checkAuth";
import { getUser } from "@/services/database/user";
import { NextApiRequestWithUser } from "@/types/auth";
import nextConnect from "next-connect";
import { cors } from "@/middleware/cors";
import axios from 'axios';
import prisma from "@/lib/prisma";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handler.use(cors);

handler.post(async (req, res) => { 

  const ACCESS_TOKEN = await getToken();

  const PIN = await getPin(ACCESS_TOKEN, req.body.cpf);

  if(req.body["foto"] === undefined || req.body["foto"] == "") {
    return res.status(200).send({status: 0, message: "Falha no envio da foto"});
  }
  
  const PHOTO = await setPhoto(ACCESS_TOKEN, PIN, req.body.cpf, req.body.foto);

  if(PHOTO != "OK") {
     return res.status(200).send({status: 0, message: PHOTO.mensagem});
  }

  try { 

    let data = {
      imobiliariaId:  req.body.imobiliariaId,
      cpf:            req.body.cpf,
      pin:            PIN,
    }

    const resValidacaoFacial = await prisma.validacaofacial.create({data: data});
    const id = resValidacaoFacial.id;

    if(id) {
      return res.status(200).send({status: 1, message: "Validação enviada com sucesso."});
    }

    return res.status(200).send({status: 0, message: "Falha no banco de dados."});

  } catch(error) {

    console.log("catch error")
    console.log(error)

  }
  
  return res.status(200).send({status: 0, message: "Falha na validação"});

});


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

const getPin = async (access_token: string, cpf: number)  => {
  console.log("Get Pin CPF = " + cpf);
  const resPin = await axios.post(
    'https://gateway.apiserpro.serpro.gov.br/biovalid/v1/token',
    '',
    {
      params: {
        'cpf': cpf
      },
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }
  );
  return resPin.data;
}

const setPhoto = async (access_token: string, pin: string, cpf: number, photoBase64: string) => {

  photoBase64 = photoBase64.substring("data:image/jpeg;base64,".length);

  /*  SALVAR FOTO LOCALMENTE PARA DEBUG */

  // require("fs").writeFile("out.png", photoBase64, 'base64', (err) => {
  //   console.log("Photo To Disk")
  //   console.log(err);
  // });

  /* USAR FOTO LOCAL COM QUALIDADE PARA TESTE */ 

  const fs = require('fs').promises;
  photoBase64 = await fs.readFile('foto.jpeg', {encoding: 'base64'});

  const response = await axios.put(
    'https://gateway.apiserpro.serpro.gov.br/biovalid/v1/liveness',
    {
      'selfie': photoBase64
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token,
        'x-cpf': cpf,
        'x-pin': pin,
        'x-device': 'Computador'
      }
    }
  ).catch( (error) => {
    return error.response.data
  });
  return response.data; 
}

handler.get(async (req, res) => {
    return res.status(200).send("GET NOT FOUND");
});

export default handler;
