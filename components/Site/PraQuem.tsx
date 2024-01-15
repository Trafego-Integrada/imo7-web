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

export const PraQuem = ({ modal }) => {
    return (
        <Box
            bg="radial-gradient(232.42% 232.42% at 50% 50%, #012659 0%, rgba(0, 0, 0, 0.00) 100%), #03132B"
            pt={12}
        >
            <Container maxW="container.xl">
                <Flex textAlign="center" mb={4} gap={4} flexDir="column">
                    <Heading color="#FFF" fontSize="24px" fontWeight="500">
                        Para quem é{" "}
                    </Heading>
                    <Text color="#FFF" fontSize="32px" fontWeight="400">
                        O{" "}
                        <Text as="span" fontWeight="bold">
                            Imo7
                        </Text>{" "}
                        é a{" "}
                        <Text as="span" fontWeight="bold">
                            ferramenta
                        </Text>{" "}
                        para quem quer{" "}
                        <Text as="span" fontWeight="bold">
                            transformar a produtividade
                        </Text>
                        <br />
                        na sua imobiliária
                    </Text>
                </Flex>{" "}
                <Text color="#FFF" py={12}>
                    Você já imaginou quantas oportunidades perdeu por não ter um
                    atendimento rápido e informações facilitadas para o seu
                    cliente? <br />
                    <br />O Imo7 veio para atender quem:
                </Text>
                <Flex
                    align="center"
                    gap={8}
                    flexDir={{ base: "column", lg: "row" }}
                    justify="space-between"
                >
                    <Flex flexDir="column" gap={4} maxW="lg">
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#FFF">
                                Quer organizar os dados e ter acesso rápido a
                                informações sobre o imóvel, histórico de
                                clientes e negociações anteriores.{" "}
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#FFF">
                                Quer acompanhar o desempenho de locação, venda e
                                compra de imóveis e os motivos de reprovação e
                                desistência.
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#FFF">
                                Acompanhar os processos de locação, venda e
                                compra de imóveis de forma rápida e eficiente.
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#FFF">
                                Quer agilidade na consulta das informações
                                essenciais para o atendimento ao cliente.
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#FFF">
                                Aumentar a eficiência operacional de sua empresa
                                a medida que a carga de trabalho aumenta.
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
                    <Image src="/img/IMAGEM (1).png" alt="#" />
                </Flex>
            </Container>
        </Box>
    );
};
