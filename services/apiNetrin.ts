import axios, { AxiosError } from 'axios'

let isRefreshing = false
let failedRequestQueue: {
    onSuccess: (token: string) => void
    onFailure: (err: AxiosError<any>) => void
}[] = []

const NETRIN_API_URL = process.env.NETRIN_API_URL
const NETRIN_API_TOKEN = process.env.NETRIN_API_TOKEN!

function setupApiClient() {
    const api = axios.create({
        baseURL: NETRIN_API_URL,
    })

    return api
}

export const apiNetrin = setupApiClient()

export const apiNetrinService = () => ({
    consultaComposta: async (consulta: any) => {
        const { data } = await apiNetrin.get(`consulta-composta`, {
            params: {
                token: NETRIN_API_TOKEN,
                ...consulta,
            },
        })
        return data
    },
})
