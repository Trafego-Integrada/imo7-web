import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import puppeteer from "puppeteer";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    const { id } = req.query;

    const data = await prisma.consultaNetrin.findUnique({
        where: {
            id,
        },
        include: {
            imobiliaria: true,
        },
    });
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
        process.env.NODE_ENV == "production"
            ? "https://" +
                  data?.imobiliaria.url +
                  ".imo7.com.br/consultas/" +
                  id +
                  "/pdf"
            : "http://" +
                  data?.imobiliaria.url +
                  ".localhost:3000/consultas/" +
                  id +
                  "/pdf",
        {
            waitUntil: "networkidle0",
        }
    );
    await page.emulateMediaType("screen");
    const pdf = await page.pdf({
        format: "A4",
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdf.length);
    res.send(pdf);
});

export default handler;
