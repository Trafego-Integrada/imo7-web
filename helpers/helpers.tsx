import { Tag } from "@chakra-ui/react";

export const formatoData = (data, tipo = "DATA") => {
    switch (tipo) {
        case "DATA":
            return Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
                new Date(data)
            );
        case "DATA_HORA":
            return Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            }).format(new Date(data));
        default:
            return Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                new Date(data)
            );
    }
};

export const formatoValor = (valor) => {
    return Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
};
export function includesAll(arr: any[], items: any[]) {
    for (const item of items) {
        if (!arr.includes(item)) {
            return false;
        }
    }
    return true;
}

export const statusFicha = (status) => {
    switch (status) {
        case "aguardando":
            return (
                <Tag colorScheme="blue" size="sm">
                    Aguardando Preenchimento
                </Tag>
            );
        case "preenchida":
            return (
                <Tag colorScheme="green" size="sm">
                    Preenchida
                </Tag>
            );
        case "em_analise":
            return (
                <Tag colorScheme="orange" size="sm">
                    Em análise
                </Tag>
            );
        case "aprovada":
            return (
                <Tag colorScheme="green" size="sm">
                    Aprovado
                </Tag>
            );
        case "reprovada":
            return (
                <Tag colorScheme="red" size="sm">
                    Reprovada
                </Tag>
            );
        case "arquivada":
            return (
                <Tag colorScheme="gray" size="sm">
                    Arquivada
                </Tag>
            );
    }
};
