import { apiFront } from "@/services/apiClientFront";

export const listarModulos = async ({ queryKey }) => {
    const { data } = await apiFront.get("modulo", { params: queryKey[1] });
    return data;
};

export const buscarModulo = async (id) => {
    const { data } = await apiFront.get("modulo/" + id);
    return data;
};

export const cadastrarModulo = async (form) => {
    const { data } = await apiFront.post("modulo", form);
    return data;
};

export const atualizarModulo = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("modulo/" + id, { ...rest });
    return data;
};

export const excluirModulo = async (id) => {
    const { data } = await apiFront.post("modulo/" + id);
    return data;
};
