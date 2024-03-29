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
import { IConsultaEndereco } from "../../Consulta2";

interface EnderecoProps {
    data: IConsultaEndereco;
}

export const Endereco = ({ data }: EnderecoProps) => {
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
                    {data.logradouro}, {data.numero} - {data.bairro},{" "}
                    {data.cidade} - {data.uf}
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                    <Flex gap={8} flexWrap="wrap">
                        <Text>
                            Rua:{" "}
                            <Text fontWeight="bold">{data.logradouro}</Text>
                        </Text>

                        <Text>
                            Número: <Text fontWeight="bold">{data.numero}</Text>
                        </Text>

                        <Text>
                            Bairro: <Text fontWeight="bold">{data.bairro}</Text>
                        </Text>

                        <Text>
                            Complemento:{" "}
                            <Text fontWeight="bold">{data.complemento}</Text>
                        </Text>

                        <Text>
                            CEP: <Text fontWeight="bold">{data.cep}</Text>
                        </Text>

                        <Text>
                            Cidade: <Text fontWeight="bold">{data.cidade}</Text>
                        </Text>

                        <Text>
                            UF: <Text fontWeight="bold">{data.uf}</Text>
                        </Text>

                        <Text>
                            País: <Text fontWeight="bold">{data.pais}</Text>
                        </Text>

                        <Text>
                            Tipo: <Text fontWeight="bold">{data.tipo}</Text>
                        </Text>

                        <Text>
                            Prioridade:{" "}
                            <Text fontWeight="bold">{data.prioridade}</Text>
                        </Text>

                        <Text>
                            Vínculo recente:{" "}
                            <Text fontWeight="bold">{data.vinculoRecente}</Text>
                        </Text>

                        <Text>
                            Latitude:{" "}
                            <Text fontWeight="bold">{data.latitude}</Text>
                        </Text>

                        <Text>
                            Longitude:{" "}
                            <Text fontWeight="bold">{data.longitude}</Text>
                        </Text>
                    </Flex>

                    <Flex
                        marginTop={4}
                        border="2px"
                        borderColor="blue.500"
                        borderStyle="solid"
                        borderRadius={4}
                    >
                        <iframe
                            src={`https://www.google.com/maps?q=${data.latitude},${data.longitude}&hl=es;z=14&output=embed`}
                            width="100%"
                            height="500"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
