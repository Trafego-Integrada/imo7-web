import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

import { destroyCookie, parseCookies, setCookie } from "nookies";
import { api } from "../services/apiClient";

type SignInCredentials = {
    documento: string;
    password: string;
};

type Usuario = {
    id: number;
    nome: string;
    documento: string;
    avatar?: string;
    email: string;
    permissoes: string[];
    cargos: string[];
    contaSelecionada?: any;
    contratoSelecionado?: any;
};

type AuthContextData = {
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => void;
    autenticado: boolean;
    usuario: Usuario;
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export async function signOut(ctx = undefined) {
    console.log("cookies", parseCookies(ctx));

    destroyCookie(ctx, "imo7.token");
    destroyCookie(ctx, "imo7.refreshToken");

    authChannel.postMessage("signOut");
    Router.push("/auth/signin");
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [usuario, setUsuario] = useState<Usuario>({} as Usuario);
    const autenticado = !!usuario;

    useEffect(() => {
        authChannel = new BroadcastChannel("auth");

        authChannel.onmessage = (message) => {
            console.log(message);
            switch (message.data) {
                case "signOut":
                    Router.push("/auth/signin");
                    break;
                case "signIn":
                    Router.push("/painel");
                    break;
                default:
                    break;
            }
        };
    }, []);

    useEffect(() => {
        const { "imo7.token": token, "imo7.account": accountId } =
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
                        nome,
                        documento,
                        avatar,
                        email,
                        permissoes,
                        cargos,
                    } = response.data;
                    setUsuario({
                        id,
                        nome,
                        documento,
                        avatar,
                        email,
                        permissoes,
                        cargos,
                    });
                })
                .catch(() => {
                    signOut();
                });
        }
    }, []);

    async function signIn({ documento: doc, password }: SignInCredentials) {
        try {
            const response = await api.post("auth/sessions", {
                documento: doc,
                password,
            });
            const {
                id,
                nome,
                documento,
                email,
                avatar,
                token,
                refreshToken,
                permissoes,
                cargos,
            } = response.data;
            setCookie(undefined, "imo7.token", token, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });
            setCookie(undefined, "imo7.refreshToken", refreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });
            setUsuario({
                id,
                nome,
                documento,
                avatar,
                email,
                permissoes,
                cargos,
            });

            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            Router.push("/painel");
            authChannel.postMessage("signIn");
        } catch (error) {
            throw new Error(error.response.data?.message);
        }
    }

    function selecionarConta(id) {
        setCookie(undefined, "imo7.conta", id);
    }
    function selecionarContrato(id) {
        setCookie(undefined, "imo7.contrato", id);
    }
    return (
        <AuthContext.Provider
            value={{
                signIn,
                autenticado,
                usuario,
                signOut,
                selecionarConta,
                selecionarContrato,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
