import { api } from "../apiClient";

export const getAll = async () => {
    const { data } = await api.get("user");

    return data;
};

export const showBy = async (query) => {
    try {
        const { data } = await api.get("user/by", { params: { ...query } });
        return data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const store = async (query) => {
    try {
        const { data } = await api.post("user", query);

        return data;
    } catch (err) {
        return err.response;
    }
};

export const accounts = async ({ queryKey }) => {
    try {
        const { data } = await api.get("user/" + queryKey[1] + "/accounts");

        return data;
    } catch (err) {
        return err.response;
    }
};
