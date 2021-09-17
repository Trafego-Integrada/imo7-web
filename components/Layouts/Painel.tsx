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
import { NextChakraLink } from "../NextChakraLink";

export const LayoutPainel = ({ children }) => {
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
                    <Box>
                        Contrato 1554 - Casa - Rua Marataizes 250, Valparaiso,
                        Serra-ES
                    </Box>
                    <Menu>
                        <MenuButton>
                            <Flex gridGap={2}>
                                <Avatar size="sm" name="Gabriel Ferreira" />
                                <Flex
                                    flexDirection="column"
                                    justify="center"
                                    textAlign="left"
                                >
                                    <Text lineHeight="none">Bem vindo,</Text>
                                    <Text lineHeight="none">
                                        Gabriel Ferreira
                                    </Text>
                                </Flex>
                            </Flex>
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Download</MenuItem>
                            <MenuItem>Create a Copy</MenuItem>
                            <MenuItem>Mark as Draft</MenuItem>
                            <MenuItem>Delete</MenuItem>
                            <MenuItem>Attend a Workshop</MenuItem>
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
