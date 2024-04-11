import { useState } from "react";
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

const enumTipoDeRelacionamento = {
    OWNERSHIP: 'PROPRIETÁRIO',
    EMPLOYMENT: 'FUNCIONÁRIO',
    PARTNER: 'SÓCIO',
    LEGALREPRESENTATIVE: 'SÓCIO REPRESENTANTE'
}

export const EmpresaRelacionada = ({ data }: EmpresaRelacionadaProps) => {
    const [open, setOpen] = useState(false);

    const tipoDeRelacionamento = data.tipoDeRelacionamento.replace(' ', '') as 'OWNERSHIP' | 'EMPLOYMENT' | 'PARTNER' | 'LEGALREPRESENTATIVE'

    return (
        <Accordion
            allowToggle
            display="flex"
            flexDir="column"
            gap={2}
            onChange={() => setOpen(!open)}
        >
            <AccordionItem>
                <AccordionButton onClick={() => setOpen(!open)}>
                    {data.entidadeRelacionadaNome} ({enumTipoDeRelacionamento[tipoDeRelacionamento]})
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                    <Flex gap={8} flexWrap="wrap">
                        <Text>
                            Documento:{" "}
                            <Text fontWeight="bold">{data.entidadeRelacionadaDocumento}</Text>
                        </Text>

                        <Text>
                            Tipo de Documento: <Text fontWeight="bold">{data.entidadeRelacionadadaTipoDeDocumento}</Text>
                        </Text>

                        <Text>
                            País: <Text fontWeight="bold">{data.entidadeRelacionadaPais}</Text>
                        </Text>

                        <Text>
                            Nome:{" "}
                            <Text fontWeight="bold">{data.entidadeRelacionadaNome}</Text>
                        </Text>

                        <Text>
                            Tipo de Relacionamento: <Text fontWeight="bold">{data.tipoDeRelacionamento}</Text>
                        </Text>

                        <Text>
                            Nível de Relacionamento: <Text fontWeight="bold">{data.nivelDeRelacionamento}</Text>
                        </Text>

                        <Text>
                            Início Relacionamento: <Text fontWeight="bold">{data.dataInicioRelacionamento}</Text>
                        </Text>

                        <Text>
                            Fim Relacionamento: <Text fontWeight="bold">{data.dataFimRelacionamento}</Text>
                        </Text>

                        <Text>
                            Data de Criação: <Text fontWeight="bold">{data.dataCriacao}</Text>
                        </Text>

                        <Text>
                            Ultima Atualização:{" "}
                            <Text fontWeight="bold">{data.ultimaAtualizacao}</Text>
                        </Text>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
