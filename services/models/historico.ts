import { api } from "@/services/apiClient";

export const listarHistoricos = async ({ queryKey }) => {
    const { data } = await api.get("historico", { params: queryKey[1] });
    return data;
};
