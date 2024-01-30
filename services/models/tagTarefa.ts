import { api } from '@/services/apiClient'

export const listarTagsTarefa = async ({ queryKey }: any) => {
    const { data } = await api.get('tagTarefa', {
        params: queryKey[1],
    })
    return data
}

export const buscarTagTarefa = async (id: any) => {
    const { data } = await api.get('tagTarefa/' + id)
    return data
}

export const cadastrarTagTarefa = async (form: any) => {
    const { data } = await api.post('tagTarefa', form)
    return data
}

export const atualizarTagTarefa = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('tagTarefa/' + id, { ...rest })
    return data
}

export const excluirTagTarefa = async (id: any) => {
    const { data } = await api.delete('tagTarefa/' + id)
    return data
}
