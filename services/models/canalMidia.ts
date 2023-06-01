import { api } from "@/services/apiClient";

export const listarCanalMidia = async ({ queryKey }) => {
    const { data } = await api.get("canalMidia", {
        params: queryKey[1],
    });
    return data;
};
