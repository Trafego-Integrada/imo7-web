import { api } from "@/services/apiClient";

export const getAll = async ({ queryKey }) => {
    const { data } = await api.get("imobiliaria", { params: queryKey[1] });

    return data;
};

export const show = async (id) => {
    const { data } = await api.get("imobiliaria/" + id);
    return data;
};

export const store = async (form) => {
    const { data } = await api.post("imobiliaria", form);
    return data;
};

export const update = async ({ id, data }) => {
    const { data: resp } = await api.post("imobiliaria/" + id, data);
    return resp;
};

export const destroy = async (id) => {
    const { data } = await api.post("imobiliaria/" + id);
    return data;
};
