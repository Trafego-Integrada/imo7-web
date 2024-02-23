import prisma from "@/lib/prisma";
import nextConnect from "next-connect";

import { cors } from "@/middleware/cors";
import * as AdmZip from "adm-zip";
import axios from "axios";
import path, { parse } from "path";

const handler = nextConnect();
handler.use(cors);

handler.get(async (req, res) => {
    try {
        const { id } = req.query;

        const ficha = await prisma.fichaCadastral.findUnique({
            where: {
                id,
            },
            include: {
                Anexo: true,
            },
        });

        const data = await prisma.fichaCadastralPreenchimento.findMany({
            where: {
                fichaCadastralId: id,
                campo: {
                    tipoCampo: {
                        in: ["file", "files", "image"],
                    },
                },
            },
            include: {
                campo: true,
            },
        });

        let fileUrls = [];

        for await (const item of data) {
            if (
                item.campo.tipoCampo == "files" ||
                item.campo.tipoCampo == "file"
            ) {
                if (
                    item.valor &&
                    Array.isArray(JSON.parse(item.valor)) &&
                    JSON.parse(item.valor).length > 0
                ) {
                    JSON.parse(item.valor).map((i) => i && fileUrls.push(i));
                }
            } else if (item.valor) {
                fileUrls.push(item.valor);
            }
        }
        if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
            return res
                .status(400)
                .json({ error: "Invalid or empty file URLs" });
        }

        const zip = new AdmZip();
        if (ficha) {
            const response = await axios.get(
                `https://www.imo7.com.br/api/fichaCadastral/${ficha.id}/pdf`,
                {
                    responseType: "arraybuffer",
                }
            );

            if (response.status === 200) {
                zip.addFile(
                    `FichaCadastral-${ficha.id}.pdf`,
                    Buffer.from(response.data)
                );
            }
        }
        if (ficha?.Anexo) {
            for await (const anexo of ficha.Anexo) {
                //console.log();

                const response = await axios.get(anexo.anexo, {
                    responseType: "arraybuffer",
                });

                const fileName = path.basename(anexo.anexo);
                //console.log("nome", fileName);
                if (response.status === 200) {
                    zip.addFile(
                        `Arquvos da Ficha ${ficha?.nome}/anexos/${fileName}`,
                        Buffer.from(response.data)
                    );
                }
            }
        }
        for (let i = 0; i < fileUrls.length; i++) {
            try {
                const response = await axios.get(fileUrls[i], {
                    responseType: "arraybuffer",
                });
                const parsedUrl = parse(fileUrls[i]);
                const pathname = parsedUrl.base || "";
                const fileName = path.basename(pathname);
                if (response.status === 200) {
                    zip.addFile(fileName, Buffer.from(response.data));
                }
            } catch (e) {
                //console.log(e.message);
                console.error("Arquivo erro:", fileUrls[i]);
            }
        }

        const zipBuffer = zip.toBuffer();
        res.setHeader("Content-Type", "application/zip");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=arquivos-ficha-cadastral-${ficha?.nome}.zip`
        );
        res.send(zipBuffer);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
function extractFileNameFromUrl(url) {
    return fileName;
}
export default handler;
