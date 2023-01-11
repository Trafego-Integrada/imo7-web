import { apiFront } from "@/services/apiClientFront";

export const listarAssuntos = async ({ queryKey }) => {
    const { data } = await apiFront.get("assunto", {
        params: queryKey[1],
    });
    return data;
};

export const buscarAssunto = async (id) => {
    const { data } = await apiFront.get("assunto/" + id);
    return data;
};

export const cadastrarAssunto = async (form) => {
    const { data } = await apiFront.post("assunto", form);
    return data;
};

export const atualizarAssunto = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("assunto/" + id, { ...rest });
    return data;
};

export const excluirAssunto = async (id) => {
    const { data } = await apiFront.post("assunto/" + id);
    return data;
};
