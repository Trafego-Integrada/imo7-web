import { Excluir } from "@/components/AlertDialogs/Excluir";
import { NextChakraLink } from "@/components/NextChakraLink";
import { excluirFicha, listarFichas } from "@/services/models/modeloFicha";
import { queryClient } from "@/services/queryClient";
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
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRef } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";

export const FichasCadastrais = () => {
    const toast = useToast();
    const modalExcluir = useRef();
    const { data: fichas } = useQuery(["fichas", {}], listarFichas);
    const excluir = useMutation(excluirFicha);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Categoria excluida",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["fichas"]);
            },
        });
    };
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
                                                {/* <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    colorScheme="red"
                                                    icon={<Icon as={FiTrash} />}
                                                    onClick={() =>
                                                        modalExcluir.current.onOpen(
                                                            item.id
                                                        )
                                                    }
                                                /> */}
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
            <Excluir
                ref={modalExcluir}
                titulo="Excluir categoria"
                onDelete={onDelete}
            />
        </Box>
    );
};
