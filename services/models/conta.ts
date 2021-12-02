import { api } from "../apiClient";

export const getAll = async () => {
    const { data } = await api.get("conta");

    return data;
};
