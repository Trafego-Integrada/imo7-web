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
import { DrawerCampo } from "@/components/Drawers/Cadastros/FichaCadastral/DrawerCampo";
import { ModalPessoa } from "@/components/Modals/ModalPessoa";
import { excluirPessoa, listarPessoas } from "@/services/models/pessoa";

const Configuracoes = () => {
    const [ficha, setFicha] = useState("");
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("");
    const toast = useToast();
    const drawer = useRef();
    const modalExcluir = useRef();

    const excluir = useMutation(excluirPessoa);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Pessoa excluida",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["pessoas"]);
            },
        });
    };

    const { data } = useQuery(["pessoas", { filtro: query }], listarPessoas);
    console.log(data);
    return (
        <>
            <Layout title="Pessoas">
                <Box p={4}>
                    <Box bg="white" p={4}>
                        <Box mb={4}>
                            <Heading size="md" color="gray.600">
                                Pessoas
                            </Heading>
                            <Text color="gray" fontSize="sm" fontStyle="italic">
                                Gere e gerêncie os cadastros de pessoas
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
                                    <option value="prestador">
                                        Prestador de Serviço
                                    </option>
                                </FormSelect>

                                <FormInput
                                    size="sm"
                                    minW={96}
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
                                        <Th w={24}>Tipo de Cadastro</Th>
                                        <Th>Nome</Th>
                                        <Th w={44}>Documento</Th>
                                        <Th w={44}>Celular</Th>
                                        <Th w={24}></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data?.data?.data?.map((item) => (
                                        <Tr key={item.id}>
                                            <Td>
                                                {item.tipoCadastro ==
                                                    "prestador" &&
                                                    "Prestador de Serviço"}
                                            </Td>
                                            <Td>{item.razaoSocial}</Td>
                                            <Td>{item.documento}</Td>
                                            <Td>{item.celular}</Td>
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
                <ModalPessoa ref={drawer} />
                <Excluir
                    ref={modalExcluir}
                    titulo="Excluir pessoa"
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
