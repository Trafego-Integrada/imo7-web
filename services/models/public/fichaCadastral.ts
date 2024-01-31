import { api } from "@/services/apiClient";

export const atualizarFicha = async ({ id, ...rest }) => {
    const { data } = await api.post("public/fichaCadastral/" + id, { ...rest });
    return data;
};

export const atualizarAnexosFicha = async ({ id, formData }) => {
    const { data } = await api.post(
        "public/fichaCadastral/" + id + "/anexos",
        formData
    );
    return data;
};
export const buscarFicha = async (id) => {
    const { data } = await api.get("public/fichaCadastral/" + id);
    return data;
};

export const excluirAnexoFicha = async ({ id, params }) => {
    const { data } = await api.delete(
        "public/fichaCadastral/" + id + "/anexos",
        {
            params: {
                ...params,
            },
        }
    );
    return data;
};