import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

import { destroyCookie, parseCookies, setCookie } from "nookies";
import { api } from "../services/apiClient";
type SignInCredentials = {
    document: string;
    password: string;
};

type User = {
    id: number;
    name: string;
    document: string;
    avatar?: string;
    email: string;
    permissions: string[];
    roles: string[];
    accountSelected: any;
};

type AuthContextData = {
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => void;
    isAuthenticated: boolean;
    user: User;
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export async function signOut(ctx = undefined) {
    console.log("cookies", parseCookies(ctx));

    destroyCookie(ctx, "patriota.token");
    destroyCookie(ctx, "patriota.refreshToken");

    authChannel.postMessage("signOut");
    Router.push("/auth/signin");
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User);
    const isAuthenticated = !!user;
    useEffect(() => {
        authChannel = new BroadcastChannel("auth");

        authChannel.onmessage = (message) => {
            console.log(message);
            switch (message.data) {
                case "signOut":
                    Router.push("/auth/signin");
                    break;
                case "signIn":
                    Router.push("/");
                    break;
                default:
                    break;
            }
        };
    }, []);

    useEffect(() => {
        const { "patriota.token": token, "patriota.account": accountId } =
            parseCookies();
        if (token) {
            api.get("auth/me", {
                params: {
                    accountId,
                },
            })
                .then((response) => {
                    const {
                        id,
                        name,
                        document,
                        avatar,
                        email,
                        permissions,
                        roles,
                        account,
                    } = response.data;
                    setUser({
                        id,
                        name,
                        document,
                        avatar,
                        email,
                        permissions,
                        roles,
                        accountSelected: account,
                    });
                })
                .catch(() => {
                    signOut();
                });
        }
    }, []);

    async function signIn({ document: doc, password }: SignInCredentials) {
        try {
            const response = await api.post("auth/sessions", {
                document: doc,
                password,
            });
            const {
                id,
                name,
                document,
                email,
                avatar,
                token,
                refreshToken,
                permissions,
                roles,
            } = response.data;
            setCookie(undefined, "patriota.token", token, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });
            setCookie(undefined, "patriota.refreshToken", refreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });
            setUser({
                id,
                name,
                document,
                avatar,
                email,
                permissions,
                roles,
            });

            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            Router.push("/");
            authChannel.postMessage("signIn");
        } catch (error) {
            throw new Error(error.response.data?.message);
        }
    }

    function selectAccount(id) {
        setCookie(undefined, "patriota.account", id);
    }
    function logoutAccount(id) {
        destroyCookie(undefined, "patriota.account");
    }
    return (
        <AuthContext.Provider
            value={{
                signIn,
                isAuthenticated,
                user,
                signOut,
                selectAccount,
                logoutAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
