import { Tag, Tooltip } from '@chakra-ui/react'
import moment from 'moment'

export const formatoData = (data: any, tipo = 'DATA', utc = true) => {
    switch (tipo) {
        case 'DATA':
            return moment(data).utc(utc).format('DD/MM/YYYY')
        case 'HORA':
            return moment(data).utc(utc).format('HH:mm:ss')
        case 'DATA_HORA':
            return moment(data).utc(utc).format('DD/MM/YYYY HH:mm:ss')
        default:
            return moment(data).utc(utc).format('DD [de] MMMM [de] YYYY')
    }
}

export const formatoValor = (valor: any) => {
    return Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(valor))
}
export function includesAll(arr: any[], items: any[]) {
    for (const item of items) {
        if (!arr.includes(item)) {
            return false
        }
    }
    return true
}
export function nl2br({ str, is_xhtml }: any) {
    var breakTag =
        is_xhtml || typeof is_xhtml === 'undefined' ? '<br ' + '/>' : '<br>' // Adjust comment to avoid issue on phpjs.org display

    return (str + '').replace(
        /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
        '$1' + breakTag + '$2',
    )
}

export const tagStatusChamado = (status: any) => {
    switch (status) {
        case 'ABERTO':
            return (
                <Tag colorScheme="orange" size="sm">
                    Aberto
                </Tag>
            )

        case 'FINALIZADO':
            return (
                <Tag colorScheme="green" size="sm">
                    Finalizado
                </Tag>
            )
        case 'ARQUIVADO':
            return (
                <Tag colorScheme="gray" size="sm">
                    Arquivado
                </Tag>
            )
    }
}

export const statusTarefa = (status: any) => {
    switch (status) {
        case 'finalizada':
            return (
                <Tag colorScheme="gray" size="sm">
                    Finalizada
                </Tag>
            )
        case 'aberta':
            return (
                <Tag colorScheme="blue" size="sm">
                    Aberta
                </Tag>
            )
        case 'em_analise':
            return (
                <Tag colorScheme="orange" size="sm">
                    Em análise
                </Tag>
            )
        case 'aprovada':
            return (
                <Tag colorScheme="green" size="sm">
                    Aprovado
                </Tag>
            )
        case 'reprovada':
            return (
                <Tag colorScheme="red" size="sm">
                    Reprovada
                </Tag>
            )
        case 'arquivada':
            return (
                <Tag colorScheme="gray" size="sm">
                    Arquivada
                </Tag>
            )
    }
}
export const statusFicha = (status: any) => {
    switch (status) {
        case 'aguardando':
            return (
                <Tag colorScheme="blue" size="sm">
                    Aguardando Preenchimento
                </Tag>
            )
        case 'preenchida':
            return (
                <Tag colorScheme="green" size="sm">
                    Preenchida
                </Tag>
            )
        case 'em_analise':
            return (
                <Tag colorScheme="orange" size="sm">
                    Em análise
                </Tag>
            )
        case 'aprovada':
            return (
                <Tag colorScheme="green" size="sm">
                    Aprovado
                </Tag>
            )
        case 'reprovada':
            return (
                <Tag colorScheme="red" size="sm">
                    Reprovada
                </Tag>
            )
        case 'arquivada':
            return (
                <Tag colorScheme="gray" size="sm">
                    Arquivada
                </Tag>
            )
        case 'locado':
            return (
                <Tag colorScheme="green" size="sm">
                    Locado
                </Tag>
            )
        case 'desistente':
            return (
                <Tag colorScheme="gray" size="sm">
                    Desistente
                </Tag>
            )
        case 'reprovado_por_analise_interna':
            return (
                <Tag colorScheme="red" size="sm">
                    Reprovado por Análise Interna
                </Tag>
            )
        case 'renda_insuficiente':
            return (
                <Tag colorScheme="red" size="sm">
                    Renda Insuficiente
                </Tag>
            )
    }
}
export const statusFichaTag = (status: any) => {
    switch (status) {
        case 'aguardando':
            return (
                <Tooltip label="Aguardando Preenchimento">
                    <Tag colorScheme="blue" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
        case 'preenchida':
            return (
                <Tooltip label="Preenchida">
                    <Tag colorScheme="green" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
        case 'em_analise':
            return (
                <Tooltip label="Em análise">
                    <Tag colorScheme="orange" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
        case 'aprovada':
            return (
                <Tooltip label="Aprovado">
                    <Tag colorScheme="green" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
        case 'reprovada':
            return (
                <Tooltip label="Reprovada">
                    <Tag colorScheme="red" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
        case 'arquivada':
            return (
                <Tooltip label="Arquivada">
                    <Tag colorScheme="gray" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
        case 'locado':
            return (
                <Tooltip label="Locado">
                    <Tag colorScheme="green" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
        case 'desistente':
            return (
                <Tooltip label="Desistente">
                    <Tag colorScheme="gray" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
        case 'reprovado_por_analise_interna':
            return (
                <Tooltip label="Reprovado por Análise Interna">
                    <Tag colorScheme="red" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
        case 'renda_insuficiente':
            return (
                <Tooltip label="Renda Insuficiente">
                    <Tag colorScheme="red" size="sm" rounded="full"></Tag>
                </Tooltip>
            )
    }
}
export const statusProcesso = (status: any) => {
    switch (status) {
        case 'EM_ANDAMENTO':
            return (
                <Tag colorScheme="orange" size="sm">
                    Em andamento
                </Tag>
            )
        case 'EM_ANALISE':
            return (
                <Tag colorScheme="blue" size="sm">
                    Em análise
                </Tag>
            )
        case 'REPROVADO':
            return (
                <Tag colorScheme="red" size="sm">
                    Reprovado
                </Tag>
            )
        case 'COMPLETO':
            return (
                <Tag colorScheme="blue" size="sm">
                    Completo
                </Tag>
            )
        case 'APROVADO':
            return (
                <Tag colorScheme="green" size="sm">
                    Aprovado
                </Tag>
            )
        case 'CANCELADO':
            return (
                <Tag colorScheme="yellow" size="sm">
                    Cancelado
                </Tag>
            )
        case 'ARQUIVADO':
            return (
                <Tag colorScheme="gray" size="sm">
                    Arquivada
                </Tag>
            )
        case 'LOCADO':
            return (
                <Tag colorScheme="gray" size="sm">
                    Locado
                </Tag>
            )
        case 'DESISTENTE':
            return (
                <Tag colorScheme="gray" size="sm">
                    Desistente
                </Tag>
            )
    }
}

export const tipoFicha = (tipo: any) => {
    switch (tipo) {
        case 'inquilino':
            return 'Cadastro de Inquilino'
        case 'proprietario':
            return 'Cadastro de Proprietário'
        case 'fiador':
            return 'Cadastro de Fiador'
        case 'imovel':
            return 'Cadastro de Imóvel'
        case 'comprador':
            return 'Cadastro de Comprador'
        case 'vendedor':
            return 'Cadastro de Vendedor'
        case 'visita':
            return 'Cadastro de Visita'
    }
}

export const tipoEnvioReguaCobranca = (tipo: any) => {
    switch (tipo) {
        case 'antesVencimento':
            return 'Antes do Vencimento'
        case 'diaVencimento':
            return 'Dia do Vencimento'
    }
}

export const tipoReguaCobranca = (tipo: any) => {
    switch (tipo) {
        case 'boleto':
            return 'Boleto'
        case 'extrato':
            return 'Extrato'
    }
}

export const formaEnvioReguaCobranca = (tipo: any) => {
    switch (tipo) {
        case 'email':
            return 'E-mail'
        case 'sms':
            return 'SMS'
        case 'whatsapp':
            return 'WhatsApp'
    }
}

export const arrayStatusFicha = [
    {
        label: 'Aguardando Preenchimento',
        value: 'aguardando',
    },
    {
        label: 'Preenchida',
        value: 'preenchida',
    },
    {
        label: 'Em análise',
        value: 'em_analise',
    },
    {
        label: 'Aprovada',
        value: 'aprovada',
    },
    {
        label: 'Reprovada',
        value: 'reprovada',
    },
    {
        label: 'Arquivada',
        value: 'arquivada',
    },
    {
        label: 'Locado',
        value: 'locado',
    },
    {
        label: 'Desistente',
        value: 'desistente',
    },
]
export function removerCaracteresEspeciais(string) {
    return string?.replace(/[^a-zA-Z0-9]/g, '')
}
export function TestaCPF(strCPF: string) {
    var Soma
    var Resto
    Soma = 0
    if (strCPF == '00000000000') return false

    let i: any

    for (i = 1; i <= 9; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0
    if (Resto != parseInt(strCPF.substring(9, 10))) return false

    Soma = 0
    for (i = 1; i <= 10; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0
    if (Resto != parseInt(strCPF.substring(10, 11))) return false
    return true
}

export const tagTipoConsultaNetrin = (tipo: string) => {
    switch (tipo) {
        case 'processos_pj':
            return (
                <Tag colorScheme="purple" size="sm">
                    Processos PJ
                </Tag>
            )
        case 'processos_pf':
            return (
                <Tag colorScheme="blue" size="sm">
                    Processos PF
                </Tag>
            )
        case 'protestos_pf':
            return (
                <Tag colorScheme="red" size="sm">
                    Protestos PF
                </Tag>
            )
        case 'protestos_pj':
            return (
                <Tag colorScheme="red" size="sm">
                    Protestos PJ
                </Tag>
            )
        case 'protestos_sp':
            return (
                <Tag colorScheme="orange" size="sm">
                    Protestos SP
                </Tag>
            )
        case 'cnd_federal':
            return (
                <Tag colorScheme="green" size="sm">
                    CND Federal
                </Tag>
            )
        case 'cnd_estadual':
            return (
                <Tag colorScheme="teal" size="sm">
                    CND Estadual
                </Tag>
            )
        case 'cnd_trabalhista_tst':
            return (
                <Tag colorScheme="yellow" size="sm">
                    CND Trabalhista TST
                </Tag>
            )
        case 'cnd_trabalhista_mte':
            return (
                <Tag colorScheme="pink" size="sm">
                    CND Trabalhista MTE
                </Tag>
            )
        case 'receita_cnpj':
            return (
                <Tag colorScheme="cyan" size="sm">
                    Receita CNPJ
                </Tag>
            )
        case 'receita_cnpj_qsa':
            return (
                <Tag colorScheme="gray" size="sm">
                    Receita CNPJ QSA
                </Tag>
            )
        case 'receita_cpf':
            return (
                <Tag colorScheme="brown" size="sm">
                    Receita CPF
                </Tag>
            )
        default:
            return (
                <Tag colorScheme="gray" size="sm">
                    Desconhecido
                </Tag>
            )
    }
}
// Função para converter arquivo para base64
export async function convertToBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function (e: any) {
            resolve(e.target.result.split(',')[1])
        }
        reader.onerror = function (error) {
            reject(error)
        }
        reader.readAsDataURL(file)
    })
}

// Função para obter a extensão do arquivo
export function getFileExtension(filename: any) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}
export function verificarExtensaoImagem(link: any) {
    // Lista de extensões de imagem suportadas
    const extensoesImagem = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.svg',
        '.webp',
    ]

    // Verifica se o link termina com alguma extensão de imagem
    for (const extensao of extensoesImagem) {
        if (link.toLowerCase().endsWith(extensao)) {
            return { eImagem: true, extensao: extensao }
        }
    }

    // Se não encontrar nenhuma extensão de imagem, retorna a extensão do arquivo
    const extensaoArquivo = link.substring(link.lastIndexOf('.'))
    return { eImagem: false, extensao: extensaoArquivo }
}
