import { api } from '@/services/apiClient'

export const listarCategoriaCampoFichas = async ({ queryKey }: any) => {
    const { data } = await api.get('categoriaCampoFicha', {
        params: queryKey[1],
    })
    return data
}

export const buscarCategoriaCampoFicha = async (id: any) => {
    const { data } = await api.get('categoriaCampoFicha/' + id)
    return data
}

export const cadastrarCategoriaCampoFicha = async (form: any) => {
    const { data } = await api.post('categoriaCampoFicha', form)
    return data
}

export const atualizarCategoriaCampoFicha = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('categoriaCampoFicha/' + id, {
        ...rest,
    })
    return data
}

export const excluirCategoriaCampoFicha = async (id: any) => {
    const { data } = await api.delete('categoriaCampoFicha/' + id)
    return data
}

