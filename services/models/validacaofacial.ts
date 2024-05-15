import { api } from '@/services/apiClient'

export const listarValidacoesFaciais = async ({ queryKey }) => {
    //console.log("listarValidacoesFaciais");

    try {
        const { data } = await api.get('validacaoFacial', {
            params: queryKey[1],
        })
        return data
    } catch (e) {
        //console.log("error");
        //console.log(e);
        return null
    }
}

export const listarValidacoesFaciaisAdm = async ({ queryKey }) => {
    //console.log("listarValidacoesFaciais");

    try {
        const { data } = await api.get('validacaoFacial/adm', {
            params: queryKey[1],
        })
        return data
    } catch (e) {
        //console.log("error");
        //console.log(e);
        return null
    }
}

export const buscarValidacoesFaciais = async (id: any | string) => {
    const { data } = await api.get('validacaoFacial/' + id)
    return data
}

export const cadastrarValidacao = async (form: any) => {
    const { data } = await api.post('validacaoFacial', form)
    return data
}
