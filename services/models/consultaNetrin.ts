import { api } from '@/services/apiClient'

export const listarConsultasNetrinAdm = async ({ queryKey }: any) => {
    const { data } = await api.get('v1/integracao/netrin/adm', { params: queryKey[1] })
    return data
}