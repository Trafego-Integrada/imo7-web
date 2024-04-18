import { api } from '@/services/apiClient'

export const getAll = async () => {
    const { data } = await api.get('user')

    return data
}

export const showBy = async (query: any) => {
    try {
        const { data } = await api.get('user/by', { params: { ...query } })
        return data
    } catch (err) {
        return Promise.reject(err)
    }
}

export const store = async (query: any) => {
    try {
        const { data } = await api.post('user', query)

        return data
    } catch (err: any) {
        return err.response
    }
}

export const accounts = async ({ queryKey }: any) => {
    try {
        const { data } = await api.get('user/' + queryKey[1] + '/accounts')

        return data
    } catch (err: any) {
        return err.response
    }
}
