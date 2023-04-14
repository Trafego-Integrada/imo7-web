import {
    Avatar,
    AvatarGroup,
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
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
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
import {
    excluirOrcamento,
    listarOrcamentos,
} from "@/services/models/orcamento";
import { formatoData } from "@/helpers/helpers";
import { ModalTarefa } from "@/components/Modals/ModalTarefa";
import { listarTarefas } from "@/services/models/tarefa";
import { FiltroTarefas } from "@/components/Pages/FiltroTarefas";
import { TooltipAvatar } from "@/components/TooltipAvatar";

const Configuracoes = () => {
    const [filtro, setFiltro] = useState({
        query: "",
        dataCriacao: [null, null],
        dataEntrega: [null, null],
        dataVencimento: [null, null],

        responsaveis: [],
    });
    const toast = useToast();
    const drawer = useRef();
    const modalExcluir = useRef();

    const excluir = useMutation(excluirOrcamento);

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
        [
            "tarefas",
            {
                ...filtro,
                dataCriacao: filtro.dataCriacao[0]
                    ? JSON.stringify(filtro.dataCriacao)
                    : null,
                dataVencimento: filtro.dataVencimento[0]
                    ? JSON.stringify(filtro.dataVencimento)
                    : null,
                dataEntrega: filtro.dataEntrega[0]
                    ? JSON.stringify(filtro.dataEntrega)
                    : null,
                responsaveis:
                    filtro.responsaveis.length > 0
                        ? JSON.stringify(filtro.responsaveis)
                        : null,
            },
        ],
        listarTarefas
    );

    return (
        <>
            <Layout title="Tarefas">
                <Flex p={4} flexDir="column" gap={4}>
                    <FiltroTarefas setFiltro={setFiltro} filtro={filtro} />
                    <Box bg="white" p={4}>
                        <Box mb={4}>
                            <Heading size="md" color="gray.600">
                                Tarefas
                            </Heading>
                            <Text color="gray" fontSize="sm" fontStyle="italic">
                                Gere e gerêncie as tarefas
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
                                    placeholder="Encontre por prestador"
                                    value={filtro.query}
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            query: e.target.value,
                                        })
                                    }
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
                                onClick={() => drawer.current.onOpen()}
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
                                        <Td w={24}>Nº Contrato</Td>
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
                                                    ? formatoData(
                                                          item.dataVencimento
                                                      )
                                                    : null}
                                            </Td>

                                            <Td>{item.titulo}</Td>
                                            <Td>{item?.codigoContrato}</Td>
                                            <Td>{item.departamento?.titulo}</Td>
                                            <Td>
                                                {item.responsaveis.map(
                                                    (item, k) =>
                                                        `${k != 0 ? "," : ""} ${
                                                            item.nome
                                                        }`
                                                )}
                                            </Td>
                                            <Td>
                                                <AvatarGroup>
                                                    {item.membros.map(
                                                        (item) => (
                                                            <TooltipAvatar
                                                                key={item.id}
                                                                size="xs"
                                                                name={item.nome}
                                                                src={item.foto}
                                                            />
                                                        )
                                                    )}
                                                </AvatarGroup>
                                            </Td>
                                            <Td>
                                                <Tag colorScheme="green">
                                                    {item.status}
                                                </Tag>
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
                </Flex>
                <ModalTarefa ref={drawer} />
                <Excluir
                    ref={modalExcluir}
                    titulo="Excluir tarefa"
                    onDelete={onDelete}
                />
            </Layout>
        </>
    );
};
export default Configuracoes;
