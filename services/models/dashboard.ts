import { api } from "@/services/apiClient";

export const dadosDashboard = async ({ queryKey }) => {
    const { data } = await api.get("dashboard", { params: queryKey[1] });
    return data;
};
