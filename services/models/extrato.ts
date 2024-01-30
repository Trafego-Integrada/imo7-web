import { api } from '@/services/apiClient'

export const listarExtratos = async ({ queryKey }: any) => {
    const { data } = await api.get('extrato', { params: queryKey[1] })
    return data
}

export const buscarExtrato = async (id: string | any) => {
    const { data } = await api.get('extrato/' + id)
    return data
}

export const cadastrarExtrato = async (form: any) => {
    const { data } = await api.post('extrato', form)
    return data
}

export const atualizarExtrato = async ({
    id,
    ...rest
}: {
    id: string | any
}) => {
    const { data } = await api.post('extrato/' + id, { ...rest })
    return data
}

export const excluirExtrato = async (id: string | any) => {
    const { data } = await api.delete('extrato/' + id)
    return data
}

export const excluirVariosExtratos = async (ids: any) => {
    const { data } = await api.delete('extrato', {
        params: {
            ids,
        },
    })
    return data
}
