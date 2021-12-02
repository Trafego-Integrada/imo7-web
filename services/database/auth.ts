import { v4 as uuid } from "uuid";
import prisma from "../../lib/prisma";
import { RefreshTokensStore, UsersStore } from "../../types/auth";

export const users: UsersStore = new Map();

export const tokens: RefreshTokensStore = new Map();

export async function createRefreshToken(documento: string) {
    const refreshToken = uuid();

    await prisma.token.create({
        data: {
            token: refreshToken,
            usuario: {
                connect: {
                    documento,
                },
            },
        },
    });

    return refreshToken;
}

export async function checkRefreshTokenIsValid(
    documento: string,
    refreshToken: string
) {
    const storedRefreshTokens = await prisma.token.findMany({
        where: {
            usuario: {
                documento,
            },
        },
    });

    return storedRefreshTokens.some((token) => token.token === refreshToken);
}

export async function invalidateRefreshToken(
    documento: string,
    refreshToken: string
) {
    const storedRefreshTokens = await prisma.token.findMany({
        where: {
            usuario: {
                documento,
            },
        },
    });

    await prisma.token.delete({
        where: {
            token: refreshToken,
        },
    });
}
