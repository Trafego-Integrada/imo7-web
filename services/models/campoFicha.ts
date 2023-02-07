import { apiFront } from "@/services/apiClientFront";

export const listarCampoFichas = async ({ queryKey }) => {
    const { data } = await apiFront.get("campoFicha", {
        params: queryKey[1],
    });
    return data;
};

export const buscarCampoFicha = async (id) => {
    const { data } = await apiFront.get("campoFicha/" + id);
    return data;
};

export const cadastrarCampoFicha = async (form) => {
    const { data } = await apiFront.post("campoFicha", form);
    return data;
};

export const atualizarCampoFicha = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("campoFicha/" + id, { ...rest });
    return data;
};

export const excluirCampoFicha = async (id) => {
    const { data } = await apiFront.delete("campoFicha/" + id);
    return data;
};
