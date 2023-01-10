import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    await prisma.modulo.createMany({
        data: [
            {
                nome: "Contratos",
                codigo: "imobiliaria.contratos",
            },
            {
                nome: "Cobranças",
                codigo: "imobiliaria.cobrancas",
            },
            {
                nome: "Inquilinos",
                codigo: "imobiliaria.inquilinos",
            },
            {
                nome: "Proprietários",
                codigo: "imobiliaria.proprietarios",
            },
            {
                nome: "Usuários",
                codigo: "imobiliaria.usuarios",
            },
            {
                nome: "Chamados",
                codigo: "imobiliaria.chamados",
            },
            {
                nome: "Imoveis",
                codigo: "imobiliaria.imoveis",
            },
            {
                nome: "Configurações",
                codigo: "imobiliaria.configuracoes",
            },
            {
                nome: "Gerencial",
                codigo: "imobiliaria.gerencial",
            },
        ],
    });
    res.send("ok");
});

export default handler;
