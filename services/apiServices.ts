// services/apiService.ts
import { AxiosInstance } from "axios";

export const apiService = (entityName: string, apiInstance: AxiosInstance) => ({
    list: async ({ queryKey }) => {
        const { data } = await apiInstance.get(entityName, {
            params: queryKey[1],
        });
        return data;
    },
    get: async (id) => {
        const { data } = await apiInstance.get(`${entityName}/${id}`);
        return data;
    },
    create: async (data) => {
        const response = await apiInstance.post(entityName, data);
        return response.data;
    },
    update: async ({ id, ...data }) => {
        const response = await apiInstance.put(`${entityName}/${id}`, {
            ...data,
        });

        return response.data;
    },
    delete: async (id) => {
        await apiInstance.delete(`${entityName}/${id}`);
    },
    deleteMany: async (ids) => {
        await apiInstance.delete(`${entityName}`, {
            params: {
                ids,
            },
        });
    },
});
