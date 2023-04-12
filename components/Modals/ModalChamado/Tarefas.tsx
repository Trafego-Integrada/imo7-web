import { Excluir } from "@/components/AlertDialogs/Excluir";
import { FormInput } from "@/components/Form/FormInput";
import { formatoData } from "@/helpers/helpers";
import { excluirOrcamento } from "@/services/models/orcamento";
import { excluirTarefa, listarTarefas } from "@/services/models/tarefa";
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
    useToast,
    Flex,
    Text,
    Button,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import { ModalOrcamento } from "../ModalOrcamento";
import { ModalTarefa } from "../ModalTarefa";

export const Tarefas = ({ chamado }) => {
    const [ficha, setFicha] = useState("");
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("");
    const toast = useToast();
    const modal = useRef();
    const modalExcluir = useRef();

    const excluir = useMutation(excluirTarefa);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Tarefa excluida",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["tarefas"]);
            },
        });
    };

    const { data } = useQuery(
        ["tarefas", { filtro: query, chamadoId: chamado.id }],
        listarTarefas
    );

    return (
        <Box>
            {" "}
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
                        placeholder="Encontre por titulo"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Text fontSize="xs" color="gray" w="full">
                        <Text as="span" fontWeight="bold">
                            {data?.data?.total}
                        </Text>{" "}
                        tarefas encontradas
                    </Text>
                </Flex>

                <Button
                    size="sm"
                    leftIcon={<Icon as={FiPlus} />}
                    colorScheme="blue"
                    onClick={() => modal.current.onOpen()}
                >
                    Novo
                </Button>
            </Flex>
            <TableContainer>
                <Table size="sm" variant="striped">
                    <Thead>
                        <Tr>
                            <Th w={44}>Vencimento</Th>
                            <Th>Titulo</Th>
                            <Th w={44}>Departamento</Th>
                            <Th w={44}>Responsaveis</Th>
                            <Th w={44}>Membros</Th>
                            <Th w={44}>Status</Th>
                            <Th w={24}></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.data?.data?.map((item) => (
                            <Tr key={item.id}>
                                <Td>
                                    {item.dataVencimento
                                        ? formatoData(item.dataVencimento)
                                        : null}
                                </Td>

                                <Td>{item.titulo}</Td>
                                <Td>{item.departamento?.titulo}</Td>
                                <Td>
                                    <AvatarGroup>
                                        {item.responsaveis.map((item) => (
                                            <Avatar
                                                size="sm"
                                                name={item.nome}
                                                src={item.foto}
                                            />
                                        ))}
                                    </AvatarGroup>
                                </Td>
                                <Td>
                                    <AvatarGroup>
                                        {item.membros.map((item) => (
                                            <Avatar
                                                size="sm"
                                                name={item.nome}
                                                src={item.foto}
                                            />
                                        ))}
                                    </AvatarGroup>
                                </Td>
                                <Td>
                                    <Tag colorScheme="green">{item.status}</Tag>
                                </Td>
                                <Td>
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        colorScheme="blue"
                                        icon={<Icon as={FiEdit} />}
                                        onClick={() =>
                                            modal.current.onOpen(item.id)
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
            <ModalTarefa ref={modal} chamadoId={chamado.id} />{" "}
            <Excluir
                ref={modalExcluir}
                titulo="Excluir tarefa"
                onDelete={onDelete}
            />
        </Box>
    );
};
