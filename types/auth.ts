import { NextApiRequest, NextApiResponse } from "next";

export type CreateSessionDTO = {
    documento: string;
    password: string;
};

type UserData = {
    email: string;
    documento: string;
    nome: string;
    avatar?: string;
    password: string;
    permissions: string[];
    roles: string[];
};

export type UsersStore = Map<string, UserData>;

export type RefreshTokensStore = Map<string, string[]>;

export type DecodedToken = {
    sub: string;
};

export interface NextApiRequestWithUser extends NextApiRequest {
    user: {};
}
