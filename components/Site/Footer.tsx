import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Icon,
    Input,
    Select,
    Text,
} from "@chakra-ui/react";
import { FormSelect } from "../Form/FormSelect";
import { BiAlarm } from "react-icons/bi";

export const Footer = () => {
    return (
        <Box bg="#F6FDFF" py={24}>
            <Container maxW="container.xl">
                <Grid gap={6} gridTemplateColumns={{ lg: "repeat(3,1fr)" }}>
                    <GridItem w="sm">
                        <Heading
                            mb={4}
                            fontWeight="700"
                            fontStyle="normal"
                            fontSize="32px"
                        >
                            Entrar em contato
                        </Heading>
                        <Text>
                            Envie uma mensagem pra gente e vamos dar um retorno
                            assim que possível!
                        </Text>
                    </GridItem>
                    <GridItem w="full">
                        <Grid
                            gridTemplateColumns={{ lg: "repeat(2,1fr)" }}
                            gap={4}
                        >
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormControl>
                                    <FormLabel
                                        color="#021531"
                                        fontWeight="bold"
                                    >
                                        Motivo do contato
                                    </FormLabel>
                                    <Select
                                        bg="white"
                                        borderColor="#4B4B4B"
                                        placeholder="Selecione o motivo de seu contato"
                                    ></Select>
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormControl>
                                    <FormLabel
                                        color="#021531"
                                        fontWeight="bold"
                                    >
                                        Nome
                                    </FormLabel>
                                    <Input
                                        bg="white"
                                        borderColor="#4B4B4B"
                                        placeholder="Digite seu nome completo"
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel
                                        color="#021531"
                                        fontWeight="bold"
                                    >
                                        E-mail
                                    </FormLabel>
                                    <Input
                                        bg="white"
                                        borderColor="#4B4B4B"
                                        placeholder="email@email.com.br"
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel
                                        color="#021531"
                                        fontWeight="bold"
                                    >
                                        Telefone de contato
                                    </FormLabel>
                                    <Input
                                        bg="white"
                                        borderColor="#4B4B4B"
                                        placeholder="(99) 99999-6666"
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormControl>
                                    <FormLabel
                                        color="#021531"
                                        fontWeight="bold"
                                    >
                                        Mensagem
                                    </FormLabel>
                                    <Input
                                        bg="white"
                                        borderColor="#4B4B4B"
                                        placeholder="Olá, gostaria de mais informações sobree o Imo7"
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }} textAlign="center">
                                <Button>Enviar mensagem</Button>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem w="sm">
                        <Flex mb={4} gap={2} align="center">
                            <Icon as={BiAlarm} fontSize="2xl" />
                            <Heading
                                fontWeight="700"
                                fontStyle="normal"
                                fontSize="32px"
                            >
                                Atendimento
                            </Heading>
                        </Flex>
                        <Text>De segunda a sexta-feira das 08 às 17 horas</Text>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    );
};
