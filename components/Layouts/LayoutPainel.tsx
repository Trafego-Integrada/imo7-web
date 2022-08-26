import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import {
    Badge,
    Box,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Stack,
    Text,
} from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { useQuery } from "react-query";
import { useAuth } from "../../hooks/useAuth";
import { listarContratos } from "../../services/models/contrato";
import { NextChakraLink } from "../NextChakraLink";

export const LayoutPainel = ({ children }) => {
    const { usuario } = useAuth();
    const { data: contratos } = useQuery(["meusContratos"], listarContratos);
    return (
        <Box bg="gray.100" minH="100vh">
            <Stack as="aside" bg="blue.600">
                <Container
                    maxW="container.xl"
                    as={Flex}
                    align="center"
                    justify="space-between"
                    py={2}
                >
                    <Menu>
                        <MenuButton color="white">
                            {contratos && contratos.length
                                ? "Selecione um contrato"
                                : "Você não possui contratos ativos"}
                        </MenuButton>
                        <MenuList>
                            {contratos &&
                                contratos.length > 0 &&
                                contratos.map((item, key) => (
                                    <MenuItem key={key}>Download</MenuItem>
                                ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton>
                            <Flex gridGap={2}>
                                <Avatar size="sm" name={usuario.nome} />
                                <Flex
                                    flexDirection="column"
                                    justify="center"
                                    textAlign="left"
                                >
                                    <Text lineHeight="none">Bem vindo,</Text>
                                    <Text lineHeight="none">
                                        {usuario.nome}
                                    </Text>
                                </Flex>
                            </Flex>
                        </MenuButton>
                        <MenuList>
                            {usuario.cargos?.find((i) => i == "Admin") && (
                                <MenuItem
                                    as={NextChakraLink}
                                    href="/painel/admin"
                                >
                                    Painel Admin
                                </MenuItem>
                            )}

                            <MenuItem>Sair</MenuItem>
                        </MenuList>
                    </Menu>
                </Container>
            </Stack>
            <Stack as="aside" h={32} bg="blue.500">
                <Container
                    maxW="container.xl"
                    as={Flex}
                    align="center"
                    h="full"
                >
                    <Box>
                        <Heading color="white">Imo7</Heading>
                    </Box>
                    <Flex w="full" gridGap={8} color="white" justify="center">
                        <NextChakraLink href="/painel">Home</NextChakraLink>
                        <NextChakraLink href="/painel">Faturas</NextChakraLink>
                        <NextChakraLink href="/painel">Chamados</NextChakraLink>
                    </Flex>
                </Container>
            </Stack>
            <Stack>
                <Container maxW="container.xl" py={4} px={2}>
                    {children}
                </Container>
            </Stack>
        </Box>
    );
};
