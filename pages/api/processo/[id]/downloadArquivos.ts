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

        const zip = new AdmZip();
        const processo = await prisma.processo.findUnique({
            where: {
                id,
            },
            include: {
                fichas: {
                    include: {
                        Anexo: true,
                    },
                },
                Anexo: true,
            },
        });
        console.log(processo);
        if (processo?.fichas.length) {
            for await (const ficha of processo.fichas) {
                if (ficha?.Anexo) {
                    for await (const anexo of ficha.Anexo) {
                        console.log();

                        const response = await axios.get(anexo.anexo, {
                            responseType: "arraybuffer",
                        });

                        const fileName = path.basename(anexo.anexo);
                        console.log("nome", fileName);
                        if (response.status === 200) {
                            zip.addFile(
                                `Arquvos da Ficha ${ficha?.nome}/anexos/${fileName}`,
                                Buffer.from(response.data)
                            );
                        }
                    }
                }
                const data = await prisma.fichaCadastralPreenchimento.findMany({
                    where: {
                        fichaCadastralId: ficha.id,
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
                        JSON.parse(item.valor).map(
                            (i) => i && fileUrls.push(i)
                        );
                    } else if (item.valor) {
                        fileUrls.push(item.valor);
                    }
                }

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
                        zip.addFile(
                            `Arquvos da Ficha ${ficha?.nome}/${fileName}`,
                            Buffer.from(response.data)
                        );
                    }
                }
            }
        }
        if (processo?.Anexo) {
            for await (const anexo of processo.Anexo) {
                console.log();

                const response = await axios.get(anexo.anexo, {
                    responseType: "arraybuffer",
                });

                const fileName = path.basename(anexo.anexo);
                console.log("nome", fileName);
                if (response.status === 200) {
                    zip.addFile(
                        `anexos/${fileName}`,
                        Buffer.from(response.data)
                    );
                }
            }
        }
        const zipBuffer = zip.toBuffer();
        res.setHeader("Content-Type", "application/zip");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=arquivos-prcesso-${processo?.codigo}.zip`
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
