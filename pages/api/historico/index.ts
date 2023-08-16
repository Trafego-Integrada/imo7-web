import nextConnect from "next-connect";

import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();

handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    const { tabela, tabelaId } = req.query;
    const data = await prisma.historico.findMany({
        where: {
            tabela,
            tabelaId,
        },
        orderBy: {
            createAt: "asc",
        },
        include: {
            usuario: true,
        },
    });
    res.send(data);
});

export default handle;
