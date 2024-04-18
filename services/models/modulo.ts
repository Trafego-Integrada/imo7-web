import { api } from '@/services/apiClient'

export const listarModulos = async ({ queryKey }: any) => {
    const { data } = await api.get('modulo', { params: queryKey[1] })
    return data
}

export const buscarModulo = async (id: any) => {
    const { data } = await api.get('modulo/' + id)
    return data
}

export const cadastrarModulo = async (form: any) => {
    const { data } = await api.post('modulo', form)
    return data
}

export const atualizarModulo = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('modulo/' + id, { ...rest })
    return data
}

export const excluirModulo = async (id: any) => {
    const { data } = await api.post('modulo/' + id)
    return data
}

