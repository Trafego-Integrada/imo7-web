import { NextApiResponse } from "next-auth/internals/utils";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextApiRequest } from "next";
import { Prisma } from "@prisma/client";

const handle = nextConnect<NextApiRequest, NextApiResponse>();

handle.get(async (req, res) => {
    const {imobiliariaId,fiadores, proprietarios, inquilinos} = req.query

    let query:Prisma.UsuarioWhereInput ={}

    if(imobiliariaId){
        query = {
            ...query,
            imobiliariaId:Number(imobiliariaId)
        }
    }
    if(fiadores){
        query = {
            ...query,
            contratosFiador:{
                some:{}
            }
        }
    }
    if(inquilinos){
        query = {
            ...query,
            contratosInquilino:{
                some:{}
            }
        }
    }
    if(proprietarios){
        query = {
            ...query,
            contratosProprietario:{
                some:{}
            }
        }
    }
    const data = await prisma.usuario.findMany({
        where:{
            ...query
        }
    });
    res.send(data);
});

handle.post(async (req, res) => {
    try {
        const {
            nome,
            email,
            documento,
            imobiliariaId,
            senha,
            profissao,
            endereco,
            cidade,
            bairro,
            cep,
            estado,
            celular,
            telefone,
        } = req.body;

        const usuarioExiste = await prisma.usuario.findFirst({
            where: {
                documento,
                imobiliariaId: Number(imobiliariaId),
            },
        });

        if (usuarioExiste) {
            res.send(usuarioExiste);
        } else {
            const data = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    documento,
                    imobiliariaId: Number(imobiliariaId),
                    profissao,
                    endereco,
                    cidade,
                    bairro,
                    cep,
                    estado,
                    celular,
                    telefone,
                    senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
                },
            });

            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
