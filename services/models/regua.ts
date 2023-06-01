import { api } from "@/services/apiClient";

export const listaregras = async ({ queryKey }) => {
    const { data } = await api.get("regua", {
        params: queryKey[1],
    });
    return data;
};

export const buscar = async (id) => {
    const { data } = await api.get("regua/" + id);
    return data;
};

export const cadastrarRegua = async (form) => {
    const { data } = await api.post("regua", form);
    return data;
};

export const atualizarRegua = async ({ id, ...rest }) => {
    const { data } = await api.post("regua/" + id, { ...rest });
    return data;
};

export const excluirRegua = async (id) => {
    const { data } = await api.delete("regua/" + id);
    return data;
};
