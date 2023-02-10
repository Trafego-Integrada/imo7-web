import {
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    List,
    Tab,
    Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
} from "@chakra-ui/react";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "react-query";
import { show, update } from "@/services/models/imobiliaria";
import { useEffect, useRef, useState } from "react";
import { FichasCadastrais } from "@/components/Pages/Admin/Configuracoes/FichasCadastrais";
import {
    excluirCategoriaCampoFicha,
    listarCategoriaCampoFichas,
} from "@/services/models/categoriaCampoFicha";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { DrawerCategoria } from "@/components/Drawers/Cadastros/FichaCadastral/DrawerCategoria";
import { queryClient } from "@/services/queryClient";
import { Excluir } from "@/components/AlertDialogs/Excluir";

const Configuracoes = () => {
    const [query, setQuery] = useState("");
    const toast = useToast();
    const drawer = useRef();
    const modalExcluir = useRef();
    const { data: categorias } = useQuery(
        ["categoriasCampo", { query }],
        listarCategoriaCampoFichas
    );
    const excluir = useMutation(excluirCategoriaCampoFicha);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Categoria excluida",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["categoriasCampo"]);
            },
        });
    };
    return (
        <>
            <Layout title="Categorias de Campos">
                <Box p={4}>
                    <Box bg="white" p={4}>
                        <Box mb={4}>
                            <Heading size="md" color="gray.600">
                                Categorias de Campos
                            </Heading>
                            <Text color="gray" fontSize="sm" fontStyle="italic">
                                Gere e gerêncie as categorias de campos das
                                fichas cadastrais
                            </Text>
                        </Box>
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
                                    placeholder="Encontre uma categoria"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <Text fontSize="xs" color="gray" w="full">
                                    <Text as="span" fontWeight="bold">
                                        {categorias?.total}
                                    </Text>{" "}
                                    categorias encontradas
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
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th w={24}>Ordem</Th>
                                        <Th>Nome</Th>
                                        <Th w={44}>Nº de Campos</Th>
                                        <Th w={24}></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {categorias?.data?.map((item) => (
                                        <Tr key={item.id}>
                                            <Td>{item.ordem}</Td>
                                            <Td>
                                                <Text fontWeight="bold">
                                                    {item.nome}
                                                </Text>
                                                <Text size="x">
                                                    {item.descricao}
                                                </Text>
                                            </Td>
                                            <Td>{item.campos.length}</Td>
                                            <Td>
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    colorScheme="blue"
                                                    icon={<Icon as={FiEdit} />}
                                                    onClick={() =>
                                                        drawer.current.onOpen(
                                                            item.id
                                                        )
                                                    }
                                                />
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    colorScheme="red"
                                                    icon={<Icon as={FiTrash} />}
                                                    onClick={() =>
                                                        modalExcluir.current.onOpen(
                                                            item.id
                                                        )
                                                    }
                                                />
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <DrawerCategoria ref={drawer} />
                <Excluir
                    ref={modalExcluir}
                    titulo="Excluir categoria"
                    onDelete={onDelete}
                />
            </Layout>
        </>
    );
};
export default Configuracoes;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
