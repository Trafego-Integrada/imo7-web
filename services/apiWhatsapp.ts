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
        baseURL: "https://api.plugzapi.com.br/",
    });

    return api;
}

export const apiWhatsapp = setupApiClient();
