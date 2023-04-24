import { api } from "@/services/apiClient"

export const listarChamados = async ({ queryKey }) => {
    const { data } = await api.get("chamado", { params: queryKey[1] });
    return data;
};

export const buscarChamado = async (id) => {
    const { data } = await api.get("chamado/" + id);
    return data;
};

export const cadastrarChamado = async (form) => {
    const { data } = await api.post("chamado", form);
    return data;
};

export const atualizarChamado = async ({ id, ...rest }) => {
    const { data } = await api.post("chamado/" + id, { ...rest });
    return data;
};

export const excluirChamado = async (id) => {
    const { data } = await api.post("chamado/" + id);
    return data;
};

export const listarConversas = async ({ queryKey }) => {
    const { data } = await api.get(
        "chamado/" + queryKey[1].chamadoId + "/conversa",
        {
            params: queryKey[1],
        }
    );
    return data;
};

export const listarIntecoesChamados = async ({ queryKey }) => {
    const { data } = await api.get(
        "chamado/" +
            queryKey[1].chamadoId +
            "/conversa/" +
            queryKey[1].conversaId +
            "/mensagem",
        {
            params: queryKey[1],
        }
    );
    return data;
};

export const enviarMensagemChamado = async ({
    chamadoId,
    conversaId,
    ...rest
}) => {
    const { data } = await api.post(
        "chamado/" + chamadoId + "/conversa/" + conversaId + "/mensagem",
        {
            ...rest,
        }
    );
    return data;
};

export const iniciarConversaChamado = async ({ chamadoId, ...rest }) => {
    const { data } = await api.post("chamado/" + chamadoId + "/conversa", {
        ...rest,
    });
    return data;
};

export const anexarArquivoChamado = async (body) => {
    const { data } = await api.post("anexo", body, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};
export const listarHistoricosChamado = async ({ queryKey, pageParam = 0 }) => {
    const { data } = await api.get(`chamado/${queryKey[1].chamadoId}/historico`, { params: {...queryKey[1],cursor:pageParam} });
    return data;
};

export const buscarHistoricoChamado = async ({chamadoId, id}) => {
    const { data } = await api.get(`chamado/${chamadoId}/historico/${id}`);
    return data;
};

export const cadastrarHistoricoChamado = async ({chamadoId, ...rest}) => {
    const { data } = await api.post(`chamado/${chamadoId}/historico`, {...rest});
    return data;
};

export const atualizarHistoricoChamado = async ({chamadoId,id, ...rest}) => {
    const { data } = await api.post(`chamado/${chamadoId}/historico/${id}`, { ...rest });
    return data;
};

export const excluirHistoricoChamado = async ({chamadoId, id}) => {
    const { data } = await api.post(`chamado/${chamadoId}/historico/${id}`);
    return data;
};
