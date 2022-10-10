import { apiFront } from "../apiClientFront";

export const listarContratos = async ({ queryKey }) => {
    const { data } = await apiFront.get("contrato", { params: queryKey[1] });
    return data;
};

export const buscarContrato = async (id) => {
    const { data } = await apiFront.get("contrato/" + id);
    return data;
};

export const cadastrarContrato = async (form) => {
    const { data } = await apiFront.post("contrato", form);
    return data;
};

export const atualizarContrato = async ({ id, ...rest }) => {
    const { data } = await apiFront.post("contrato/" + id, { ...rest });
    return data;
};

export const excluirContrato = async (id) => {
    const { data } = await apiFront.post("contrato/" + id);
    return data;
};

export const listarParticipantesContratos = async ({ queryKey }) => {
    const { data } = await apiFront.get(
        "contrato/" + queryKey[1].contratoId + "/participante",
        {
            params: queryKey[1],
        }
    );
    return data;
};
