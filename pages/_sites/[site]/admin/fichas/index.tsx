import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { ModalFichaCadastral } from "@/components/Modals/ModalFichaCadastral";
import { NextChakraLink } from "@/components/NextChakraLink";
import { listarFichas } from "@/services/models/fichaCadastral";
import {
    Box,
    Button,
    Flex,
    Heading,
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
import { useRef } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import { useQuery } from "react-query";

const FichasCadastrais = () => {
    const modal = useRef();
    const { data: fichas } = useQuery(["fichas", {}], listarFichas);
    return (
        <Layout>
            <Box p={4}>
                <Box mb={6}>
                    <Heading size="md" color="gray.600">
                        Fichas Cadastrais
                    </Heading>
                    <Text color="gray" fontSize="sm" fontStyle="italic">
                        Gere e gerêncie as fichas cadastrais
                    </Text>
                </Box>
                <Box>
                    <Flex
                        justify="space-between"
                        align="center"
                        bg="white"
                        p={4}
                    >
                        <Flex gap={4} align="center">
                            <FormInput
                                size="sm"
                                minW={96}
                                placeholder="Encontre uma ficha"
                            />
                            <Text fontSize="xs" color="gray" w="full">
                                <Text as="span" fontWeight="bold">
                                    {fichas?.total}
                                </Text>{" "}
                                fichas cadastrais
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
                    <Box bg="white" mt={4} p={4}>
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
                                                    <Text>
                                                        {item.descricao}
                                                    </Text>
                                                </Td>
                                                <Td>
                                                    <IconButton
                                                        variant="ghost"
                                                        icon={
                                                            <Icon as={FiEdit} />
                                                        }
                                                    />
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
            </Box>
            <ModalFichaCadastral ref={modal} />
        </Layout>
    );
};

export default FichasCadastrais;
