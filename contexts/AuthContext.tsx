import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

import { destroyCookie, parseCookies, setCookie } from "nookies";
import { api } from "@/services/apiClient";

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

export async function signOut(ctx = null) {
    destroyCookie(ctx, "imo7.token");
    destroyCookie(ctx, "imo7.refreshToken");
    Router.push("/login");
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [usuario, setUsuario] = useState<Usuario>({} as Usuario);
    const autenticado = !!usuario;

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
                        imobiliaria,
                        imobiliariaId,
                        conta,
                        modulos,
                    } = response.data;
                    setUsuario({
                        id,
                        nome,
                        documento,
                        avatar,
                        email,
                        permissoes,
                        cargos,
                        imobiliaria,
                        imobiliariaId,
                        conta,
                        modulos,
                    });
                })
                .catch(() => {
                    signOut();
                });
        }
    }, []);
    async function recuperarSenha({ documento }) {
        try {
            const response = await api.post("auth/recuperarSenha", {
                documento,
            });

            return response;
        } catch (error) {
            throw new Error(error.response.data?.message);
        }
    }
    async function redefinirSenha({ codigo, password, confirmPassword }) {
        try {
            const response = await api.post("auth/redefinirSenha", {
                codigo,
                password,
                confirmPassword,
            });

            return response;
        } catch (error) {
            throw new Error(error.response.data?.message);
        }
    }

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
                imobiliaria,
                imobiliariaId,
                conta,
                modulos,
            } = response.data;
            setCookie(null, "imo7.token", token, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });
            setCookie(null, "imo7.refreshToken", refreshToken, {
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
                imobiliaria,
                imobiliariaId,
                conta,
                modulos,
            });

            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            if (cargos.includes("adm")) {
                Router.push("/admin");
            } else if (cargos.includes("imobiliaria")) {
                Router.push("/admin");
            } else if (cargos.includes("conta")) {
                Router.push("/admin");
            } else {
                Router.push("/");
            }
        } catch (error) {
            throw new Error(error.response.data?.message);
        }
    }

    function selecionarConta(id) {
        setCookie(null, "imo7.conta", id);
    }
    function selecionarContrato(id) {
        setCookie(null, "imo7.contrato", id);
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
                recuperarSenha,
                redefinirSenha,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
