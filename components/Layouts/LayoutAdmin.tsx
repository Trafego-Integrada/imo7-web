import { Avatar } from "@chakra-ui/avatar";
import Icon from "@chakra-ui/icon";
import { Box, Flex, List, ListItem, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { FaUsers } from "react-icons/fa";
import { MdAccountCircle, MdBusiness, MdDashboard } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";
import { NextChakraLink } from "@/NextChakraLink";

export const LayoutAdmin = ({ children }) => {
    const { usuario } = useAuth();

    const menu = [
        {
            titulo: "Geral",
            itens: [
                {
                    nome: "Dashboard",
                    icon: MdDashboard,
                    href: "/painel/admin",
                },
            ],
        },
        {
            titulo: "Gestão",
            itens: [
                {
                    nome: "Imobiliárias",
                    icon: MdBusiness,
                    href: "/painel/admin/imobiliarias",
                },
                {
                    nome: "Contas",
                    icon: MdAccountCircle,
                    href: "/painel/admin/contas",
                },
            ],
        },
        {
            titulo: "Sistema",
            itens: [
                {
                    nome: "Usuários",
                    icon: FaUsers,
                    href: "/painel/admin/usuarios",
                },
            ],
        },
    ];
    return (
        <Flex h="100vh">
            <Box as="aside" w={64} bg="gray.100">
                <Box>Logo</Box>
                {menu.map((item, key) => (
                    <Box key={key}>
                        <Text
                            ml={2}
                            fontSize="sm"
                            fontWeight="medium"
                            color="gray.500"
                            textTransform="uppercase"
                            mt={6}
                            mb={4}
                        >
                            {item.titulo}
                        </Text>
                        <List as={VStack} flexDir="column" align="flex-start">
                            {item.itens.map((item, key) => (
                                <ListItem
                                    as={NextChakraLink}
                                    href={item.href}
                                    display="flex"
                                    alignItems="center"
                                    gridGap={2}
                                    w="full"
                                    py={2}
                                    px={4}
                                    color="gray.600"
                                    _hover={{ bg: "gray.200" }}
                                >
                                    <Icon as={item.icon} />
                                    <Text>{item.nome}</Text>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>

            <Box bg="gray.50" w="full">
                {children}
            </Box>
        </Flex>
    );
};
