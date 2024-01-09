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
    List,
    ListIcon,
    ListItem,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { FaCheckCircle, FaWhatsappSquare } from "react-icons/fa";
import { FiCheck, FiCheckCircle, FiCheckSquare } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

export const Planos = () => {
    const planos = [
        {
            plano: "Start",
            valor: 99,
            itens: [
                "20 Processos Cadastrais",
                "30 Consultas Simples",
                "2 Usuários",
                "1 GB de Armazenamento",
            ],
        },
        {
            plano: "Startup",
            valor: 159,
            itens: [
                "40 Processos Cadastrais",
                "60 Consultas Simples",
                "3 Usuários",
                "2 GB de Armazenamento",
            ],
        },
        {
            plano: "Plus",
            valor: 199,
            itens: [
                "60 Processos Cadastrais",
                "100 Consultas Simples",
                "5 Usuários",
                "3 GB de Armazenamento",
            ],
        },
        {
            plano: "Pro",
            valor: 259,
            itens: [
                "80 Processos Cadastrais",
                "120 Consultas Simples",
                "10 Usuários",
                "4 GB de Armazenamento",
            ],
            destaque: true,
        },
    ];
    return (
        <Container maxW="container.xl" py={12}>
            <Heading textAlign="center">
                Preço simplificado, zero compromisso
            </Heading>
            <Text textAlign="center">
                Escolha o plano que melhor se adapta ao seu negócio.
                <br /> Comece gratuitamente e atualize quando quiser.
            </Text>
            <Grid
                gridTemplateColumns={{
                    base: "repeat(1,1fr)",
                    md: "repeat(2,1fr)",
                    xl: "repeat(4,1fr)",
                }}
            >
                {planos.map((i, k) => (
                    <GridItem key={k}>
                        <Flex
                            bg={
                                i.destaque
                                    ? "radial-gradient(50% 50% at 50% 50%, #012659 0%, rgba(1, 38, 89, 0.00) 100%), #021D44;"
                                    : "white"
                            }
                            color={!i.destaque ? "#021D44;" : "white"}
                            rounded="xl"
                            p={8}
                            flexDir="column"
                            justify="center"
                            align="center"
                        >
                            <Box>
                                <Text fontWeight="bold" lineHeight={1}>
                                    {i.plano}
                                </Text>
                                <Flex align="center" gap={1}>
                                    <Text fontSize="4xl" fontWeight="bold">
                                        R$ {i.valor}
                                    </Text>
                                    <Box>
                                        <Text lineHeight={1} fontSize="xs">
                                            BRL
                                        </Text>
                                        <Text lineHeight={1} fontSize="xs">
                                            Pago mensalmente
                                        </Text>
                                    </Box>
                                </Flex>
                            </Box>
                            <List spacing={4} mt={6}>
                                {i.itens.map((i, k) => (
                                    <ListItem key={k}>
                                        <ListIcon as={FiCheck} />
                                        {i}
                                    </ListItem>
                                ))}
                            </List>
                            {/* <Button rightIcon={<IoIosArrowForward />}>
                                Começar com o Plano {i.plano}
                            </Button> */}
                        </Flex>
                    </GridItem>
                ))}
            </Grid>
            <Table mt={12} variant="striped" size="sm">
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>Starter</Th>
                        <Th>Startup</Th>
                        <Th>Plus</Th>
                        <Th>Pro</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Valor validação Facial ( Unitário )</Td>
                        <Td>R$ 1,20</Td>
                        <Td>R$ 1,20</Td>
                        <Td>R$ 1,20</Td>
                        <Td>R$ 1,20</Td>
                    </Tr>
                    <Tr>
                        <Td>Consulta Simples Excedente Unitário</Td>

                        <Td>R$ 6,80</Td>
                        <Td>R$ 6,80</Td>
                        <Td>R$ 6,80</Td>
                        <Td>R$ 6,80</Td>
                    </Tr>
                    <Tr>
                        <Td>Espaço de armazenamento Blocos de 5GB</Td>
                        <Td>R$ 80,00</Td> <Td>R$ 80,00</Td> <Td>R$ 80,00</Td>{" "}
                        <Td>R$ 80,00</Td>
                    </Tr>
                </Tbody>
            </Table>
        </Container>
    );
};
