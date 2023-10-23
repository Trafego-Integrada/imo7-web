import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Image,
    Text,
} from "@chakra-ui/react";
import { FaCheckCircle, FaWhatsappSquare } from "react-icons/fa";
import { FiCheckCircle, FiCheckSquare } from "react-icons/fi";

export const FichasCadastrais = () => {
    return (
        <Box bg="#F6FDFF">
            <Container maxW="container.xl" py={12}>
                <Flex textAlign="center" mb={4} gap={4} flexDir="column">
                    <Heading color="#032552" fontSize="24px" fontWeight="500">
                        Fichas Cadastrais Online
                    </Heading>
                    <Text color="#021531" fontSize="32px">
                        A{" "}
                        <Text as="span" fontWeight="bold">
                            sua imobiliária
                        </Text>
                        vai{" "}
                        <Text as="span" fontWeight="bold">
                            ganhar mais desempenho
                        </Text>{" "}
                        e ter{" "}
                        <Text as="span" fontWeight="bold">
                            mais organização
                        </Text>
                    </Text>
                </Flex>
                <Text>
                    A funcionalidade de{" "}
                    <strong>Fichas Cadastrais Online</strong> oferece uma
                    abordagem <strong>moderna</strong> e{" "}
                    <strong>eficiente</strong> para{" "}
                    <strong>
                        coletar, validar e processar informações vitais
                    </strong>{" "}
                    para <strong>análises na imobiliária</strong>. Com uma série
                    de recursos intuitivos, essa ferramenta se destaca por sua
                    <strong>capacidade</strong> de <strong>simplificar</strong>{" "}
                    e<strong>acelerar</strong> todo o{" "}
                    <strong>processo de cadastro</strong> e{" "}
                    <strong>análise de inquilinos</strong>.
                </Text>
                <Flex
                    align="center"
                    gap={8}
                    flexDir={{ base: "column", lg: "row" }}
                >
                    <Image src="/img/laptop-cellphone 1.png" alt="#" />
                    <Flex flexDir="column" gap={4}>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#021531">
                                Geração de fichas personalizadas para
                                inquilinos, fiadores, compradores e
                                proprietários;
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#021531">
                                Validação campo a campo com possibilidade de
                                aprovar e reprovar dados online junto com os
                                clientes;
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#021531">
                                Associação de imóveis e endereços facilitando a
                                identificação das fichas;
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#021531">
                                Anexação de documentos essenciais como selfie,
                                documentos e comprovantes do cliente.
                            </Text>
                        </Flex>
                        <Button
                            colorScheme="whatsapp"
                            rightIcon={<FaWhatsappSquare />}
                        >
                            Solicitar demonstração
                        </Button>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};
