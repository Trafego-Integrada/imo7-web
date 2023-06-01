import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";
handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        const data = await prisma.canalMidia.findMany({
            where: {},
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error,
        });
    }
});

export default handle;
