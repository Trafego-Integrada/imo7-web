import prisma from "../../lib/prisma";
import { GetUserProps } from "../../types/user";

export async function getUsers() {
    const users = await prisma.usuario.findMany();
    return users;
}

export async function getUser({ documento }: GetUserProps) {
    const user = await prisma.usuario.findUnique({
        where: { documento },
        include: {
            permissoes: {
                select: {
                    nome: true,
                },
            },
            cargos: {
                select: {
                    nome: true,
                },
            },
            tokens: true,
            conta: true,
            imobiliaria: true,
        },
    });
    if (!user) return null;
    let arrPermissoes: string[] = [];
    await user?.permissoes.map((permissao) => {
        arrPermissoes.push(permissao.nome);
    });
    let arrCargos: string[] = [];
    await user?.cargos.map((cargo) => {
        arrCargos.push(cargo.nome);
    });
    return {
        ...user,
        permissoes: arrPermissoes,
        cargos: arrCargos,
    };
}
