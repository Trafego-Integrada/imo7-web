import { Tag, Tooltip } from "@chakra-ui/react";
import moment from "moment";

export const formatoData = (data, tipo = "DATA", utc = true) => {
    switch (tipo) {
        case "DATA":
            return moment(data).utc(utc).format("DD/MM/YYYY");
        case "DATA_HORA":
            return moment(data).utc(utc).format("DD/MM/YYYY HH:mm:ss");
        default:
            return moment(data).utc(utc).format("DD [de] MMMM [de] YYYY");
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
export function nl2br(str, is_xhtml) {
    var breakTag =
        is_xhtml || typeof is_xhtml === "undefined" ? "<br " + "/>" : "<br>"; // Adjust comment to avoid issue on phpjs.org display

    return (str + "").replace(
        /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
        "$1" + breakTag + "$2"
    );
}

export const tagStatusChamado = (status) => {
    switch (status) {
        case "ABERTO":
            return (
                <Tag colorScheme="orange" size="sm">
                    Aberto
                </Tag>
            );

        case "FINALIZADO":
            return (
                <Tag colorScheme="green" size="sm">
                    Finalizado
                </Tag>
            );
        case "ARQUIVADO":
            return (
                <Tag colorScheme="gray" size="sm">
                    Arquivado
                </Tag>
            );
    }
};

export const statusTarefa = (status) => {
    switch (status) {
        case "finalizada":
            return (
                <Tag colorScheme="gray" size="sm">
                    Finalizada
                </Tag>
            );
        case "aberta":
            return (
                <Tag colorScheme="blue" size="sm">
                    Aberta
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
export const statusFichaTag = (status) => {
    switch (status) {
        case "aguardando":
            return (
                <Tooltip label="Aguardando Preenchimento">
                    <Tag colorScheme="blue" size="sm" rounded="full"></Tag>
                </Tooltip>
            );
        case "preenchida":
            return (
                <Tooltip label="Preenchida">
                    <Tag colorScheme="green" size="sm" rounded="full"></Tag>
                </Tooltip>
            );
        case "em_analise":
            return (
                <Tooltip label="Em análise">
                    <Tag colorScheme="orange" size="sm" rounded="full"></Tag>
                </Tooltip>
            );
        case "aprovada":
            return (
                <Tooltip label="Aprovado">
                    <Tag colorScheme="green" size="sm" rounded="full"></Tag>
                </Tooltip>
            );
        case "reprovada":
            return (
                <Tooltip label="Reprovada">
                    <Tag colorScheme="red" size="sm" rounded="full"></Tag>
                </Tooltip>
            );
        case "arquivada":
            return (
                <Tooltip label="Arquivada">
                    <Tag colorScheme="gray" size="sm" rounded="full"></Tag>
                </Tooltip>
            );
    }
};
export const statusProcesso = (status) => {
    switch (status) {
        case "EM_ANDAMENTO":
            return (
                <Tag colorScheme="orange" size="sm">
                    Em andamento
                </Tag>
            );
        case "REPROVADO":
            return (
                <Tag colorScheme="red" size="sm">
                    Reprovado
                </Tag>
            );
        case "COMPLETO":
            return (
                <Tag colorScheme="blue" size="sm">
                    Completo
                </Tag>
            );
        case "APROVADO":
            return (
                <Tag colorScheme="green" size="sm">
                    Aprovado
                </Tag>
            );
        case "CANCELADO":
            return (
                <Tag colorScheme="yellow" size="sm">
                    Cancelado
                </Tag>
            );
        case "ARQUIVADO":
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
export function TestaCPF(strCPF: string) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

export const tagTipoConsultaNetrin = (tipo) => {
    switch (tipo) {
        case "processos_pj":
            return (
                <Tag colorScheme="purple" size="sm">
                    Processos PJ
                </Tag>
            );
        case "processos_pf":
            return (
                <Tag colorScheme="blue" size="sm">
                    Processos PF
                </Tag>
            );
        case "protestos":
            return (
                <Tag colorScheme="red" size="sm">
                    Protestos
                </Tag>
            );
        case "protestos_sp":
            return (
                <Tag colorScheme="orange" size="sm">
                    Protestos SP
                </Tag>
            );
        case "cnd_federal":
            return (
                <Tag colorScheme="green" size="sm">
                    CND Federal
                </Tag>
            );
        case "cnd_estadual":
            return (
                <Tag colorScheme="teal" size="sm">
                    CND Estadual
                </Tag>
            );
        case "cnd_trabalhista_tst":
            return (
                <Tag colorScheme="yellow" size="sm">
                    CND Trabalhista TST
                </Tag>
            );
        case "cnd_trabalhista_mte":
            return (
                <Tag colorScheme="pink" size="sm">
                    CND Trabalhista MTE
                </Tag>
            );
        case "receita_cnpj":
            return (
                <Tag colorScheme="cyan" size="sm">
                    Receita CNPJ
                </Tag>
            );
        case "receita_cnpj_qsa":
            return (
                <Tag colorScheme="gray" size="sm">
                    Receita CNPJ QSA
                </Tag>
            );
        case "receita_cpf":
            return (
                <Tag colorScheme="brown" size="sm">
                    Receita CPF
                </Tag>
            );
        default:
            return (
                <Tag colorScheme="gray" size="sm">
                    Desconhecido
                </Tag>
            );
    }
};
