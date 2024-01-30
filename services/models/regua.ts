import { api } from '@/services/apiClient'

export const listaregras = async ({ queryKey }: any) => {
    const { data } = await api.get('regua', {
        params: queryKey[1],
    })
    return data
}

export const buscar = async (id: any) => {
    const { data } = await api.get('regua/' + id)
    return data
}

export const cadastrarRegua = async (form: any) => {
    const { data } = await api.post('regua', form)
    return data
}

export const atualizarRegua = async ({ id, ...rest }: { id: any }) => {
    const { data } = await api.post('regua/' + id, { ...rest })
    return data
}

export const excluirRegua = async (id: any) => {
    const { data } = await api.delete('regua/' + id)
    return data
}
