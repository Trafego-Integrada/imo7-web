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
import { FaCheckCircle, FaWhatsappSquare } from "react-icons/fa";
import { FiCheckCircle, FiCheckSquare } from "react-icons/fi";
import {
    MdAutoAwesome,
    MdFilePresent,
    MdUpdate,
    MdVerified,
} from "react-icons/md";

export const Tribunal = () => {
    return (
        <>
            <Box>
                <Container maxW="container.xl" py={12}>
                    <Flex textAlign="center" mb={4} gap={4} flexDir="column">
                        <Heading
                            color="#032552"
                            fontSize="24px"
                            fontWeight="500"
                            my={8}
                        >
                            Tribunal de Justiça Nacional
                        </Heading>
                        <Text
                            color="#021531"
                            fontSize="32px"
                            fontWeight="normal"
                            my={8}
                        >
                            Com apenas um botão você descobre se o seu cliente
                            possui um histórico de processos na justiça. NÃO
                            PERCA MAIS TEMPO procurando processos em um estado
                            de cada vez!
                        </Text>
                    </Flex>

                    <Flex
                        my={12}
                        align="center"
                        gap={8}
                        flexDir={{ base: "column", lg: "row" }}
                    >
                        <Grid gridTemplateColumns={{ lg: "repeat(2,1fr)" }}>
                            <GridItem>
                                <Text>
                                    Chega daquela coisa chata de ficar horas
                                    indo atrás de descobrir se o seu cliente já
                                    foi processado ou possui algum processo em
                                    andamento e ainda ter que ficar procurando
                                    em um estado de cada vez. Com o IMO7 você
                                    consegue descobrir rapidamente o histórico
                                    judicial de seus clientes sem todo o Brasil
                                    com apenas um clique.
                                </Text>
                                <Text>Encontre processos em 05 segundos!</Text>
                                <Text>
                                    Acesso instantâneo a processos judiciais em
                                    todo o país, eliminando a busca lenta e
                                    garantindo agilidade máxima em sua análise.
                                    Com o IMO7, você navega pelo histórico de
                                    processos em todos os estados do Brasil sem
                                    demora, proporcionando uma pesquisa
                                    instantânea e eficaz. 
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Image src="/img/justica.png" alt="#" />
                            </GridItem>
                        </Grid>
                    </Flex>
                </Container>
            </Box>
            <Box bg="#F6FDFF">
                <Container maxW="container.xl" py={12}>
                    <Grid gridTemplateColumns={{ lg: "repeat(2,1fr)" }} gap={6}>
                        <GridItem>
                            <Flex gap={2} mb={2}>
                                <Icon
                                    as={MdFilePresent}
                                    color="#73C4E1"
                                    fontSize="2xl"
                                />
                                <Heading size="md" color="#021531">
                                    Unificação de dados
                                </Heading>
                            </Flex>
                            <Text>
                                Centralize informações de processos em uma
                                plataforma única, poupando horas de pesquisa
                                fragmentada e mantendo todos os dados acessíveis
                                em um só lugar.
                                <br /> <br /> Centralize todos os registros
                                judiciais dos seus clientes em um só local.
                            </Text>
                        </GridItem>
                        <GridItem>
                            <Flex gap={2} mb={2}>
                                <Icon
                                    as={MdUpdate}
                                    color="#73C4E1"
                                    fontSize="2xl"
                                />
                                <Heading size="md" color="#021531">
                                    Atualizações em Tempo Real
                                </Heading>
                            </Flex>
                            <Text>
                                Com atualizações em tempo real, você fica por
                                dentro de qualquer novo processo, permitindo
                                respostas rápidas e efetivas, mostrando aos seus
                                clientes que você está sempre um passo à frente.
                            </Text>
                        </GridItem>
                        <GridItem>
                            <Flex gap={2} mb={2}>
                                <Icon
                                    as={MdAutoAwesome}
                                    color="#73C4E1"
                                    fontSize="2xl"
                                />
                                <Heading size="md" color="#021531">
                                    Desburocratização Eficiente{" "}
                                </Heading>
                            </Flex>
                            <Text>
                                Simplifique a verificação de histórico judicial,
                                reduzindo a burocracia e agilizando suas
                                operações para um atendimento mais direto e
                                rápido.
                                <br /> <br /> Simplifique e agilize a
                                verificação de históricos judiciais.
                            </Text>
                        </GridItem>
                        <GridItem>
                            <Flex gap={2} mb={2}>
                                <Icon
                                    as={MdVerified}
                                    color="#73C4E1"
                                    fontSize="2xl"
                                />
                                <Heading size="md" color="#021531">
                                    Padronização Eficaz{" "}
                                </Heading>
                            </Flex>
                            <Text>
                                Padronize o processo de consulta em todo o país,
                                evitando erros e garantindo consistência nas
                                análises. <br /> <br />
                                Com o IMO7, você garante consistência em suas
                                análises, eliminando erros e oferecendo um
                                serviço de qualidade superior.
                            </Text>
                        </GridItem>
                    </Grid>
                </Container>
            </Box>
            <Box bg="radial-gradient(50% 50% at 50% 50%, #012659 0%, rgba(1, 38, 89, 0.00) 100%), #021D44;">
                <Container maxW="container.xl" py={12}>
                    <Text color="white">
                        O IMO7 é a solução completa para sua gestão imobiliária,
                        proporcionando acesso rápido e abrangente ao histórico
                        judicial em todo o Brasil, além de simplificar suas
                        operações e garantir um atendimento excepcional aos seus
                        clientes.
                    </Text>
                    <Flex
                        align="center"
                        gap={8}
                        flexDir={{ base: "column", lg: "row" }}
                        justify="space-between"
                    >
                        <Image src="/img/IMAGEM (4).png" alt="#" />
                        <Flex flexDir="column" gap={4} maxW="lg">
                            <Heading color="#FFF" size="md">
                                CONFIRA ABAIXO OS TIPOS DE CONSULTA QUE VOCÊ
                                PODERÁ FAZER ATRAVÉS DO IMO7:
                            </Heading>
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">
                                    01. Processos TJ (em todos os estados)
                                    Pessoa Jurídica
                                </Text>
                            </Flex>
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">
                                    02. Processos TJ (em todos os estados)
                                    Pessoa Física
                                </Text>
                            </Flex>
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">
                                    03. Protestos Pessoa Física
                                </Text>
                            </Flex>
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">
                                    04. Protestos Pessoa Jurídica
                                </Text>
                            </Flex>
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">05. CND Federal</Text>
                            </Flex>{" "}
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">06. CND Estadual</Text>
                            </Flex>{" "}
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">
                                    07. CND Trabalhista TST
                                </Text>
                            </Flex>{" "}
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">
                                    08. CND Trabalhista MTE
                                </Text>
                            </Flex>{" "}
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">09. Receita CNPJ</Text>
                            </Flex>{" "}
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">10. Receita CNPJ QSA</Text>
                            </Flex>{" "}
                            <Flex align="center" gap={2}>
                                <Icon
                                    as={FiCheckCircle}
                                    color="#77BA89"
                                    fontSize={16}
                                />
                                <Text color="#FFF">11. Receita CPF</Text>
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
        </>
    );
};