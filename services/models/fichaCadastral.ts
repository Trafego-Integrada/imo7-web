import { apiFront } from "@/services/apiClientFront";

export const listarFichas = async ({ queryKey }) => {
    const { data } = await apiFront.get("fichaCadastral", {
        params: queryKey[1],
    });
    return data;
};

export const buscarFicha = async (id) => {
    const { data } = await apiFront.get("fichaCadastral/" + id);
    return data;
};

export const cadastrarFicha = async (form) => {
    const { data } = await apiFront.post("fichaCadastral", form);
    return data;
};

export const atualizarFicha = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("fichaCadastral/" + id, { ...rest });
    return data;
};

export const atualizarAnexosFicha = async ({ id, formData }) => {
    const { data } = await apiFront.post(
        "fichaCadastral/" + id + "/anexos",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return data;
};

export const excluirFicha = async (id) => {
    const { data } = await apiFront.delete("fichaCadastral/" + id);
    return data;
};

export const aprovaCampo = async ({ fichaId, campoCodigo }) => {
    const { data } = await apiFront.post(
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
    const { data } = await apiFront.post(
        "fichaCadastral/" + fichaId + "/reprovarCampo",
        { campoCodigo, motivoReprovacao }
    );
    return data;
};