import axios from 'axios'

function setupApiClient() {
    const api = axios.create({
        baseURL: process.env.NETRIN_API_URL,
    })

    return api
}

export const apiNetrin = setupApiClient()

export const apiNetrinService = () => ({
    consultaComposta: async (consulta: any) => {
        const { data } = await apiNetrin.get(`consulta-composta`, {
            params: {
                token: process.env.NETRIN_API_TOKEN,
                ...consulta,
            },
        })

        return data
    },
})
