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

export const ComoFunciona = () => {
    return (
        <Box bg="#F6FDFF">
            <Container
                maxW="container.xl"
                pt={{ lg: 12 }}
                py={{ base: 12, lg: 0 }}
            >
                <Flex textAlign="center" mb={4} gap={4} flexDir="column">
                    <Heading color="#032552" fontSize="24px" fontWeight="500">
                        Como funciona
                    </Heading>
                    <Text color="#021531" fontSize="32px" fontWeight="normal">
                        Quantas <strong>oportunidades</strong> de venda e
                        locação já não foram perdidas pela falta de um
                        atendimento <strong>rápido</strong> e de informações
                        <strong>facilitadas</strong> para o cliente?
                    </Text>
                    <Text>
                        Com apenas um link você resolve tudo! Fica menos
                        exaustivo para sua equipe e mais fácil e rápido para o
                        cliente.
                    </Text>
                    <Text fontWeight="bold">No IMO7 você terá:</Text>
                </Flex>
                <Flex
                    align="center"
                    flexDir={{ base: "column", lg: "row" }}
                    gap={8}
                >
                    <Image src="/img/IMAGEM.png" alt="#" />
                    <Flex flexDir="column" gap={4}>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#021531">
                                Todo o preenchimento de dados em um só lugar,
                                através de um link que será enviado para o
                                cliente.
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#021531">
                                Você terá uma ficha responsiva, podendo ser
                                acessada de qualquer dispositivo.
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#021531">
                                Vai conseguir saber o histórico judicial do
                                cliente sem precisar pesquisar estado por
                                estado.
                            </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#021531">
                                Terá validação facial com consulta direta na
                                base da Receita Federal garantindo mais
                                segurança na transação
                            </Text>
                        </Flex>{" "}
                        <Flex align="center" gap={2}>
                            <Icon
                                as={FiCheckCircle}
                                color="#77BA89"
                                fontSize={16}
                            />
                            <Text color="#021531">
                                Vai economizar tempo com um atendimento mais
                                rápido e fechar mais contratos.
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
