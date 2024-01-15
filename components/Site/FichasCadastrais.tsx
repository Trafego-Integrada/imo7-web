import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Image,
    Link,
    Text,
} from "@chakra-ui/react";
import { FaCheckCircle, FaWhatsappSquare } from "react-icons/fa";
import { FiCheckCircle, FiCheckSquare } from "react-icons/fi";

export const FichasCadastrais = ({ modal }) => {
    return (
        <Box id="solucoes" bg="#F6FDFF">
            <Container maxW="container.xl" py={12}>
                <Flex textAlign="center" mb={4} gap={4} flexDir="column">
                    <Heading
                        color="#032552"
                        fontSize="24px"
                        fontWeight="500"
                        my={8}
                    >
                        Fichas Cadastrais Online
                    </Heading>
                    <Text
                        color="#021531"
                        fontSize="32px"
                        fontWeight="normal"
                        my={8}
                    >
                        Melhore o <strong>desempenho</strong> da sua equipe e
                        deixe a sua gestão de clientes mais{" "}
                        <strong>organizada</strong> com as{" "}
                        <strong>Fichas Cadastrais Online!</strong>
                    </Text>
                </Flex>
                <Text>
                    A funcionalidade de Fichas Cadastrais Online oferece uma
                    abordagem moderna e eficiente para coletar, validar e
                    processar informações vitais para análises na imobiliária.
                </Text>{" "}
                <Text>
                    Com uma série de recursos intuitivos, essa ferramenta se
                    destaca por sua capacidade de simplificar e acelerar todo o
                    processo de cadastro e análise de inquilinos.
                </Text>
                <Flex
                    my={12}
                    align="center"
                    gap={8}
                    flexDir={{ base: "column", lg: "row" }}
                >
                    <Image src="/img/laptop-cellphone 1.png" alt="#" />
                    <Flex flexDir="column" gap={4} mx={24}>
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
                            onClick={() => modal.current.onOpen()}
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
