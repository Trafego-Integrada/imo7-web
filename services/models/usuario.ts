import { apiFront } from "../apiClientFront";

export const listarUsuarios = async ({ queryKey }) => {
    const { data } = await apiFront.get("usuario", { params: queryKey[1] });
    return data;
};

export const buscarUsuario = async (id) => {
    const { data } = await apiFront.get("usuario/" + id);
    return data;
};

export const cadastrarUsuario = async (form) => {
    const { data } = await apiFront.post("usuario", form);
    return data;
};

export const atualizarUsuario = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("usuario/" + id, { ...rest });
    return data;
};

export const excluirUsuario = async (id) => {
    const { data } = await apiFront.post("usuario/" + id);
    return data;
};
