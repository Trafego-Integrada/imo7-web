import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { NextPage } from "next";
import { Input } from "../../../components/Forms/Input";
import { LayoutPainel } from "../../../components/Layouts/LayoutPainel";
import { FiSend } from "react-icons/fi";
const Chamado: NextPage = () => {
    return (
        <LayoutPainel>
            <Flex gridTemplateColumns="repeat(2, 1fr)">
                <VStack align="flex-start" w={96} gridGap={4}>
                    <VStack align="flex-start">
                        <Heading size="sm">Participantes</Heading>
                        <Flex gridGap={2}>
                            <Avatar name="Imobiliaria" size="sm" />
                            <Flex flexDirection="column" justify="center">
                                <Text lineHeight="none" fontWeight="bold">
                                    Nome do Atendente
                                </Text>
                                <Text
                                    lineHeight="none"
                                    fontWeight="semibold"
                                    color="gray.400"
                                >
                                    Imobiliria
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex gridGap={2}>
                            <Avatar name="Imobiliaria" size="sm" />
                            <Flex flexDirection="column" justify="center">
                                <Text lineHeight="none" fontWeight="bold">
                                    Nome do Atendente
                                </Text>
                                <Text
                                    lineHeight="none"
                                    fontWeight="semibold"
                                    color="gray.400"
                                >
                                    Imobiliria
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex gridGap={2}>
                            <Avatar name="Imobiliaria" size="sm" />
                            <Flex flexDirection="column" justify="center">
                                <Text lineHeight="none" fontWeight="bold">
                                    Nome do Atendente
                                </Text>
                                <Text
                                    lineHeight="none"
                                    fontWeight="semibold"
                                    color="gray.400"
                                >
                                    Imobiliria
                                </Text>
                            </Flex>
                        </Flex>
                    </VStack>
                    <VStack align="flex-start">
                        <Heading size="sm">Contrato</Heading>
                        <Box gridGap={2}>
                            <Text>Contrato 1554 - Casa</Text>
                            <Text>Av Iriri 339, Valparaiso, Serra-ES</Text>
                        </Box>
                    </VStack>
                </VStack>
                <VStack
                    pos="relative"
                    bg="white"
                    h="calc(100vh - 13rem)"
                    w="full"
                    rounded="xl"
                    shadow="sm"
                    p={4}
                    gridGap={4}
                >
                    <Flex w="full" justify="flex-start" gridGap={2}>
                        <Tooltip label="Ramerson Modesto (Imobiliária)">
                            <Avatar name="Ramerson Modesto" />
                        </Tooltip>
                        <Box maxW="80%">
                            <Box bg="blue.100" px={4} py={2} rounded="lg">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type
                            </Box>
                            <Text ml={2} fontSize="sm" color="gray.400">
                                Enviado em 09/09/2021 às 14:35
                            </Text>
                        </Box>
                    </Flex>
                    <Flex w="full" justify="flex-end" gridGap={2}>
                        <Box maxW="80%">
                            <Box bg="gray.100" px={4} py={2} rounded="lg">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type
                            </Box>
                            <Text ml={2} fontSize="sm" color="gray.400">
                                Enviado em 09/09/2021 às 14:35
                            </Text>
                        </Box>
                        <Tooltip label="Gabriel Ferreira (Inquilino)">
                            <Avatar name="Gabriel Ferreira" />
                        </Tooltip>
                    </Flex>
                    <Flex
                        display="relative"
                        maxW="calc(100% - 2rem)"
                        position="absolute"
                        bottom={4}
                        left={4}
                        right={0}
                        mx={4}
                    >
                        <Input placeholder="Escreva sua mensagem" />
                        <Button
                            colorScheme="uns"
                            position="absolute"
                            top={0}
                            right={4}
                        >
                            <Icon as={FiSend} />
                        </Button>
                    </Flex>
                </VStack>
            </Flex>
        </LayoutPainel>
    );
};

export default Chamado;
