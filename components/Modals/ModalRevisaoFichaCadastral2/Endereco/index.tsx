import {
    Flex,
    Text,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
} from "@chakra-ui/react";

interface IEndereco {
    logradouro: string;
    numero: string;
    bairro: string;
    complemento: string;
    cep: string;
    cidade: string;
    uf: string;
    pais: string;
    tipo: string;
    prioridade: number;
    vinculoRecente: boolean;
    latitude: number;
    longitude: number;
}

export interface IConsultaEndereco {
    cpf: string;
    enderecoCPF: {
        endereco: IEndereco[];
    };
}

interface EnderecoProps {
    data: IEndereco;
}

enum EnumTipo {
    WORK = "TRABALHO",
    HOME = "RESIDENCIAL"
}

const parseTipoDeRelacionamento = (
    tipo: string
): keyof typeof EnumTipo => {
    const tipoSemEspaco = tipo.replace(" ", "").toUpperCase()

    return tipoSemEspaco in EnumTipo
        ? tipoSemEspaco as keyof typeof EnumTipo
        : "WORK"
};

export const Endereco = ({ data }: EnderecoProps) => {
    const tipo = parseTipoDeRelacionamento(data.tipo)

    const renderDetail = (label: string, value: any) => (
        <Text>
            {label}:{" "}
            <Text as="span" fontWeight="bold">
                {typeof value === "boolean" ? (value ? "Sim" : "Não") : value}
            </Text>
        </Text>
    );

    return (
        <Accordion allowToggle display="flex" flexDir="column" gap={2}>
            <AccordionItem>
                <AccordionButton>
                    {data.logradouro}, {data.numero} - {data.bairro},{" "}
                    {data.cidade} - {data.uf}
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                    <Flex gap={8} flexWrap="wrap">
                        {renderDetail("Rua", data.logradouro)}
                        {renderDetail("Número", data.numero)}
                        {renderDetail("Bairro", data.bairro)}
                        {renderDetail("Complemento", data.complemento)}
                        {renderDetail("CEP", data.cep)}
                        {renderDetail("Cidade", data.cidade)}
                        {renderDetail("UF", data.uf)}
                        {renderDetail("País", data.pais)}
                        {renderDetail("Tipo", EnumTipo[tipo])}
                        {renderDetail("Prioridade", data.prioridade)}
                        {renderDetail("Vínculo recente", data.vinculoRecente)}
                        {renderDetail("Latitude", data.latitude)}
                        {renderDetail("Longitude", data.longitude)}
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
