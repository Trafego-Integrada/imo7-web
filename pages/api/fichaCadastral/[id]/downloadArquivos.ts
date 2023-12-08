import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

import { cors } from "@/middleware/cors";
import axios from "axios";
import * as AdmZip from "adm-zip";
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
            if (item.campo.tipoCampo == "files") {
                JSON.parse(item.valor).map((i) => i && fileUrls.push(i));
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

        for (let i = 0; i < fileUrls.length; i++) {
            const response = await axios.get(fileUrls[i], {
                responseType: "arraybuffer",
            });
            console.log(response.status, i);
            const parsedUrl = parse(fileUrls[i]);
            console.log(parsedUrl);
            const pathname = parsedUrl.base || "";
            const fileName = path.basename(pathname);
            console.log("nome", fileName);
            if (response.status === 200) {
                zip.addFile(fileName, Buffer.from(response.data));
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
