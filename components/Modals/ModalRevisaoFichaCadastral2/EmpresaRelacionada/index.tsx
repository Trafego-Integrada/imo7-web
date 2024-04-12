import {
    Flex,
    Text,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
} from "@chakra-ui/react";

interface IEmpresaRelacionada {
    entidadeRelacionadaDocumento: string;
    entidadeRelacionadadaTipoDeDocumento: string;
    entidadeRelacionadaPais: string;
    entidadeRelacionadaNome: string;
    tipoDeRelacionamento: string;
    nivelDeRelacionamento: string;
    dataInicioRelacionamento: string;
    dataFimRelacionamento: string;
    dataCriacao: string;
    ultimaAtualizacao: string;
}

export interface IConsultaEmpresaRelacionada {
    cpf: string;
    empresasRelacionadasCPF: {
        negociosRelacionados: IEmpresaRelacionada[];
    };
}

interface EmpresaRelacionadaProps {
    data: IEmpresaRelacionada;
}

enum EnumTipoDeRelacionamento {
    OWNERSHIP = "PROPRIETÁRIO",
    EMPLOYMENT = "FUNCIONÁRIO",
    PARTNER = "SÓCIO",
    LEGALREPRESENTATIVE = "SÓCIO REPRESENTANTE",
}

const parseTipoDeRelacionamento = (
    tipo: string
): keyof typeof EnumTipoDeRelacionamento => {
    const tipoSemEspaco = tipo.replace(" ", "").toUpperCase();

    return tipoSemEspaco in EnumTipoDeRelacionamento
        ? (tipoSemEspaco as keyof typeof EnumTipoDeRelacionamento)
        : "OWNERSHIP";
};

export const EmpresaRelacionada = ({ data }: EmpresaRelacionadaProps) => {
    const tipoDeRelacionamento = parseTipoDeRelacionamento(
        data.tipoDeRelacionamento
    );

    const renderDetail = (label: string, value: string) => (
        <Text>
            {label}:{" "}
            <Text as="span" fontWeight="bold">
                {value}
            </Text>
        </Text>
    );

    return (
        <Accordion allowToggle display="flex" flexDir="column" gap={2}>
            <AccordionItem>
                <AccordionButton>
                    {data.entidadeRelacionadaNome} (
                    {EnumTipoDeRelacionamento[tipoDeRelacionamento]})
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                    <Flex gap={8} flexWrap="wrap">
                        {renderDetail(
                            "Documento",
                            data.entidadeRelacionadaDocumento
                        )}
                        {renderDetail(
                            "Tipo de Documento",
                            data.entidadeRelacionadadaTipoDeDocumento
                        )}
                        {renderDetail("País", data.entidadeRelacionadaPais)}
                        {renderDetail("Nome", data.entidadeRelacionadaNome)}
                        {renderDetail(
                            "Tipo de Relacionamento",
                            EnumTipoDeRelacionamento[tipoDeRelacionamento]
                        )}
                        {renderDetail(
                            "Nível de Relacionamento",
                            data.nivelDeRelacionamento
                        )}
                        {renderDetail(
                            "Início Relacionamento",
                            data.dataInicioRelacionamento
                        )}
                        {renderDetail(
                            "Fim Relacionamento",
                            data.dataFimRelacionamento
                        )}
                        {renderDetail("Data de Criação", data.dataCriacao)}
                        {renderDetail(
                            "Última Atualização",
                            data.ultimaAtualizacao
                        )}
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

