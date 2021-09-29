import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
async function main() {
    const inquilino = await prisma.usuario.upsert({
        where: { email: "gabriel@treiv.com.br" },
        update: {},
        create: {
            nome: "Gabriel Ferreira",
            email: "gabriel@treiv.com.br",
            documento: "11694158659",
            senhaHash: bcrypt.hashSync("123", 10),
        },
    });

    await prisma.conta.upsert({
        where: { id: 1 },
        update: {},
        create: {
            nome: "JB",
            tokens: {
                create: {
                    token: "f66ac8b7e3bd3fff892cfb2cd8a0acf7",
                },
            },
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
