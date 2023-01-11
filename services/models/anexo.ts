import { apiFront } from "@/apiClientFront";

export const listarAnexos = async ({ queryKey }) => {
    const { data } = await apiFront.get("anexo", {
        params: queryKey[1],
    });
    return data;
};

export const buscarAnexo = async (id) => {
    const { data } = await apiFront.get("anexo/" + id);
    return data;
};

export const cadastrarAnexo = async (form) => {
    const { data } = await apiFront.post("anexo", form);
    return data;
};

export const atualizarAnexo = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("anexo/" + id, { ...rest });
    return data;
};

export const excluirAnexo = async (id) => {
    const { data } = await apiFront.delete("anexo/" + id);
    return data;
};
