import { api } from "@/services/apiClient";

export const listarCategoriasPessoa = async ({ queryKey }) => {
    const { data } = await api.get("categoriaPessoa", {
        params: queryKey[1],
    });
    return data;
};

export const buscarCategoriaPessoa = async (id) => {
    const { data } = await api.get("categoriaPessoa/" + id);
    return data;
};

export const cadastrarCategoriaPessoa = async (form) => {
    const { data } = await api.post("categoriaPessoa", form);
    return data;
};

export const atualizarCategoriaPessoa = async ({ id, ...rest }) => {
    const { data } = await api.post("categoriaPessoa/" + id, { ...rest });
    return data;
};

export const excluirCategoriaPessoa = async (id) => {
    const { data } = await api.delete("categoriaPessoa/" + id);
    return data;
};
