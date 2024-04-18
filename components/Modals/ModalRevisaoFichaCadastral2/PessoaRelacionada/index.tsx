import { formatarParaDataBR } from "@/utils/formatarParaDataBR";
import {
    Flex,
    Text,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
} from "@chakra-ui/react";

interface IPessoaRelacionada {
    entidadeRelacionadaDocumento: string;
    entidadeRelacionadadaTipoDeDocumento: string;
    entidadeRelacionadaPais: string;
    entidadeRelacionadaNome: string;
    tipoDeRelacionamento: string;
    vinculoDoRelacionamento: string;
    nivelDeRelacionamento: string;
    origemRelacionamento: string;
    dataInicioRelacionamento: string;
    dataFimRelacionamento: string;
    dataCriacao: string;
    ultimaAtualizacao: string;
}

export interface IConsultaPessoaRelacionada {
    cnpj: string;
    pessoasRelacionadasCNPJ: {
        entidadesRelacionadas: IPessoaRelacionada[];
    };
}

interface PessoaRelacionadaProps {
    data: IPessoaRelacionada;
}

export const PessoaRelacionada = ({ data }: PessoaRelacionadaProps) => {
    const tipoDeRelacionamento =
        data.tipoDeRelacionamento === "Employee"
            ? "FUNCIONÁRIO"
            : data.tipoDeRelacionamento;

    const renderDetail = (label: string, value: any) => (
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
                    {data.entidadeRelacionadaNome} {`(${tipoDeRelacionamento})`}
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
                            tipoDeRelacionamento
                        )}
                        {renderDetail(
                            "Origem Relacionamento",
                            data.origemRelacionamento
                        )}
                        {renderDetail(
                            "Vínculo Relacionamento",
                            data.vinculoDoRelacionamento
                        )}
                        {renderDetail(
                            "Nível de Relacionamento",
                            data.nivelDeRelacionamento
                        )}
                        {renderDetail(
                            "Início Relacionamento",
                            formatarParaDataBR(data.dataInicioRelacionamento)
                        )}
                        {renderDetail(
                            "Fim Relacionamento",
                            formatarParaDataBR(data.dataFimRelacionamento)
                        )}
                        {renderDetail("Data de Criação", formatarParaDataBR(data.dataCriacao))}
                        {renderDetail(
                            "Última Atualização",
                            formatarParaDataBR(data.ultimaAtualizacao)
                        )}
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

