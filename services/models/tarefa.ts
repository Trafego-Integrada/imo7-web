import { api } from "@/services/apiClient"

export const listarTarefas = async ({ queryKey }) => {
    const { data } = await api.get("tarefa", {
        params: queryKey[1],
    });
    return data;
};

export const buscarTarefa = async (id) => {
    const { data } = await api.get("tarefa/" + id);
    return data;
};

export const cadastrarTarefa = async (form) => {
    const { data } = await api.post("tarefa", form);
    return data;
};

export const atualizarTarefa = async ({ id, ...rest }) => {
    const { data } = await api.post("tarefa/" + id, { ...rest });
    return data;
};

export const excluirTarefa = async (id) => {
    const { data } = await api.delete("tarefa/" + id);
    return data;
};
