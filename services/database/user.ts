import prisma from "../../lib/prisma";
import { GetUserProps } from "../../types/user";

export async function getUsers() {
    const users = await prisma.user.findMany();
    return users;
}

export async function getUser({ document }: GetUserProps) {
    const user = await prisma.user.findUnique({
        where: { document },
        include: {
            permissions: {
                select: {
                    name: true,
                },
            },
            roles: {
                select: {
                    name: true,
                },
            },
            tokens: true,
        },
    });
    if (!user) return null;
    let arrPermissions: string[] = [];
    await user?.permissions.map((permission) => {
        arrPermissions.push(permission.name);
    });
    let arrRoles: string[] = [];
    await user?.roles.map((role) => {
        arrRoles.push(role.name);
    });
    return {
        ...user,
        permissions: arrPermissions,
        roles: arrRoles,
    };
}
