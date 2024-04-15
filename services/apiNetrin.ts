import axios from "axios";

function setupApiClient() {
    const api = axios.create({
        baseURL: "https://api.netrin.com.br/v1/",
    });

    return api;
}

export const apiNetrin = setupApiClient();

export const apiNetrinService = () => ({
    consultaComposta: async (consulta: any) => {
        const { data } = await apiNetrin.get(`consulta-composta`, {
            params: {
                token: "fd738b33-ad1d-4cda-bd47-47ffdeefad01",
                ...consulta,
            },
        });

        console.log('DATA = ', data);


        return data;
    },
});
