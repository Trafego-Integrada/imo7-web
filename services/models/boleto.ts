import { api } from '@/services/apiClient'

export const listarBoletos = async ({ queryKey }: any) => {
    const { data } = await api.get('boleto', { params: queryKey[1] })
    return data
}

export const buscarBoleto = async (id: any) => {
    const { data } = await api.get('boleto/' + id)
    return data
}

export const cadastrarBoleto = async (form: any) => {
    const { data } = await api.post('boleto', form)
    return data
}

export const atualizarBoleto = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('boleto/' + id, { ...rest })
    return data
}

export const excluirBoleto = async (id: any) => {
    const { data } = await api.delete('boleto/' + id)
    return data
}

export const excluirVariosBoletos = async (ids: any) => {
    const { data } = await api.delete('boleto', {
        params: {
            ids,
        },
    })
    return data
}

export const buscarBoletoRapido = async (form: any) => {
    const { data } = await api.post('boleto/boletoRapido', form)
    return data
}
