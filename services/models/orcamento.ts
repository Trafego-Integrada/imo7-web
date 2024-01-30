import { api } from '@/services/apiClient'

export const listarOrcamentos = async ({ queryKey }: any) => {
    const { data } = await api.get('orcamento', {
        params: queryKey[1],
    })
    return data
}

export const buscarOrcamento = async (id: string | any) => {
    const { data } = await api.get('orcamento/' + id)
    return data
}

export const cadastrarOrcamento = async (form: any) => {
    const { data } = await api.post('orcamento', form)
    return data
}

export const atualizarOrcamento = async ({
    id,
    ...rest
}: {
    id: string | any
}) => {
    const { data } = await api.post('orcamento/' + id, { ...rest })
    return data
}

export const excluirOrcamento = async (id: string | any) => {
    const { data } = await api.delete('orcamento/' + id)
    return data
}
