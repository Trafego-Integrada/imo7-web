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
