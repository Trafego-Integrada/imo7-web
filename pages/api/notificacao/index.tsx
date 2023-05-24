import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
