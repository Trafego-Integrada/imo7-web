import { api } from "@/services/apiClient";

export const tipoNotificacao = async () => {
    const { data } = await api.get("tipoEnvio");
    console.log("service", data);
    return data;
};
