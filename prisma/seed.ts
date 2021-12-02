import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
async function main() {
    await prisma.usuario.upsert({
        where: { email: "gabriel@treiv.com.br" },
        update: {},
        create: {
            nome: "Gabriel Ferreira",
            email: "gabriel@treiv.com.br",
            documento: "11694158659",
            senhaHash: bcrypt.hashSync("123", 10),
            cargos: {
                create: {
                    nome: "Admin",
                },
            },
            permissoes: {
                create: [
                    {
                        nome: "admin.imobiliaria",
                    },
                    {
                        nome: "admin.imobiliaria.cadastrar",
                    },
                    {
                        nome: "admin.imobiliaria.editar",
                    },
                    {
                        nome: "admin.imobiliaria.excluir",
                    },
                    {
                        nome: "admin.imobiliaria.boleto",
                    },
                    {
                        nome: "admin.imobiliaria.boleto.excluir",
                    },
                    {
                        nome: "admin.imobiliaria.inquilino",
                    },
                    {
                        nome: "admin.imobiliaria.inquilino.excluir",
                    },
                    {
                        nome: "admin.imobiliaria.proprietario",
                    },
                    {
                        nome: "admin.imobiliaria.proprietario.excluir",
                    },
                    {
                        nome: "admin.imobiliaria.usuario",
                    },
                    {
                        nome: "admin.imobiliaria.usuario.criar",
                    },
                    {
                        nome: "admin.imobiliaria.usuario.editar",
                    },
                    {
                        nome: "admin.imobiliaria.usuario.excluir",
                    },
                    {
                        nome: "admin.imobiliaria.extrato",
                    },
                    {
                        nome: "admin.imobiliaria.extrato.excluir",
                    },
                    {
                        nome: "admin.conta",
                    },
                    {
                        nome: "admin.conta.criar",
                    },
                    {
                        nome: "admin.conta.editar",
                    },
                    {
                        nome: "admin.conta.excluir",
                    },
                    {
                        nome: "admin.usuario",
                    },
                    {
                        nome: "admin.usuario.criar",
                    },
                    {
                        nome: "admin.usuario.editar",
                    },
                    {
                        nome: "admin.usuario.excluir",
                    },
                ],
            },
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
