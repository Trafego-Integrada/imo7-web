import { apiFront } from "@/services/apiClientFront";

export const listarExtratos = async ({ queryKey }) => {
    const { data } = await apiFront.get("extrato", { params: queryKey[1] });
    return data;
};

export const buscarExtrato = async (id) => {
    const { data } = await apiFront.get("extrato/" + id);
    return data;
};

export const cadastrarExtrato = async (form) => {
    const { data } = await apiFront.post("extrato", form);
    return data;
};

export const atualizarExtrato = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("extrato/" + id, { ...rest });
    return data;
};

export const excluirExtrato = async (id) => {
    const { data } = await apiFront.post("extrato/" + id);
    return data;
};
