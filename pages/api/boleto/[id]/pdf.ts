import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import puppeteer from "puppeteer";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    console.log(req);
    const { id } = req.query;

    const boleto = await prisma.boleto.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            imobiliaria: true,
        },
    });
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
        "https://" + boleto?.imobiliaria.url + ".imo7.com.br/boleto" + id,
        {
            waitUntil: "networkidle0",
        }
    );
    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdf.length);
    res.send(pdf);
});

export default handler;
