import { api } from '@/services/apiClient'

export const listarContratos = async ({ queryKey }: any) => {
    const { data } = await api.get('contrato', { params: queryKey[1] })
    return data
}

export const buscarContrato = async (id: any) => {
    const { data } = await api.get('contrato/' + id)
    return data
}

export const cadastrarContrato = async (form: any) => {
    const { data } = await api.post('contrato', form)
    return data
}

export const atualizarContrato = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('contrato/' + id, { ...rest })
    return data
}

export const excluirContrato = async (id: any) => {
    const { data } = await api.post('contrato/' + id)
    return data
}

export const excluirVariosContratos = async (ids: any) => {
    const { data } = await api.delete('contrato', {
        params: {
            ids,
        },
    })
    return data
}
export const listarParticipantesContratos = async ({ queryKey }: any) => {
    const { data } = await api.get(
        'contrato/' + queryKey[1].contratoId + '/participante',
        {
            params: queryKey[1],
        },
    )
    return data
}

export const buscarAnexoContrato = async (id: any) => {
    const { data } = await api.get('anexo/' + id)
    return data
}

export const atualizarAnexoContrato = async (body: any) => {
    const { data } = await api.post('anexo/' + body.id, body)
    return data
}

export const anexarArquivoContrato = async (body: any) => {
    const { data } = await api.post('anexo', body)
    return data
}
