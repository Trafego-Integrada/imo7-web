import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    await prisma.permissao.createMany({
        data: [
            {
                nome: "Visualizar Documentos",
                codigo: "imobiliaria.contratos.visualizarDocumentos",
                moduloCodigo: "imobiliaria.contratos",
            },
            {
                nome: "Visualizar Cobranças",
                codigo: "imobiliaria.contratos.visualizarCobrancas",
                moduloCodigo: "imobiliaria.contratos",
            },
            {
                nome: "Visualizar Fiadores",
                codigo: "imobiliaria.contratos.visualizarFiadores",
                moduloCodigo: "imobiliaria.contratos",
            },
            {
                nome: "Visualizar Proprietários",
                codigo: "imobiliaria.contratos.visualizarProprietarios",
                moduloCodigo: "imobiliaria.contratos",
            },
            {
                nome: "Visualizar Inquilinos",
                codigo: "imobiliaria.contratos.visualizarInquilinos",
                moduloCodigo: "imobiliaria.contratos",
            },
            {
                nome: "Chamados",
                codigo: "imobiliaria.contratos.visualizarChamados",
                moduloCodigo: "imobiliaria.contratos",
            },
            {
                nome: "Extratos",
                codigo: "imobiliaria.contratos.visualizarExtratos",
                moduloCodigo: "imobiliaria.contratos",
            },
        ],
    });
    res.send("ok");
});

export default handler;
