import { api } from '@/services/apiClient'

export const listarReguasCobranca = async ({ queryKey }: any) => {
    const { data } = await api.get('reguaCobranca', { params: queryKey[1] })
    return data
}

export const buscarReguaCobranca = async (id: string | any) => {
    const { data } = await api.get('reguaCobranca/' + id)
    return data
}

export const cadastrarReguaCobranca = async (form: any) => {
    const { data } = await api.post('reguaCobranca', form)
    return data
}

export const atualizarReguaCobranca = async ({
    id,
    ...rest
}: {
    id: string | any
}) => {
    const { data } = await api.post('reguaCobranca/' + id, { ...rest })
    return data
}

export const excluirReguaCobranca = async (id: string | any) => {
    const { data } = await api.delete('reguaCobranca/' + id)
    return data
}
