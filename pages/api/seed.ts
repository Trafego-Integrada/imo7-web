import prisma from "@/lib/prisma";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    const boletos = await prisma.boleto.findMany({});

    await Promise.all(
        boletos.map(async (boleto) => {
            await prisma.boleto.update({
                where: {
                    id: boleto.id,
                },
                data: {
                    data_vencimen: moment(
                        boleto.data_vencimen,
                        "DD/MM/YYYY"
                    ).format(),
                    data_doc: moment(boleto.data_doc, "DD/MM/YYYY").format(),
                    data_proces: moment(
                        boleto.data_proces,
                        "DD/MM/YYYY"
                    ).format(),
                },
            });
        })
    );
    res.send();
});

export default handler;
