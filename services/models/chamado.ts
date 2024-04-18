import { api } from '@/services/apiClient'

export const listarChamados = async ({ queryKey }: any) => {
    const { data } = await api.get('chamado', { params: queryKey[1] })
    return data
}

export const buscarChamado = async (id: any) => {
    const { data } = await api.get('chamado/' + id)
    return data
}

export const cadastrarChamado = async (form: any) => {
    const { data } = await api.post('chamado', form)
    return data
}

export const atualizarChamado = async ({
    id,
    ...rest
}: {
    id: any
}) => {
    const { data } = await api.post('chamado/' + id, { ...rest })
    return data
}

export const excluirChamado = async (id: any) => {
    const { data } = await api.post('chamado/' + id)
    return data
}

export const listarConversas = async ({ queryKey }: any) => {
    const { data } = await api.get(
        'chamado/' + queryKey[1].chamadoId + '/conversa',
        {
            params: queryKey[1],
        },
    )
    return data
}

export const listarIntecoesChamados = async ({ queryKey }: any) => {
    const { data } = await api.get(
        'chamado/' +
            queryKey[1].chamadoId +
            '/conversa/' +
            queryKey[1].conversaId +
            '/mensagem',
        {
            params: queryKey[1],
        },
    )
    return data
}

export const enviarMensagemChamado = async ({
    chamadoId,
    conversaId,
    ...rest
}: {
    chamadoid: any
    conversaid: any
}) => {
    const { data } = await api.post(
        'chamado/' + chamadoId + '/conversa/' + conversaId + '/mensagem',
        {
            ...rest,
        },
    )
    return data
}

export const iniciarConversaChamado = async ({
    chamadoId,
    ...rest
}: {
    chamadoid: any
}) => {
    const { data } = await api.post('chamado/' + chamadoId + '/conversa', {
        ...rest,
    })
    return data
}

export const anexarArquivoChamado = async (body: any) => {
    const { data } = await api.post('anexo', body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return data
}
export const listarHistoricosChamado = async ({
    queryKey,
    pageParam = 0,
}: {
    queryKey: any
    pageParam: any
}) => {
    const { data } = await api.get(
        `chamado/${queryKey[1].chamadoId}/historico`,
        { params: { ...queryKey[1], cursor: pageParam } },
    )
    return data
}

export const buscarHistoricoChamado = async ({
    chamadoId,
    id,
}: {
    chamadoid: any
    id: any
}) => {
    const { data } = await api.get(`chamado/${chamadoId}/historico/${id}`)
    return data
}

export const cadastrarHistoricoChamado = async ({
    chamadoId,
    ...rest
}: {
    chamadoid: any
}) => {
    const { data } = await api.post(`chamado/${chamadoId}/historico`, {
        ...rest,
    })
    return data
}

export const atualizarHistoricoChamado = async ({
    chamadoId,
    id,
    ...rest
}: {
    chamadoid: any
    id: any
}) => {
    const { data } = await api.post(`chamado/${chamadoId}/historico/${id}`, {
        ...rest,
    })
    return data
}

export const excluirHistoricoChamado = async ({
    chamadoId,
    id,
}: {
    chamadoid: any
    id: any
}) => {
    const { data } = await api.post(`chamado/${chamadoId}/historico/${id}`)
    return data
}
