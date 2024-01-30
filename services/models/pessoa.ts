import { api } from '@/services/apiClient'

export const listarPessoas = async ({ queryKey }: any) => {
    const { data } = await api.get('pessoa', {
        params: queryKey[1],
    })
    return data
}

export const buscarPessoa = async (id: string | any) => {
    const { data } = await api.get('pessoa/' + id)
    return data
}

export const cadastrarPessoa = async (form: any) => {
    const { data } = await api.post('pessoa', form)
    return data
}

export const atualizarPessoa = async ({
    id,
    ...rest
}: {
    id: string | any
}) => {
    const { data } = await api.post('pessoa/' + id, { ...rest })
    return data
}

export const excluirPessoa = async (id: string | any) => {
    const { data } = await api.delete('pessoa/' + id)
    return data
}
