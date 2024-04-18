import { api } from '@/services/apiClient'

export const listarAssuntos = async ({ queryKey }: any) => {
    const { data } = await api.get('assunto', {
        params: queryKey[1],
    })
    return data
}

export const buscarAssunto = async (id: any) => {
    const { data } = await api.get('assunto/' + id)
    return data
}

export const cadastrarAssunto = async (form: any) => {
    const { data } = await api.post('assunto', form)
    return data
}

export const atualizarAssunto = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('assunto/' + id, { ...rest })
    return data
}

export const excluirAssunto = async (id: any) => {
    const { data } = await api.delete('assunto/' + id)
    return data
}
