import { api } from "@/services/apiClient";

export const listarAssuntos = async ({ queryKey }) => {
    const { data } = await api.get("assunto", {
        params: queryKey[1],
    });
    return data;
};

export const buscarAssunto = async (id) => {
    const { data } = await api.get("assunto/" + id);
    return data;
};

export const cadastrarAssunto = async (form) => {
    const { data } = await api.post("assunto", form);
    return data;
};

export const atualizarAssunto = async ({ id, ...rest }) => {
    const { data } = await api.post("assunto/" + id, { ...rest });
    return data;
};

export const excluirAssunto = async (id) => {
    const { data } = await api.post("assunto/" + id);
    return data;
};
