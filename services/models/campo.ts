import { apiFront } from "@/services/apiClientFront";

export const listarCampos = async ({ queryKey }) => {
    const { data } = await apiFront.get("campoFicha", {
        params: queryKey[1],
    });
    return data;
};

export const buscarCampo = async (id) => {
    const { data } = await apiFront.get("campoFicha/" + id);
    return data;
};

export const cadastrarCampo = async (form) => {
    const { data } = await apiFront.post("campoFicha", form);
    return data;
};

export const atualizarCampo = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("campoFicha/" + id, { ...rest });
    return data;
};

export const excluirCampo = async (id) => {
    const { data } = await apiFront.delete("campoFicha/" + id);
    return data;
};
