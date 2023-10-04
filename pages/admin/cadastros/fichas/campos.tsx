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
import {
    excluirCampoFicha,
    listarCampoFichas,
} from "@/services/models/campoFicha";
import { ModalCampo } from "@/components/Drawers/Cadastros/FichaCadastral/DrawerCampo";

const Configuracoes = () => {
    const [ficha, setFicha] = useState("");
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("");
    const toast = useToast();
    const drawer = useRef();
    const modalExcluir = useRef();
    const { data: campos } = useQuery(
        ["campos", { query, categoria, tipoFicha: ficha }],
        listarCampoFichas
    );
    const excluir = useMutation(excluirCampoFicha);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Campo excluido",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["campos"]);
            },
        });
    };

    const { data: categorias } = useQuery(
        ["categoriasCampos", {}],
        listarCategoriaCampoFichas
    );
    return (
        <>
            <Layout title="Campos">
                <Box p={4}>
                    <Box bg="white" p={4}>
                        <Box mb={4}>
                            <Heading size="md" color="gray.600">
                                Campos
                            </Heading>
                            <Text color="gray" fontSize="sm" fontStyle="italic">
                                Gere e gerêncie os campos das fichas cadastrais
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
                                <FormSelect
                                    size="sm"
                                    placeholder="Por tipo"
                                    value={ficha}
                                    onChange={(e) => setFicha(e.target.value)}
                                >
                                    <option value="inquilino">
                                        Cadastro de Inquilino
                                    </option>
                                    <option value="fiador">
                                        Cadastro de Fiador
                                    </option>
                                    <option value="proprietario">
                                        Cadastro de Proprietario
                                    </option>
                                    <option value="imovel">
                                        Cadastro de Imovel
                                    </option>
                                    <option value="comprador">
                                        Cadastro de Comprador
                                    </option>
                                    <option value="vendedor">
                                        Cadastro de Vendedor
                                    </option>{" "}
                                    <option value="visita">
                                        Cadastro de Visita
                                    </option>
                                </FormSelect>
                                <FormSelect
                                    size="sm"
                                    placeholder="Por categoria"
                                    value={categoria}
                                    onChange={(e) =>
                                        setCategoria(e.target.value)
                                    }
                                >
                                    {categorias?.data?.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nome}
                                        </option>
                                    ))}
                                </FormSelect>
                                <FormInput
                                    size="sm"
                                    minW={96}
                                    placeholder="Encontre por codigo ou nome"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <Text fontSize="xs" color="gray" w="full">
                                    <Text as="span" fontWeight="bold">
                                        {campos?.total}
                                    </Text>{" "}
                                    campos encontrados
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
                                        <Th w={24}>Ordem</Th>
                                        <Th w={24}>Categoria</Th>
                                        <Th w={24}>Codigo</Th>
                                        <Th>Nome</Th>
                                        <Th w={24}></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {campos?.data?.map((item) => (
                                        <Tr key={item.id}>
                                            <Td>{item.ordem}</Td>
                                            <Td>{item.categoria?.nome}</Td>
                                            <Td>{item.codigo}</Td>
                                            <Td>
                                                <Text fontWeight="bold">
                                                    {item.nome}
                                                </Text>
                                                <Text size="x">
                                                    {item.descricao}
                                                </Text>
                                            </Td>
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
                <ModalCampo ref={drawer} />
                <Excluir
                    ref={modalExcluir}
                    titulo="Excluir campo"
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
