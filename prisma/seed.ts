import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
async function main() {
    await prisma.usuario.create({
        data: {
            nome: "Gabriel Ferreira",
            email: "gabriel@treiv.com.br",
            documento: "11694158659",
            senhaHash: bcrypt.hashSync("123", 10),
            cargos: {
                create: {
                    nome: "adm",
                },
            },
        },
    });

    await prisma.conta.create({
        data: {
            nome: "JB",
            tokens: {
                create: {
                    token: "f66ac8b7e3bd3fff892cfb2cd8a0acf7",
                },
            },
        },
    });

    await prisma.usuario.create({
        data: {
            nome: "Jair",
            email: "jair@jb.com.br",
            documento: "12312312312",
            senhaHash: bcrypt.hashSync("123", 10),
            conta: {
                connect: {
                    id: 1,
                },
            },
            cargos: {
                create: {
                    nome: "conta",
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
