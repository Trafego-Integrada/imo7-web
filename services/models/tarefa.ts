import { api } from '@/services/apiClient'

export const listarTarefas = async ({ queryKey }: any) => {
    const { data } = await api.get('tarefa', {
        params: queryKey[1],
    })
    return data
}

export const buscarTarefa = async (id: string | any) => {
    const { data } = await api.get('tarefa/' + id)
    return data
}

export const cadastrarTarefa = async (form: any) => {
    const { data } = await api.post('tarefa', form)
    return data
}

export const atualizarTarefa = async ({
    id,
    ...rest
}: {
    id: string | any
}) => {
    const { data } = await api.post('tarefa/' + id, { ...rest })
    return data
}

export const excluirTarefa = async (id: string | any) => {
    const { data } = await api.delete('tarefa/' + id)
    return data
}
