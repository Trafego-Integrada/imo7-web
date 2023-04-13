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
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useAuth } from "@/hooks/useAuth";
import { listarContratos } from "@/services/models/contrato";
import { NextChakraLink } from "@/components/NextChakraLink";

export const LayoutPainel = ({ children }) => {
    const router = useRouter();
    const { usuario, signOut } = useAuth();
    const { data: contratos } = useQuery(
        [
            "meusContratos",
            { proprietarioId: usuario?.id, inquilinoId: usuario?.id },
        ],
        listarContratos
    );
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
                            {contratos && contratos.data?.data?.length
                                ? "Selecione um contrato"
                                : "Você não possui contratos ativos"}
                        </MenuButton>
                        <MenuList>
                            {contratos &&
                                contratos.data?.data?.length > 0 &&
                                contratos.data?.data.map((item, key) => (
                                    <NextChakraLink
                                        key={item.id}
                                        href={`/${item.id}`}
                                    >
                                        <MenuItem>
                                            {item.codigo} -{" "}
                                            {item.imovel?.endereco}
                                        </MenuItem>
                                    </NextChakraLink>
                                ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton>
                            <Flex gridGap={2}>
                                <Avatar
                                    size="sm"
                                    name={usuario?.nome}
                                    src={usuario?.avatar}
                                />
                                <Flex
                                    flexDirection="column"
                                    justify="center"
                                    textAlign="left"
                                    color="white"
                                >
                                    <Text lineHeight="none" fontSize="xs">
                                        Bem vindo,
                                    </Text>
                                    <Text
                                        lineHeight="none"
                                        fontWeight="bold"
                                        fontSize="sm"
                                    >
                                        {usuario.nome}
                                    </Text>
                                </Flex>
                            </Flex>
                        </MenuButton>
                        <MenuList>
                            {usuario.cargos?.find(
                                (i) =>
                                    i == "adm" ||
                                    i == "conta" ||
                                    i == "imobiliaria"
                            ) && (
                                <MenuItem as={NextChakraLink} href="/admin">
                                    Painel Administrativo
                                </MenuItem>
                            )}

                            <MenuItem onClick={() => signOut()}>Sair</MenuItem>
                        </MenuList>
                    </Menu>
                </Container>
            </Stack>
            <Stack as="aside" h={24} bg="blue.500">
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
                        <NextChakraLink
                            href="/"
                            fontWeight={
                                router.asPath == "/" ? "bold" : "normal"
                            }
                            letterSpacing="wider"
                            _hover={{ fontWeight: "bold" }}
                        >
                            Home
                        </NextChakraLink>
                        {router.query.contratoId &&
                            router.query.contratoId != "undefined" &&
                            contratos?.data?.data?.find((c) =>
                                c.inquilinos?.find((p) => p.id == usuario?.id)
                                    ? true
                                    : false
                            ) && (
                                <NextChakraLink
                                    href={`/${router.query.contratoId}/faturas`}
                                    fontWeight={
                                        router.asPath ==
                                        `/${router.query.contratoId}/faturas`
                                            ? "bold"
                                            : "normal"
                                    }
                                    letterSpacing="wider"
                                    _hover={{ fontWeight: "bold" }}
                                >
                                    Faturas
                                </NextChakraLink>
                            )}
                        {router.query.contratoId &&
                            router.query.contratoId != "undefined" &&
                            contratos?.data?.data?.find((c) =>
                                c.proprietarios?.find(
                                    (p) => p.id == usuario?.id
                                )
                                    ? true
                                    : false
                            ) && (
                                <NextChakraLink
                                    href={`/${router.query.contratoId}/extratos`}
                                    fontWeight={
                                        router.asPath ==
                                        `/${router.query.contratoId}/extratos`
                                            ? "bold"
                                            : "normal"
                                    }
                                    letterSpacing="wider"
                                    _hover={{ fontWeight: "bold" }}
                                >
                                    Extratos
                                </NextChakraLink>
                            )}
                        {router.query.contratoId &&
                            router.query.contratoId != "undefined" && (
                                <NextChakraLink
                                    href={`/${router.query.contratoId}/chamados`}
                                    fontWeight={
                                        router.asPath ==
                                        `/${router.query.contratoId}/chamados`
                                            ? "bold"
                                            : "normal"
                                    }
                                    letterSpacing="wider"
                                    _hover={{ fontWeight: "bold" }}
                                >
                                    Chamados
                                </NextChakraLink>
                            )}
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
