import axios, { AxiosError } from 'axios'

let isRefreshing = false
let failedRequestQueue: {
    onSuccess: (token: string) => void
    onFailure: (err: AxiosError<any>) => void
}[] = []

const PLUGZAPI_URL = process.env.PLUGZAPI_URL!

function setupApiClient() {
    const api = axios.create({
        baseURL: PLUGZAPI_URL,
    })

    return api
}

export const apiWhatsapp = setupApiClient()
