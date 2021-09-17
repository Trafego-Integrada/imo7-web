import { v4 as uuid } from "uuid";
import prisma from "../../lib/prisma";
import { RefreshTokensStore, UsersStore } from "../../types/auth";

export const users: UsersStore = new Map();

export const tokens: RefreshTokensStore = new Map();

export async function createRefreshToken(document: string) {
    const refreshToken = uuid();

    await prisma.token.create({
        data: {
            token: refreshToken,
            user: {
                connect: {
                    document,
                },
            },
        },
    });

    return refreshToken;
}

export async function checkRefreshTokenIsValid(
    document: string,
    refreshToken: string
) {
    const storedRefreshTokens = await prisma.token.findMany({
        where: {
            user: {
                document,
            },
        },
    });

    return storedRefreshTokens.some((token) => token.token === refreshToken);
}

export async function invalidateRefreshToken(
    document: string,
    refreshToken: string
) {
    const storedRefreshTokens = await prisma.token.findMany({
        where: {
            user: {
                document,
            },
        },
    });

    await prisma.token.delete({
        where: {
            token: refreshToken,
        },
    });
}
