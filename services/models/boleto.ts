import { api } from "@/services/apiClient";

export const listarBoletos = async ({ queryKey }) => {
    const { data } = await api.get("boleto", { params: queryKey[1] });
    return data;
};

export const buscarBoleto = async (id) => {
    const { data } = await api.get("boleto/" + id);
    return data;
};

export const cadastrarBoleto = async (form) => {
    const { data } = await api.post("boleto", form);
    return data;
};

export const atualizarBoleto = async ({ id, ...rest }) => {
    const { data } = await api.post("boleto/" + id, { ...rest });
    return data;
};

export const excluirBoleto = async (id) => {
    const { data } = await api.post("boleto/" + id);
    return data;
};
