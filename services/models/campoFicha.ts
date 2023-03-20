import { api } from "@/services/apiClient"

export const listarCampoFichas = async ({ queryKey }) => {
    const { data } = await api.get("campoFicha", {
        params: queryKey[1],
    });
    return data;
};

export const buscarCampoFicha = async (id) => {
    const { data } = await api.get("campoFicha/" + id);
    return data;
};

export const cadastrarCampoFicha = async (form) => {
    const { data } = await api.post("campoFicha", form);
    return data;
};

export const atualizarCampoFicha = async ({ id, ...rest }) => {
    const { data } = await api.post("campoFicha/" + id, { ...rest });
    return data;
};

export const excluirCampoFicha = async (id) => {
    const { data } = await api.delete("campoFicha/" + id);
    return data;
};
