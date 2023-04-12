import { Excluir } from "@/components/AlertDialogs/Excluir";
import { FormInput } from "@/components/Form/FormInput";
import { excluirAssunto, listarAssuntos } from "@/services/models/assunto";
import { queryClient } from "@/services/queryClient";
import {
    Button,
    Flex,
    Icon,
    IconButton,
    Table,
    TableContainer,
    Text,
    Thead,
    Tr,
    Td,
    Tbody,
    Tag,
    useToast,
    Th,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import { ModalAssunto } from "../ModalAssunto";

export const Assuntos = ({ departamentoId }) => {
    const [ficha, setFicha] = useState("");
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("");
    const toast = useToast();
    const drawer = useRef();
    const modalExcluir = useRef();
    const { data } = useQuery(
        ["assuntos", { filtro: query, departamentoId }],
        listarAssuntos
    );
    const excluir = useMutation(excluirAssunto);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Assunto excluido",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["assuntos"]);
            },
        });
    };
    return (
        <>
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
                        placeholder="Encontre por nome"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Text fontSize="xs" color="gray" w="full">
                        <Text as="span" fontWeight="bold">
                            {data?.total}
                        </Text>{" "}
                        cadastros encontrados
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
                            <Th>Título</Th>
                            <Th w={44}>Status</Th>
                            <Th w={24}></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.data?.data?.map((item) => (
                            <Tr key={item.id}>
                                <Td>{item.titulo}</Td>

                                <Td>
                                    {item.ativo ? (
                                        <Tag colorScheme="green">Ativo</Tag>
                                    ) : (
                                        <Tag colorScheme="red">Inátivo</Tag>
                                    )}
                                </Td>

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
            <Excluir
                ref={modalExcluir}
                titulo="Excluir assunto"
                onDelete={onDelete}
            />
            <ModalAssunto ref={drawer} departamentoId={departamentoId} />
        </>
    );
};
