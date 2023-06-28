import { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "@/middleware/checkAuth";
import { getUser } from "@/services/database/user";
import { NextApiRequestWithUser } from "@/types/auth";
import nextConnect from "next-connect";
import { cors } from "@/middleware/cors";
import axios from 'axios';
import prisma from "@/lib/prisma";

import { providerStorage } from "@/lib/storage";
import { multiparty } from "@/middleware/multipart";
import * as os from "oci-objectstorage";
import slug from "slug";
import moment from "moment";
import fs from 'fs';
import { statSync } from "fs";
const fsp = require("fs").promises;

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>();

// export const config = {
//   api: {
//       bodyParser: false,
//   },
// };

handler.use(cors);
// handler.use(multiparty);

handler.post(async (req, res) => { 

  // console.log("req")
  // console.log(req);
  // console.log("req.body")
  // console.log(req.body);
  // console.log("req.query")
  // console.log(req.query)

  const ACCESS_TOKEN = await getToken();

  const PIN = await getPin(ACCESS_TOKEN, req.body.cpf);

  if(req.body["foto"] === undefined || req.body["foto"] == "") {
     res.status(200).send({status: 0, message: "Falha no envio da foto - 1"});
     return;
  }
  
  console.log(1);

  const PHOTO = await setPhoto(ACCESS_TOKEN, PIN, req.body.cpf, req.body.foto);

  console.log("APOS SET PHOTO")
  console.log(PHOTO)

  if(PHOTO != "OK") {
    console.log("PHOTO IS DIFF OK")
  }

  if(PHOTO != "OK") {
     console.log("DIFF OK")
     res.status(200).send({status: 0, message: PHOTO.mensagem});
     return;
  }

  console.log("PHOTO RESPONSE")
  console.log(PHOTO)
  console.log(2);

  try { 

    const fotoUrl =   await uploadPhoto(req.body.imobiliariaId, req.body.foto);
    
    console.log("FOTO URL")
    console.log(fotoUrl)

    if(!fotoUrl) {
      return res.status(200).send({status: 0, message: "Falha no envio da foto - 2"});
    }

    let data = {
      imobiliariaId:  req.body.imobiliariaId,
      cpf:            req.body.cpf,
      pin:            PIN,
      fotoUrl:        fotoUrl
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

const uploadPhoto = async (imobiliariaId: string, photoBase64: string) => { 

  const client = new os.ObjectStorageClient({authenticationDetailsProvider: providerStorage});
  const bucket = "imo7-standard-storage";

  const request: os.requests.GetNamespaceRequest = {};
  const response = await client.getNamespace(request);

  const namespace = response.value;

  const getBucketRequest: os.requests.GetBucketRequest = { namespaceName: namespace, bucketName: bucket };

  const getBucketResponse = await client.getBucket(getBucketRequest);

  const extension     = "jpg";
  const nameLocation  = `imobiliarias/${imobiliariaId}/validacaoFacial/${slug(`${moment()}${Math.random() * (999999999 - 100000000) + 100000000}`)}.${extension}`;

  // const folder  = "d:\\";
  const folder  = "/tmp/";
  const filepath = folder + new Date().getTime() + "." + extension

  let base64Image = photoBase64.split(';base64,').pop();


    let result = await fsp.writeFile(filepath, base64Image, {encoding: 'base64'});

      const stats     = statSync(filepath);
      const nodeFsBlob = new os.NodeFSBlob(filepath, stats.size);
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
        console.log("ARQUIVO ONLINE")
        console.log(process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation)

        return process.env.NEXT_PUBLIC_URL_STORAGE + nameLocation;
      }
      return ""
}

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

    console.log("error")
    console.log(error.response.data)

    return error.response;
  });

  // console.log("response")
  // console.log(response)
  // console.log("response.data")
  console.log("RESPONSE")
  console.log(response.data)

  return response.data; 
}

handler.get(async (req, res) => {
    return res.status(200).send("GET NOT FOUND");
});



const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

function convertBase64ToBlob(base64Image: string) {
  // Split into two parts
  const parts = base64Image.split(';base64,');

  // Hold the content type
  const imageType = parts[0].split(':')[1];

  // Decode Base64 string
  const decodedData = atob(parts[1]);

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType });
}

export default handler;
