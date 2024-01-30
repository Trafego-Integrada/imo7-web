import { api } from '@/services/apiClient'

export const listarFilaEnvio = async ({ queryKey }: any) => {
    const { data } = await api.get('filaEnvio', {
        params: queryKey[1],
    })
    return data
}

export const buscarFilaEnvio = async (id: string | any) => {
    const { data } = await api.get('filaEnvio/' + id)
    return data
}

export const cadastrarFilaEnvio = async (form: any) => {
    const { data } = await api.post('filaEnvio', form)
    return data
}

export const atualizarFilaEnvio = async ({
    id,
    ...rest
}: {
    id: string | any
}) => {
    const { data } = await api.post('filaEnvio/' + id, { ...rest })
    return data
}

export const excluirFilaEnvio = async (id: string | any) => {
    const { data } = await api.delete('filaEnvio/' + id)
    return data
}

export const excluirVariosFilaEnvio = async (ids: any) => {
    const { data } = await api.delete('filaEnvio', {
        params: {
            ids,
        },
    })
    return data
}
