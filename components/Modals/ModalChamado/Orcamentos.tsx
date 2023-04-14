import { Excluir } from "@/components/AlertDialogs/Excluir";
import { FormInput } from "@/components/Form/FormInput";
import { formatoData, formatoValor } from "@/helpers/helpers";
import {
    excluirOrcamento,
    listarOrcamentos,
} from "@/services/models/orcamento";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Icon,
    IconButton,
    Table,
    TableContainer,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    AvatarGroup,
    Avatar,
    Tag,
    Flex,
    Text,
    Button,
    useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import { ModalOrcamento } from "../ModalOrcamento";

export const Orcamentos = ({ chamado }) => {
    const [ficha, setFicha] = useState("");
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("");
    const toast = useToast();
    const drawer = useRef();
    const modalExcluir = useRef();

    const excluir = useMutation(excluirOrcamento);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Orçamento excluido",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["orcamentos"]);
            },
        });
    };

    const { data } = useQuery(
        ["orcamentos", { filtro: query, chamadoId: chamado.id }],
        listarOrcamentos
    );
    return (
        <Box>
            <Flex
                justify="space-between"
                align="center"
                bg="white"
                px={0}
                py={6}
            >
                <Flex gap={4} align="center">
                    <FormInput
                        size="sm"
                        minW={96}
                        placeholder="Encontre por prestador"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Text fontSize="xs" color="gray" w="full">
                        <Text as="span" fontWeight="bold">
                            {data?.data?.total}
                        </Text>{" "}
                        orçamentos encontrados
                    </Text>
                </Flex>

                <Button
                    size="sm"
                    leftIcon={<Icon as={FiPlus} />}
                    colorScheme="blue"
                    onClick={() => drawer.current.onOpen()}
                >
                    Novo
                </Button>
            </Flex>
            <TableContainer>
                <Table size="sm" variant="striped">
                    <Thead>
                        <Tr>
                            <Th>Prestador</Th>
                            <Th w={24}>valor</Th>
                            <Th w={44}>Solicitante</Th>
                            <Th w={24}>Criado em</Th>
                            <Th w={24}></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.data?.data?.map((item) => (
                            <Tr key={item.id}>
                                <Td>{item.prestador?.razaoSocial}</Td>
                                <Td>{formatoValor(item.valor)}</Td>
                                <Td>{item.solicitante?.nome}</Td>
                                <Td>{formatoData(item.createdAt)}</Td>
                                <Td>
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        colorScheme="blue"
                                        icon={<Icon as={FiEdit} />}
                                        onClick={() =>
                                            drawer.current.onOpen(item.id)
                                        }
                                    />
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        colorScheme="red"
                                        icon={<Icon as={FiTrash} />}
                                        onClick={() =>
                                            modalExcluir.current.onOpen(item.id)
                                        }
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <ModalOrcamento ref={drawer} chamadoId={chamado.id} />
            <Excluir
                ref={modalExcluir}
                titulo="Excluir pessoa"
                onDelete={onDelete}
            />
        </Box>
    );
};
