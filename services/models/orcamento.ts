import { api } from "@/services/apiClient"

export const listarOrcamentos = async ({ queryKey }) => {
    const { data } = await api.get("orcamento", {
        params: queryKey[1],
    });
    return data;
};

export const buscarOrcamento = async (id) => {
    const { data } = await api.get("orcamento/" + id);
    return data;
};

export const cadastrarOrcamento = async (form) => {
    const { data } = await api.post("orcamento", form);
    return data;
};

export const atualizarOrcamento = async ({ id, ...rest }) => {
    const { data } = await api.post("orcamento/" + id, { ...rest });
    return data;
};

export const excluirOrcamento = async (id) => {
    const { data } = await api.delete("orcamento/" + id);
    return data;
};
