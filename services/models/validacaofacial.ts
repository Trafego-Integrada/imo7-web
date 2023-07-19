import { api } from "@/services/apiClient";

export const listarValidacoesFaciais = async ({ queryKey }) => {
    console.log("listarValidacoesFaciais");

    try {
        const { data } = await api.get("validacaoFacial", {
            params: queryKey[1],
        });
        return data;
    } catch (e) {
        console.log("error");
        console.log(e);
        return null;
    }
};

export const buscarValidacoesFaciais = async (id) => {
    const { data } = await api.get("validacaoFacial/" + id);
    return data;
};

export const cadastrarValidacao = async (form) => {
    const { data } = await api.post("validacaoFacial", form);
    return data;
};

// export const atualizarUsuario = async ({ id, ...rest }) => {
//     const { data } = await api.post("usuario/" + id, { ...rest });
//     return data;
// };

// export const excluirUsuario = async (id) => {
//     const { data } = await api.post("usuario/" + id);
//     return data;
// };
