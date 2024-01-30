import { api } from '@/services/apiClient'

export const listarFichas = async ({ queryKey }: any) => {
    const { data } = await api.get('fichaCadastral', {
        params: queryKey[1],
    })
    return data
}

export const buscarFicha = async (id: any) => {
    const { data } = await api.get('fichaCadastral/' + id)
    return data
}

export const cadastrarFicha = async (form: any) => {
    const { data } = await api.post('fichaCadastral', form)
    return data
}

export const atualizarFicha = async ({ id, ...rest }: { id: any }) => {
    const { data } = await api.post('fichaCadastral/' + id, { ...rest })
    return data
}

export const atualizarAnexosFicha = async ({
    id,
    ...formData
}: {
    id: any
}) => {
    const { data } = await api.post(
        'fichaCadastral/' + id + '/anexos',
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
        },
    )
    return data
}

export const excluirFicha = async (id: any) => {
    const { data } = await api.delete('fichaCadastral/' + id)
    return data
}

export const excluirVariasFichas = async (ids: any) => {
    const { data } = await api.delete('fichaCadastral', {
        params: {
            ids,
        },
    })
    return data
}

export const aprovaCampo = async ({
    fichaId,
    campoCodigo,
}: {
    fichaid: any
    campoCodigo: any
}) => {
    const { data } = await api.post(
        'fichaCadastral/' + fichaId + '/aprovarCampo',
        { campoCodigo },
    )
    return data
}

export const reprovarCampo = async ({
    fichaId,
    campoCodigo,
    motivoReprovacao,
}: {
    fichaid: any
    campoCodigo: any
    motivoReprovacao: any
}) => {
    const { data } = await api.post(
        'fichaCadastral/' + fichaId + '/reprovarCampo',
        { campoCodigo, motivoReprovacao },
    )
    return data
}
