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

export const PessoaPoliticamenteExposta = ({ data }: SancoesProps) => {
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
                    Pessoa Exposta Politicamente ou Possui Algum Vínculo
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                    <Flex gap={8} flexWrap="wrap">
                        <Text>Fonte: </Text>
                        <Text>Tipo:</Text>
                        <Text>:</Text>
                        <Text>:</Text>
                        <Text>:</Text>
                        <Text>:</Text>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
