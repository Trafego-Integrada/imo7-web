import { api } from "@/services/apiClient";

export const listarModulos = async ({ queryKey }) => {
    const { data } = await api.get("modulo", { params: queryKey[1] });
    return data;
};

export const buscarModulo = async (id) => {
    const { data } = await api.get("modulo/" + id);
    return data;
};

export const cadastrarModulo = async (form) => {
    const { data } = await api.post("modulo", form);
    return data;
};

export const atualizarModulo = async ({ id, ...rest }) => {
    const { data } = await api.post("modulo/" + id, { ...rest });
    return data;
};

export const excluirModulo = async (id) => {
    const { data } = await api.post("modulo/" + id);
    return data;
};
