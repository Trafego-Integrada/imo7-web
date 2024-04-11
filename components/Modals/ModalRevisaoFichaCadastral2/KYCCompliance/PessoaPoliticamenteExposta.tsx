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

export interface IPessoaPoliticamenteExposta {
    level: string;
    jobTitle: string;
    department: string;
    motive: string;
    startDate: string;
    endDate: string;
}

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

interface PessoaPoliticamenteExpostaProps {
    data: IPessoaPoliticamenteExposta;
}

export const PessoaPoliticamenteExposta = ({ data }: PessoaPoliticamenteExpostaProps) => {
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
                        <Text>Nível: {data.level}</Text>
                        <Text>Cargo: {data.jobTitle}</Text>
                        <Text>Departamento: {data.department}</Text>
                        <Text>Motivo: {data.motive}</Text>
                        <Text>Data de início: {data.startDate}</Text>
                        <Text>Data final: {data.endDate}</Text>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
