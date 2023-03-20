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

export const listarParticipantesContratos = async ({ queryKey }) => {
    const { data } = await api.get(
        "contrato/" + queryKey[1].contratoId + "/participante",
        {
            params: queryKey[1],
        }
    );
    return data;
};

export const anexarArquivoContrato = async (body) => {
    const { data } = await api.post("anexo", body, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};
