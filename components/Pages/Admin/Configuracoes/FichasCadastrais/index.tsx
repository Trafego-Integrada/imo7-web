import { NextChakraLink } from "@/components/NextChakraLink";
import { listarFichas } from "@/services/models/modeloFicha";
import {
    Box,
    Button,
    Flex,
    Icon,
    IconButton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiEdit, FiPlus } from "react-icons/fi";
import { useQuery } from "react-query";

export const FichasCadastrais = () => {
    const { data: fichas } = useQuery(["fichas", {}], listarFichas);
    return (
        <Box>
            <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="gray">
                    <Text as="span" fontWeight="bold">
                        {fichas?.total}
                    </Text>{" "}
                    fichas cadastrais
                </Text>
                <NextChakraLink href="/admin/configuracoes/modeloFichaCadastral/novo">
                    <Button
                        size="sm"
                        leftIcon={<Icon as={FiPlus} />}
                        colorScheme="blue"
                    >
                        Novo
                    </Button>
                </NextChakraLink>
            </Flex>
            <Box>
                <TableContainer>
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th w={44}>Tipo</Th>
                                <Th>Nome</Th>
                                <Th w={44}></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {fichas?.data?.length > 0 ? (
                                fichas.data.map((item) => (
                                    <Tr key={item.id}>
                                        <Td>{item.tipo}</Td>
                                        <Td>
                                            <Text>{item.nome}</Text>
                                            <Text>{item.descricao}</Text>
                                        </Td>
                                        <Td>
                                            <Link
                                                href={
                                                    "/admin/configuracoes/modeloFichaCadastral/" +
                                                    item.id
                                                }
                                            >
                                                <IconButton
                                                    variant="ghost"
                                                    icon={<Icon as={FiEdit} />}
                                                />
                                            </Link>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td
                                        colSpan={3}
                                        textAlign="center"
                                        color="gray"
                                    >
                                        Não encontramos fichas
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
