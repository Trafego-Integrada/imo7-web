import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
    await prisma.cargo.createMany({
        data: [
            {
                nome: "Administrador",
                codigo: "adm",
            },
            {
                nome: "Imobiliária",
                codigo: "imobiliaria",
            },
            {
                nome: "Conta",
                codigo: "conta",
            },
        ],
        skipDuplicates: true,
    });

    await prisma.modulo.createMany({
        data: [
            {
                nome: "Contratos",
                codigo: "imobiliaria.contratos",
            },
            {
                nome: "Cobranças",
                codigo: "imobiliaria.cobrancas",
            },
            {
                nome: "Boletos",
                codigo: "imobiliaria.cobrancas.boletos",
            },
            {
                nome: "Inquilinos",
                codigo: "imobiliaria.inquilinos",
            },
            {
                nome: "Proprietários",
                codigo: "imobiliaria.proprietarios",
            },
            {
                nome: "Fichas",
                codigo: "imobiliaria.fichas",
            },
            {
                nome: "Fichas Excluidas",
                codigo: "imobiliaria.fichas.excluidas",
            },
            {
                nome: "Chamados",
                codigo: "imobiliaria.chamados",
            },
            {
                nome: "Imóveis",
                codigo: "imobiliaria.imoveis",
            },
            {
                nome: "Configurações",
                codigo: "imobiliaria.configuracoes",
            },
            {
                nome: "Tarefas",
                codigo: "imobiliaria.tarefas",
            },
            {
                nome: "Orçamentos",
                codigo: "imobiliaria.orcamentos",
            },
            {
                nome: "Cadastros",
                codigo: "imobiliaria.cadastros",
            },
            {
                nome: "Gerencial",
                codigo: "adm.gerencial",
            },
            {
                nome: "Usuários",
                codigo: "adm.usuarios",
            },
            {
                nome: "Imobiliárias",
                codigo: "adm.imobiliarias",
            },
            {
                nome: "Processos",
                codigo: "imobiliaria.processos",
            },
        ],
        skipDuplicates: true,
    });

    await prisma.permissao.createMany({
        data: [
            {
                nome: "Visualizar",
                codigo: "imobiliaria.processos.visualizar",
                moduloCodigo: "imobiliaria.processos",
            },
            {
                nome: "Cadastrar",
                codigo: "imobiliaria.processos.cadastrar",
                moduloCodigo: "imobiliaria.processos",
            },
            {
                nome: "Editar",
                codigo: "imobiliaria.processos.editar",
                moduloCodigo: "imobiliaria.processos",
            },
            {
                nome: "Excluir",
                codigo: "imobiliaria.processos.excluir",
                moduloCodigo: "imobiliaria.processos",
            },
            {
                nome: "Visualizar Todos",
                codigo: "imobiliaria.processos.visualizarTodos",
                moduloCodigo: "imobiliaria.processos",
            },
        ],
        skipDuplicates: true,
    });

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
