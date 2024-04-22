import { api } from '@/services/apiClient'

export const countConsultasNetrin = async () => {
    const { data } = await api.get('v1/consultas/netrin')

    return data
}