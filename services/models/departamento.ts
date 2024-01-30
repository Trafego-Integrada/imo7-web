import { api } from '@/services/apiClient'

export const listarDepartamentos = async ({ queryKey }: any) => {
    const { data } = await api.get('departamento', {
        params: queryKey[1],
    })
    return data
}

export const buscarDepartamento = async (id: any) => {
    const { data } = await api.get('departamento/' + id)
    return data
}

export const cadastrarDepartamento = async (form: any) => {
    const { data } = await api.post('departamento', form)
    return data
}

export const atualizarDepartamento = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('departamento/' + id, { ...rest })
    return data
}

export const excluirDepartamento = async (id: any) => {
    const { data } = await api.delete('departamento/' + id)
    return data
}
