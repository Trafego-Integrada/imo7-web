import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPage,
    PaginationPageGroup,
    PaginationPrevious,
    usePagination,
} from "@ajna/pagination";
import {
    Box,
    Button,
    Collapse,
    Flex,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Spinner,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { IoIosRemoveCircle } from "react-icons/io";
import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
    MdPageview,
} from "react-icons/md";
import { useQuery } from "react-query";
import { FormDate } from "@/components/Form/FormDate";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { ModalContratos } from "@/components/Modals/contratos";
import { FiltroContratos } from "@/components/Pages/FIltroContratos";
import { Paginator } from "@/components/Paginator";
import { formatoData } from "@/helpers/helpers";
import { listarContratos } from "@/services/models/contrato";
import { withSSRAuth } from "@/utils/withSSRAuth";

const Home = () => {
    const modal = useRef();
    const [total, setTotal] = useState();
    const [filtro, setFiltro] = useState({
        dataReajuste: [null, null],
        dataInicio: [null, null],
        dataFim: [null, null],
        dataCriacao: [null, null],
    });
    const { currentPage, setCurrentPage, pagesCount, pages, pageSize } =
        usePagination({
            total: total,
            initialState: { currentPage: 1, pageSize: 15 },
        });
    const { data, isLoading, isFetching } = useQuery(
        [
            "contratos",
            {
                ...filtro,
                dataReajuste: filtro.dataReajuste[0]
                    ? JSON.stringify(filtro.dataReajuste)
                    : null,
                dataInicio: filtro.dataInicio[0]
                    ? JSON.stringify(filtro.dataInicio)
                    : null,
                dataFim: filtro.dataFim[0]
                    ? JSON.stringify(filtro.dataFim)
                    : null,
                dataCriacao: filtro.dataCriacao[0]
                    ? JSON.stringify(filtro.dataCriacao)
                    : null,
                linhas: pageSize,
                pagina: currentPage,
            },
        ],
        listarContratos,
        {
            onSuccess: (data) => {
                setTotal(data.data.total);
            },
        }
    );
    return (
        <>
            <Layout title="Contratos">
                <Box p={5}>
                    <FiltroContratos filtro={filtro} setFiltro={setFiltro} />

                    <Box bg="white" overflowX="auto" p={5} mt={5}>
                        <Flex gap={4} align="center" justify="space-between">
                            <Text fontSize="sm" color="gray">
                                <Text as="span" fontWeight="bold">
                                    {total}
                                </Text>{" "}
                                contratos
                            </Text>
                            <Flex align="center" gap={2}>
                                <FormInput
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
                                    <Th>Nº do contrato</Th>
                                    <Th>Data de início</Th>
                                    <Th>Data de reajuste</Th>
                                    <Th>Inquilinos</Th>
                                    <Th>Endereço</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {isLoading ? (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            <Spinner />
                                        </Td>
                                    </Tr>
                                ) : data && data.data.data.length > 0 ? (
                                    data.data.data.map((item) => (
                                        <Tr key={item.id}>
                                            <Td>{item.codigo}</Td>
                                            <Td>
                                                {item.dataInicio &&
                                                    formatoData(
                                                        item.dataInicio,
                                                        "DATA"
                                                    )}
                                            </Td>
                                            <Td>
                                                {item.dataReajuste &&
                                                    formatoData(
                                                        item.dataReajuste,
                                                        "DATA"
                                                    )}
                                            </Td>
                                            <Td>
                                                {item.inquilinos.map((item) => (
                                                    <Text key={item.id}>
                                                        {item.nome}
                                                    </Text>
                                                ))}
                                            </Td>
                                            <Td>
                                                {item.imovel?.endereco},{" "}
                                                {item.imovel?.numero},{" "}
                                                {item.imovel?.bairro},{" "}
                                                {item.imovel?.cidade}/
                                                {item.imovel?.estado}
                                            </Td>
                                            <Td>
                                                <IconButton
                                                    as={MdPageview}
                                                    color="bluelight"
                                                    onClick={() =>
                                                        modal.current.onOpen(
                                                            item.id
                                                        )
                                                    }
                                                    aria-label="Abrir"
                                                />
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
                        <Flex justify="center" py={4}>
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
