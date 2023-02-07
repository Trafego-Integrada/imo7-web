import { apiFront } from "@/services/apiClientFront";

export const listarCategoriaCampoFichas = async ({ queryKey }) => {
    const { data } = await apiFront.get("categoriaCampoFicha", {
        params: queryKey[1],
    });
    return data;
};

export const buscarCategoriaCampoFicha = async (id) => {
    const { data } = await apiFront.get("categoriaCampoFicha/" + id);
    return data;
};

export const cadastrarCategoriaCampoFicha = async (form) => {
    const { data } = await apiFront.post("categoriaCampoFicha", form);
    return data;
};

export const atualizarCategoriaCampoFicha = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("categoriaCampoFicha/" + id, {
        ...rest,
    });
    return data;
};

export const excluirCategoriaCampoFicha = async (id) => {
    const { data } = await apiFront.delete("categoriaCampoFicha/" + id);
    return data;
};
