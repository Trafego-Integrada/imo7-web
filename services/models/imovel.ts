import { api } from "@/services/apiClient";

export const listarImoveis = async ({ queryKey }) => {
    const { data } = await api.get("imovel", { params: queryKey[1] });

    return data;
};

export const buscarImovel = async (id) => {
    const { data } = await api.get("imovel/" + id);
    return data;
};

export const cadastrarImovel = async (form) => {
    const { data } = await api.post("imovel", form);
    return data;
};

export const atualizarImovel = async ({ id, data }) => {
    const { data: resp } = await api.post("imovel/" + id, data);
    return resp;
};

export const excluirImovel = async (id) => {
    const { data } = await api.post("imovel/" + id);
    return data;
};

