import {
    Flex,
    Text,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
} from "@chakra-ui/react";

interface IReceitaFederalQsa {
    nome: string;
    qualificacao: string;
    nomeRepresentanteLegal: string;
    qualificacaoRepresentanteLegal: string;
    paisOrigem: string;
}

export interface IConsultaReceitaFederalQSA {
    cpf: string;
    receitaFederalQsa: {
        qsa: IReceitaFederalQsa[];
        urlComprovante: string
    };
}

interface ReceitaFederalQSAProps {
    data: IReceitaFederalQsa;
}

export const ReceitaFederalQSA = ({ data }: ReceitaFederalQSAProps) => {

    const renderDetail = (label: string, value: string) => (
        <Text>
            {label}: <strong>{value}</strong>
        </Text>
    );

    return (
        <Accordion allowToggle display="flex" flexDir="column" gap={2}>
            <AccordionItem>
                <AccordionButton>
                    {data.nome} ({data.qualificacao})
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                    <Flex gap={8} flexWrap="wrap">
                        {renderDetail(
                            "Nome",
                            data.nome
                        )}
                        {renderDetail(
                            "Qualificação",
                            data.qualificacao
                        )}
                        {renderDetail(
                            "Nome representante legal",
                            data.nomeRepresentanteLegal
                        )}
                        {renderDetail(
                            "Qualificacao representante legal",
                            data.qualificacaoRepresentanteLegal
                        )}
                        {renderDetail(
                            "País origem",
                            data.paisOrigem
                        )}
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

