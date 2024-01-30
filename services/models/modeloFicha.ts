import { api } from '@/services/apiClient'

export const listarFichas = async ({ queryKey }: any) => {
    const { data } = await api.get('modeloFicha', {
        params: queryKey[1],
    })
    return data
}

export const buscarFicha = async (id: string | any) => {
    const { data } = await api.get('modeloFicha/' + id)
    return data
}

export const cadastrarFicha = async (form: any) => {
    const { data } = await api.post('modeloFicha', form)
    return data
}

export const atualizarFicha = async ({ id, ...rest }: { id: string | any }) => {
    const { data } = await api.post('modeloFicha/' + id, { ...rest })
    return data
}

export const excluirFicha = async (id: string | any) => {
    const { data } = await api.delete('modeloFicha/' + id)
    return data
}

export const excluirVariasFichas = async (ids: any) => {
    const { data } = await api.delete('modeloFicha', {
        params: {
            ids,
        },
    })
    return data
}
