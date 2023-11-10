import { api } from "@/services/apiClient";

export const listarContratos = async ({ queryKey }) => {
    const { data } = await api.get("contrato", { params: queryKey[1] });
    return data;
};

export const buscarContrato = async (id) => {
    const { data } = await api.get("contrato/" + id);
    return data;
};

export const cadastrarContrato = async (form) => {
    const { data } = await api.post("contrato", form);
    return data;
};

export const atualizarContrato = async ({ id, ...rest }) => {
    const { data } = await api.post("contrato/" + id, { ...rest });
    return data;
};

export const excluirContrato = async (id) => {
    const { data } = await api.post("contrato/" + id);
    return data;
};

export const excluirVariosContratos = async (ids) => {
    const { data } = await api.delete("contrato", {
        params: {
            ids,
        },
    });
    return data;
};
export const listarParticipantesContratos = async ({ queryKey }) => {
    const { data } = await api.get(
        "contrato/" + queryKey[1].contratoId + "/participante",
        {
            params: queryKey[1],
        }
    );
    return data;
};

export const buscarAnexoContrato = async (id) => {
    const { data } = await api.get("anexo/" + id);
    return data;
};

export const atualizarAnexoContrato = async (body) => {
    const { data } = await api.post("anexo/" + body.id, body);
    return data;
};

export const anexarArquivoContrato = async (body) => {
    const { data } = await api.post("anexo", body);
    return data;
};
