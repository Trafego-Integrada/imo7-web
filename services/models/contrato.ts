import { api } from "../apiClient";

export const getAll = async () => {
    const { data } = await api.get("contrato");

    return data;
};
