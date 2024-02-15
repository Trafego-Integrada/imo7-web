import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    Image,
    Text,
} from "@chakra-ui/react";
import { FaWhatsappSquare } from "react-icons/fa";
import {
    MdAdsClick,
    MdElectricBolt,
    MdMessage,
    MdTrendingUp,
} from "react-icons/md";

export const ComoFunciona2 = ({ modal }) => {
    return (
        <Box bg="#F6FDFF" py={12}>
            <Container
                maxW="container.xl"
                bg="#F6FDFF"
                pt={{ lg: 12 }}
                py={{ base: 12, lg: 0 }}
            >
                <Flex textAlign="center" mb={4} gap={4} flexDir="column">
                    <Text>
                        Seu tempo é valioso, e conversar o dia todo pelo
                        WhatsApp pode ser cansativo. Com o IMO7, não perca mais
                        tempo com conversas demoradas. Foque em fechar mais
                        contratos de locação e agilize suas negociações de forma
                        eficiente.
                    </Text>
                </Flex>
                <Flex
                    align="center"
                    flexDir={{ base: "column", lg: "row" }}
                    gap={8}
                >
                    <Image src="/img/IMAGEM (3).png" alt="#" />
                    <Flex flexDir="column" gap={4}>
                        <Grid
                            gridTemplateColumns="repeat(2,1fr)"
                            borderColor="gray.500"
                        >
                            <GridItem
                                p={2}
                                borderWidth={1}
                                borderColor="#DDDDDD"
                                p={2}
                            >
                                <Flex align="center" gap={2}>
                                    <Icon
                                        as={MdMessage}
                                        fontSize="3xl"
                                        color="#73C4E1"
                                    />
                                    <Heading color="#021531" fontSize="lg">
                                        Eficiência na Comunicação:
                                    </Heading>
                                </Flex>
                                <Text>
                                    Diminui a necessidade de longas trocas de
                                    mensagens, permitindo que as interações
                                    sejam mais objetivas e diretas.
                                </Text>
                            </GridItem>
                            <GridItem
                                bg="#F5F5F5"
                                borderWidth={1}
                                borderColor="#DDDDDD"
                                p={2}
                            >
                                <Flex align="center" gap={2}>
                                    <Icon
                                        as={MdAdsClick}
                                        fontSize="3xl"
                                        color="#73C4E1"
                                    />
                                    <Heading color="#021531" fontSize="lg">
                                        Foco nos clientes ideais:
                                    </Heading>
                                </Flex>
                                <Text>
                                    Concentra o tempo e a energia em fechar
                                    contratos, evitando dispersão em conversas
                                    prolongadas e pouco produtivas.
                                </Text>
                            </GridItem>
                            <GridItem
                                bg="#F5F5F5"
                                borderWidth={1}
                                borderColor="#DDDDDD"
                                p={2}
                            >
                                <Flex align="center" gap={2}>
                                    <Icon
                                        as={MdElectricBolt}
                                        fontSize="3xl"
                                        color="#73C4E1"
                                    />
                                    <Heading color="#021531" fontSize="lg">
                                        Respostas Rápidas:
                                    </Heading>
                                </Flex>
                                <Text>
                                    Agiliza a resposta às demandas dos clientes,
                                    o que pode acelerar o processo de locação.
                                </Text>
                            </GridItem>
                            <GridItem
                                borderWidth={1}
                                borderColor="#DDDDDD"
                                p={2}
                            >
                                <Flex align="center" gap={2}>
                                    <Icon
                                        as={MdTrendingUp}
                                        fontSize="3xl"
                                        color="#73C4E1"
                                    />
                                    <Heading color="#021531" fontSize="lg">
                                        Aumento da Produtividade:
                                    </Heading>
                                </Flex>
                                <Text>
                                    Libera tempo antes gasto em conversas para
                                    atividades mais estratégicas,
                                    potencializando a eficiência na gestão de
                                    contratos de locação.
                                </Text>
                            </GridItem>
                        </Grid>
                    </Flex>
                </Flex>
                <Flex justify="center">
                    <Button
                        onClick={() => modal.current.onOpen()}
                        colorScheme="whatsapp"
                        rightIcon={<FaWhatsappSquare />}
                    >
                        Solicitar demonstração
                    </Button>
                </Flex>
            </Container>
        </Box>
    );
};
