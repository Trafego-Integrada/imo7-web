import { api } from '@/services/apiClient'

export const listarCampos = async ({ queryKey }: any) => {
    const { data } = await api.get('campoFicha', {
        params: queryKey[1],
    })
    return data
}

export const buscarCampo = async (id: string | any) => {
    const { data } = await api.get('campoFicha/' + id)
    return data
}

export const cadastrarCampo = async (form: any) => {
    const { data } = await api.post('campoFicha', form)
    return data
}

export const atualizarCampo = async ({ id, ...rest }: { id: string | any }) => {
    const { data } = await api.post('campoFicha/' + id, { ...rest })
    return data
}

export const excluirCampo = async (id: string | any) => {
    const { data } = await api.delete('campoFicha/' + id)
    return data
}

