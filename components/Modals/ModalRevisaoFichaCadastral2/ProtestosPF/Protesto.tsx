import { Accordion, AccordionButton, AccordionIcon, AccordionPanel, Flex, Text } from "@chakra-ui/react";
import { IProtesto } from "./Modal";
import { formatoData } from "@/helpers/helpers";

export function Protesto(data: IProtesto) {
    return (
        <Accordion allowToggle display="flex" flexDir="column" gap={2} border='solid 1px'>
            <AccordionButton>
                Data do Protesto: {data.dataProtesto}
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                <Flex gap={8} flexWrap="wrap">
                    <Text>CPF/CNPJ: {data.cpfCnpj}</Text>
                    <Text>Data: {formatoData(data.data)}</Text>
                    <Text>Data do Protesto: {formatoData(data.dataProtesto)}</Text>
                    <Text>Data do Vencimento: {data.dataVencimento && formatoData(data.dataVencimento)}</Text>
                    <Text>Valor: {data.valor}</Text>
                </Flex>
            </AccordionPanel>
        </Accordion>
    )
}