import prisma from "@/lib/prisma";
import { GetUserProps } from "@/types/user";

export async function getUsers() {
    const users = await prisma.usuario.findMany();
    return users;
}

export async function getUser({ documento, imobiliaria }: GetUserProps) {
    const user = await prisma.usuario.findFirst({
        where: {
            OR: [
                {
                    documento,
                },
                {
                    email: documento,
                },
            ],
            imobiliaria:
                imobiliaria != "null"
                    ? {
                          url: imobiliaria,
                      }
                    : {},
        },
        include: {
            permissoes: {
                select: {
                    codigo: true,
                },
            },
            cargos: {
                select: {
                    codigo: true,
                },
            },
            tokens: true,
            conta: true,
            imobiliaria: true,
            modulos: {
                select: {
                    codigo: true,
                },
            },
        },
    });
    if (!user) return null;
    let arrPermissoes: string[] = [];
    await user?.permissoes.map((permissao) => {
        arrPermissoes.push(permissao.codigo);
    });
    let arrCargos: string[] = [];
    await user?.cargos.map((cargo) => {
        arrCargos.push(cargo.codigo);
    });
    let arrModulos: string[] = [];
    await user?.modulos.map((cargo) => {
        arrModulos.push(cargo.codigo);
    });
    return {
        ...user,
        permissoes: arrPermissoes,
        cargos: arrCargos,
        modulos: arrModulos,
    };
}
