import { api } from "@/services/apiClient";

export const listarFichas = async ({ queryKey }) => {
    const { data } = await api.get("fichaCadastral", {
        params: queryKey[1],
    });
    return data;
};

export const buscarFicha = async (id) => {
    const { data } = await api.get("fichaCadastral/" + id);
    return data;
};

export const cadastrarFicha = async (form) => {
    const { data } = await api.post("fichaCadastral", form);
    return data;
};

export const atualizarFicha = async ({ id, ...rest }) => {
    const { data } = await api.post("fichaCadastral/" + id, { ...rest });
    return data;
};

export const atualizarAnexosFicha = async ({ id, formData }) => {
    const { data } = await api.post(
        "fichaCadastral/" + id + "/anexos",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return data;
};

export const excluirFicha = async (id) => {
    const { data } = await api.delete("fichaCadastral/" + id);
    return data;
};

export const aprovaCampo = async ({ fichaId, campoCodigo }) => {
    const { data } = await api.post(
        "fichaCadastral/" + fichaId + "/aprovarCampo",
        { campoCodigo }
    );
    return data;
};

export const reprovarCampo = async ({
    fichaId,
    campoCodigo,
    motivoReprovacao,
}) => {
    const { data } = await api.post(
        "fichaCadastral/" + fichaId + "/reprovarCampo",
        { campoCodigo, motivoReprovacao }
    );
    return data;
};
