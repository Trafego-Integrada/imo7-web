import { apiFront } from "@/services/apiClientFront";

export const listarFichas = async ({ queryKey }) => {
    const { data } = await apiFront.get("modeloFicha", {
        params: queryKey[1],
    });
    return data;
};

export const buscarFicha = async (id) => {
    const { data } = await apiFront.get("modeloFicha/" + id);
    return data;
};

export const cadastrarFicha = async (form) => {
    const { data } = await apiFront.post("modeloFicha", form);
    return data;
};

export const atualizarFicha = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("modeloFicha/" + id, { ...rest });
    return data;
};

export const excluirFicha = async (id) => {
    const { data } = await apiFront.delete("modeloFicha/" + id);
    return data;
};
