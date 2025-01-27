import { api } from '@/services/apiClient'

export const listarAnexos = async ({ queryKey }: any) => {
    const { data } = await api.get('anexo', {
        params: queryKey[1],
    })
    return data
}

export const buscarAnexo = async (id: any) => {
    const { data } = await api.get('anexo/' + id)
    return data
}

export const cadastrarAnexo = async (form: any) => {
    const { data } = await api.post('anexo', form)
    return data
}

export const atualizarAnexo = async ({ id, ...rest }: { id: any }) => {
    const { data } = await api.post('anexo/' + id, { ...rest })
    return data
}

export const excluirAnexo = async (id: any) => {
    const { data } = await api.delete('anexo/' + id)
    return data
}

