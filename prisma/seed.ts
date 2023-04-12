import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
async function main() {
    
    await prisma.cargo.createMany({
        data: [
            {
                nome: "adm",
                codigo:"adm"
            },
            {
                nome: "imobiliaria",
                codigo:"imobiliaria"
            },
        ],
        skipDuplicates:true
    });

    await prisma.modulo.createMany({
        data:[
            {
                nome:'Administrador',
                codigo:'imobiliaria.contratos',
            },
            {
                nome:'Administrador',
                codigo:'imobiliaria.cobrancas',
            },
            {
                nome:'Administrador',
                codigo:'imobiliaria.cobrancas.boletos',
            },
            {
                nome:'Administrador',
                codigo:'imobiliaria.inquilinos',
            },
            {
                nome:'Administrador',
                codigo:'imobiliaria.proprietarios',
            },
            {
                nome:'Administrador',
                codigo:'imobiliaria.fichas',
            },
            {
                nome:'Administrador',
                codigo:'imobiliaria.fichas.excluidas',
            },
            {
                nome:'Administrador',
                codigo:'imobiliaria.chamados',
            },
            {
                nome:'Administrador',
                codigo:'imobiliaria.imoveis',
            },
            {
                nome:'Administrador',
                codigo:'imobiliaria.configuracoes',
            },
            {
                nome:'Administrador',
                codigo:'adm.gerencial',
            },
            {
                nome:'Administrador',
                codigo:'adm.usuarios',
            },
            {
                nome:'Administrador',
                codigo:'adm.imobiliarias',
            },
        ],
        skipDuplicates:true
    })

    // await prisma.usuario.create({
    //     data: {
    //         nome: "Gabriel Ferreira",
    //         email: "gabriel@treiv.com.br",
    //         documento: "11694158659",
    //         senhaHash: bcrypt.hashSync("123", 10),
    //         cargos: {
    //             create: {
    //                 nome: "adm",
    //             },
    //         },
    //     },
    // });

    // await prisma.conta.create({
    //     data: {
    //         nome: "JB",
    //         tokens: {
    //             create: {
    //                 token: "f66ac8b7e3bd3fff892cfb2cd8a0acf7",
    //             },
    //         },
    //     },
    // });

    // await prisma.usuario.create({
    //     data: {
    //         nome: "Jair",
    //         email: "jair@jb.com.br",
    //         documento: "12312312312",
    //         senhaHash: bcrypt.hashSync("123", 10),
    //         conta: {
    //             connect: {
    //                 id: 1,
    //             },
    //         },
    //         cargos: {
    //             create: {
    //                 nome: "conta",
    //             },
    //         },
    //     },
    // });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
