import { api } from "@/services/apiClient";

export const listarNotificacoes = async () => {
    const { data } = await api.get("notificacao");

    return data;
};

