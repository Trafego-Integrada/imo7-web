import { NextApiRequest, NextApiResponse } from "next";

export type CreateSessionDTO = {
    document: string;
    password: string;
};

type UserData = {
    email: string;
    document: string;
    name: string;
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
