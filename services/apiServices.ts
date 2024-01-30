import { AxiosInstance } from 'axios'

export const apiService = (entityName: string, apiInstance: AxiosInstance) => ({
    list: async ({ queryKey }: any) => {
        const { data } = await apiInstance.get(entityName, {
            params: queryKey[1],
        })
        return data
    },
    get: async (id: any | string) => {
        const { data } = await apiInstance.get(`${entityName}/${id}`)
        return data
    },
    create: async (data: any) => {
        const response = await apiInstance.post(entityName, data)
        return response.data
    },
    update: async ({ id, ...data }: { id: any | string }) => {
        const response = await apiInstance.put(`${entityName}/${id}`, {
            ...data,
        })
        return response.data
    },
    delete: async (id: any | string) => {
        await apiInstance.delete(`${entityName}/${id}`)
    },
    deleteMany: async (ids: any) => {
        await apiInstance.delete(`${entityName}`, {
            params: {
                ids,
            },
        })
    },
})
