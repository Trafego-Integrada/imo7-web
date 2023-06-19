import { Excluir } from "@/components/AlertDialogs/Excluir";
import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { ModalContratos } from "@/components/Modals/contratos";
import { FiltroContratos } from "@/components/Pages/FIltroContratos";
import { FiltroFilaEnvio } from "@/components/Pages/FiltroFilaEnvio";
import { formatoData } from "@/helpers/helpers";
import { listarContratos } from "@/services/models/contrato";
import { excluirFilaEnvio, listarFilaEnvio } from "@/services/models/filaEnvio";
import { queryClient } from "@/services/queryClient";
import { withSSRAuth } from "@/utils/withSSRAuth";
import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPrevious,
    usePagination,
} from "@ajna/pagination";
import {
    Box,
    Flex,
    Icon,
    IconButton,
    Spinner,
    Table,
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
import { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiTrash, FiTrash2 } from "react-icons/fi";
import { MdPageview } from "react-icons/md";
import { useMutation, useQuery } from "react-query";

const Home = () => {
    const toast = useToast();
    const modal = useRef();
    const [total, setTotal] = useState();
    const [filtro, setFiltro] = useState({
        previsaoEnvio: [null, null],
        dataEnvio: [null, null],
        createdAt: [null, null],
    });
    const { currentPage, setCurrentPage, pagesCount, pages, pageSize } =
        usePagination({
            total: total,
            initialState: { currentPage: 1, pageSize: 15 },
        });
    const { data, isLoading, isFetching } = useQuery(
        [
            "filaEnvio",
            {
                ...filtro,
                previsaoEnvio: filtro.previsaoEnvio[0]
                    ? JSON.stringify(filtro.previsaoEnvio)
                    : null,
                dataEnvio: filtro.dataEnvio[0]
                    ? JSON.stringify(filtro.dataEnvio)
                    : null,
                createdAt: filtro.createdAt[0]
                    ? JSON.stringify(filtro.createdAt)
                    : null,
                linhas: pageSize,
                pagina: currentPage,
            },
        ],
        listarFilaEnvio,
        {
            onSuccess: (data) => {
                setTotal(data.total);
            },
        }
    );
    const modalExcluir = useRef();

    const excluir = useMutation(excluirFilaEnvio);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Item excluído com sucesso!",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["filaEnvio"]);
            },
        });
    };

    return (
        <>
            <Layout title="Fila de Envio">
                <Box p={5}>
                    <FiltroFilaEnvio filtro={filtro} setFiltro={setFiltro} />

                    <Box bg="white" overflowX="auto" p={5} mt={5}>
                        <Flex gap={4} align="center" justify="space-between">
                            <Text fontSize="sm" color="gray">
                                <Text as="span" fontWeight="bold">
                                    {total}
                                </Text>{" "}
                                itens da fila de envio
                            </Text>
                            <Flex align="center" gap={2}>
                                <FormInput
                                    size="sm"
                                    bg="white"
                                    maxW={96}
                                    placeholder="Busca rápida..."
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            filtro: {
                                                ...filtro.filtro,
                                                query: e.target.value,
                                            },
                                        })
                                    }
                                    rightElement={
                                        isFetching && <Spinner size="sm" />
                                    }
                                />
                            </Flex>
                        </Flex>

                        <Table variant="striped" mt={5} size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Previsão</Th>
                                    <Th>Enviado em</Th>
                                    <Th>Destinatário</Th>
                                    <Th>Assunto</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {isLoading ? (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            <Spinner />
                                        </Td>
                                    </Tr>
                                ) : data && data.data.length > 0 ? (
                                    data.data.map((item) => (
                                        <Tr key={item.id}>
                                            <Td>
                                                {formatoData(
                                                    item.previsaoEnvio,
                                                    "DATA_HORA"
                                                )}
                                            </Td>
                                            <Td>
                                                {item.dataEnvio &&
                                                    formatoData(
                                                        item.dataEnvio,
                                                        "DATA_HORA"
                                                    )}
                                            </Td>
                                            <Td>
                                                <Text>
                                                    {item.nomeDestinatario}
                                                </Text>
                                                <Text>{item.destinatario}</Text>
                                            </Td>
                                            <Td>
                                                <Text
                                                    fontWeight="bold"
                                                    color="gray.600"
                                                    mb={1}
                                                >
                                                    {
                                                        item.reguaCobranca
                                                            ?.assunto
                                                    }
                                                </Text>
                                                <Flex gap={2}>
                                                    <Tag
                                                        colorScheme="orange"
                                                        textTransform="capitalize"
                                                    >
                                                        {
                                                            item.reguaCobranca
                                                                ?.tipo
                                                        }
                                                    </Tag>
                                                    <Tag
                                                        colorScheme="orange"
                                                        textTransform="capitalize"
                                                    >
                                                        {
                                                            item.reguaCobranca
                                                                ?.formaEnvio
                                                        }
                                                    </Tag>
                                                </Flex>
                                            </Td>
                                            <Td></Td>
                                            <Td>
                                                {!item.dataEnvio && (
                                                    <Tooltip label="Excluir item">
                                                        <IconButton
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={
                                                                <Icon
                                                                    as={
                                                                        FiTrash2
                                                                    }
                                                                />
                                                            }
                                                            color="red"
                                                            onClick={() =>
                                                                modalExcluir.current.onOpen(
                                                                    item.id
                                                                )
                                                            }
                                                            aria-label="Abrir"
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            Não há contratos cadastrados ou
                                            resultados para o filtro selecionado
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                        <Flex justify="center" py={4} align="center" gap={4}>
                            <Text>
                                {" "}
                                Página {currentPage} de {pages.length}
                            </Text>
                            <Pagination
                                pagesCount={pagesCount}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            >
                                <PaginationContainer gridGap={4}>
                                    <PaginationPrevious
                                        as={IconButton}
                                        icon={<Icon as={FiArrowLeft} />}
                                    ></PaginationPrevious>
                                    {/* <PaginationPageGroup gridGap={4}>
                                        {pages.map((page: number) => (
                                            <PaginationPage
                                                key={`pagination_page_${page}`}
                                                page={page}
                                            />
                                        ))}
                                    </PaginationPageGroup> */}
                                    <PaginationNext
                                        as={IconButton}
                                        icon={<Icon as={FiArrowRight} />}
                                    ></PaginationNext>
                                </PaginationContainer>
                            </Pagination>
                        </Flex>
                    </Box>
                </Box>
            </Layout>
            <ModalContratos ref={modal} />
            <Excluir
                ref={modalExcluir}
                titulo="Excluir item da fila"
                onDelete={onDelete}
            />
        </>
    );
};
export default Home;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
