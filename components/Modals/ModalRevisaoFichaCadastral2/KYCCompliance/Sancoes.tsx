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

export interface ISancoes {
    source: string;
    type: string;
    standardizedSanctionType: string;
    matchRate: number;
    nameUniquenessScore: number;
    startDate: string;
    endDate: string;
    details?: any;
}

interface SancoesProps {
    data: ISancoes;
}

export const Sancoes = ({ data }: SancoesProps) => {
    const [open, setOpen] = useState(false);

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
                    Sanções
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                    <Flex gap={8} flexWrap="wrap">
                        <Text>Fonte: {data.source}</Text>
                        <Text>Tipo: {data.type}</Text>
                        <Text>Tipo de sanção padronizado: {data.standardizedSanctionType}</Text>
                        <Text>Taxa de correspondência: {data.matchRate}</Text>
                        <Text>Nome pontuação de exclusividade: {data.nameUniquenessScore}</Text>
                        <Text>Data de início: {data.startDate}</Text>
                        <Text>Data final: {data.endDate}</Text>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
