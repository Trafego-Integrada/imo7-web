import { apiFront } from "../apiClientFront";

export const listarBoletos = async ({ queryKey }) => {
    const { data } = await apiFront.get("boleto", { params: queryKey[1] });
    return data;
};

export const buscarBoleto = async (id) => {
    const { data } = await apiFront.get("boleto/" + id);
    return data;
};

export const cadastrarBoleto = async (form) => {
    const { data } = await apiFront.post("boleto", form);
    return data;
};

export const atualizarBoleto = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("boleto/" + id, { ...rest });
    return data;
};

export const excluirBoleto = async (id) => {
    const { data } = await apiFront.post("boleto/" + id);
    return data;
};
