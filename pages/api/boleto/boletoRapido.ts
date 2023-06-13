import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";
import moment from "moment";
import nextConnect from "next-connect";

const handle = nextConnect();

handle.use(cors);

handle.post(async (req, res) => {
    try {
        let { documento } = req.body;
        let { site } = req.headers;

        const data = await prisma.boleto.findMany({
            where: {
                bols_cpf_cnpj: documento,
                imobiliaria: {
                    codigo: site,
                },
            },
            include: {
                conta: true,
                contrato: {
                    include: {
                        imovel: true,
                        inquilinos: true,
                    },
                },
                imobiliaria: true,
                inquilino: true,
            },
            take: 1,
            orderBy: {
                data_vencimen: "desc",
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;
