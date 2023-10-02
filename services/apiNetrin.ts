import { signOut } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";
import jwtDecode from "jwt-decode";
import { parseCookies, setCookie } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";

let isRefreshing = false;
let failedRequestQueue: {
    onSuccess: (token: string) => void;
    onFailure: (err: AxiosError<any>) => void;
}[] = [];

function setupApiClient() {
    const api = axios.create({
        baseURL: "https://api.netrin.com.br/v1/",
    });

    return api;
}

export const apiNetrin = setupApiClient();

export const apiNetrinService = () => ({
    consultaComposta: async (consulta) => {
        const { data } = await apiNetrin.get(`consulta-composta`, {
            params: {
                token: "fd738b33-ad1d-4cda-bd47-47ffdeefad01",
                ...consulta,
            },
        });
        return data;
    },
});
