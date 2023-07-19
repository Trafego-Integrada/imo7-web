import { Tag } from "@chakra-ui/react";
import moment from "moment";

export const formatoData = (data, tipo = "DATA") => {
    switch (tipo) {
        case "DATA":
            return moment(data).utc().format("DD/MM/YYYY");
        case "DATA_HORA":
            return moment(data).utc().format("DD/MM/YYYY HH:mm:ss");
        default:
            return moment(data).utc().format("DD [de] MMMM [de] YYYY");
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

export const tipoFicha = (tipo) => {
    switch (tipo) {
        case "inquilino":
            return "Cadastro de Inquilino";
        case "proprietario":
            return "Cadastro de Proprietário";
        case "fiador":
            return "Cadastro de Fiador";
        case "imovel":
            return "Cadastro de Imóvel";
    }
};

export const tipoEnvioReguaCobranca = (tipo) => {
    switch (tipo) {
        case "antesVencimento":
            return "Antes do Vencimento";
        case "diaVencimento":
            return "Dia do Vencimento";
    }
};

export const tipoReguaCobranca = (tipo) => {
    switch (tipo) {
        case "boleto":
            return "Boleto";
        case "extrato":
            return "Extrato";
    }
};

export const formaEnvioReguaCobranca = (tipo) => {
    switch (tipo) {
        case "email":
            return "E-mail";
        case "sms":
            return "SMS";
        case "whatsapp":
            return "WhatsApp";
    }
};

export const arrayStatusFicha = [
    {
        label: "Aguardando Preenchimento",
        value: "aguardando",
    },
    {
        label: "Preenchida",
        value: "preenchida",
    },
    {
        label: "Em análise",
        value: "em_analise",
    },
    {
        label: "Aprovada",
        value: "aprovada",
    },
    {
        label: "Reprovada",
        value: "reprovada",
    },
    {
        label: "Arquivada",
        value: "arquivada",
    },
];
export function removerCaracteresEspeciais(string) {
    return string.replace(/[^a-zA-Z0-9]/g, "");
}
