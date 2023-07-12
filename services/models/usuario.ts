import { api } from "@/services/apiClient";

export const listarUsuarios = async ({ queryKey }) => {
    const { data } = await api.get("usuario", { params: queryKey[1] });
    return data;
};

export const buscarUsuario = async (id) => {
    const { data } = await api.get("usuario/" + id);
    return data;
};

export const cadastrarUsuario = async (form) => {
    const { data } = await api.post("usuario", form);
    return data;
};

export const atualizarUsuario = async ({ id, ...rest }) => {
    const { data } = await api.post("usuario/" + id, { ...rest });
    return data;
};

export const excluirUsuario = async (id) => {
    const { data } = await api.post("usuario/" + id);
    return data;
};
export const excluirVariosUsuarios = async (ids) => {
    const { data } = await api.delete("usuario", {
        params: {
            ids,
        },
    });
    return data;
};
