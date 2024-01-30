import { api } from '@/services/apiClient'

export const listarContas = async () => {
    const { data } = await api.get('conta')

    return data
}
export const buscarConta = async (id: any) => {
    const { data } = await api.get('conta/' + id)
    return data
}

export const cadastrarConta = async (form: any) => {
    const { data } = await api.post('conta', form)
    return data
}

export const atualizarConta = async ({ id, ...rest }: { id: any }) => {
    const { data } = await api.post('conta/' + id, { ...rest })
    return data
}

export const excluirConta = async (id: any) => {
    const { data } = await api.post('conta/' + id)
    return data
}
