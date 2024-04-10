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
    const [open, setOpen] = useState(false);
    const tipoDeRelacionamento = data.tipoDeRelacionamento === 'Employee' ? 'FUNCIONÁRIO' : data.tipoDeRelacionamento

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
                    {data.entidadeRelacionadaNome} {`(${tipoDeRelacionamento})`}
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
                            Origem Relacionamento: <Text fontWeight="bold">{data.origemRelacionamento}</Text>
                        </Text>

                        <Text>
                            Vínculo Relacionamento: <Text fontWeight="bold">{data.vinculoDoRelacionamento}</Text>
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
