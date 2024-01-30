import { api } from '@/services/apiClient'

export const listarCategoriasPessoa = async ({ queryKey }: any) => {
    const { data } = await api.get('categoriaPessoa', {
        params: queryKey[1],
    })
    return data
}

export const buscarCategoriaPessoa = async (id: any) => {
    const { data } = await api.get('categoriaPessoa/' + id)
    return data
}

export const cadastrarCategoriaPessoa = async (form: any) => {
    const { data } = await api.post('categoriaPessoa', form)
    return data
}

export const atualizarCategoriaPessoa = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('categoriaPessoa/' + id, { ...rest })
    return data
}

export const excluirCategoriaPessoa = async (id: any) => {
    const { data } = await api.delete('categoriaPessoa/' + id)
    return data
}
