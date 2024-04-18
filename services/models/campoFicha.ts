import { api } from '@/services/apiClient'

export const listarCampoFichas = async ({ queryKey }: any) => {
    const { data } = await api.get('campoFicha', {
        params: queryKey[1],
    })
    return data
}

export const buscarCampoFicha = async (id: any) => {
    const { data } = await api.get('campoFicha/' + id)
    return data
}

export const cadastrarCampoFicha = async (form: any) => {
    const { data } = await api.post('campoFicha', form)
    return data
}

export const atualizarCampoFicha = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('campoFicha/' + id, { ...rest })
    return data
}

export const excluirCampoFicha = async (id: any) => {
    const { data } = await api.delete('campoFicha/' + id)
    return data
}

