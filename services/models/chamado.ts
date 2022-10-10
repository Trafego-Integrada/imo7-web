import { apiFront } from "../apiClientFront";

export const listarChamados = async ({ queryKey }) => {
    const { data } = await apiFront.get("chamado", { params: queryKey[1] });
    return data;
};

export const buscarChamado = async (id) => {
    const { data } = await apiFront.get("chamado/" + id);
    return data;
};

export const cadastrarChamado = async (form) => {
    const { data } = await apiFront.post("chamado", form);
    return data;
};

export const atualizarChamado = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("chamado/" + id, { ...rest });
    return data;
};

export const excluirChamado = async (id) => {
    const { data } = await apiFront.post("chamado/" + id);
    return data;
};

export const listarConversas = async ({ queryKey }) => {
    const { data } = await apiFront.get(
        "chamado/" + queryKey[1].chamadoId + "/conversa",
        {
            params: queryKey[1],
        }
    );
    return data;
};

export const listarIntecoesChamados = async ({ queryKey }) => {
    const { data } = await apiFront.get(
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
    const { data } = await apiFront.post(
        "chamado/" + chamadoId + "/conversa/" + conversaId + "/mensagem",
        {
            ...rest,
        }
    );
    return data;
};

export const iniciarConversaChamado = async ({ chamadoId, ...rest }) => {
    const { data } = await apiFront.post("chamado/" + chamadoId + "/conversa", {
        ...rest,
    });
    return data;
};

export const anexarArquivoChamado = async (body) => {
    const { data } = await apiFront.post("anexo", body, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};
