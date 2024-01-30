import { api } from '@/services/apiClient'

export const getAll = async ({ queryKey }: any) => {
    const { data } = await api.get('imobiliaria', { params: queryKey[1] })

    return data
}

export const show = async (id: string | any) => {
    const { data } = await api.get('imobiliaria/' + id)
    return data
}

export const store = async (form: any) => {
    const { data } = await api.post('imobiliaria', form)
    return data
}

export const update = async ({ id, ...data }: { id: string | any }) => {
    const { data: resp } = await api.post('imobiliaria/' + id, data)
    return resp
}

export const destroy = async (id: string | any) => {
    const { data } = await api.post('imobiliaria/' + id)
    return data
}
