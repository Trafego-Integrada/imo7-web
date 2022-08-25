import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPrevious,
    usePagination,
} from "@ajna/pagination";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Spinner,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { MdPageview } from "react-icons/md";
import { useQuery } from "react-query";
import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { ModalPropietarios } from "@/components/Modals/propietarios";
import { listarUsuarios } from "@/services/models/usuario";
import { withSSRAuth } from "../../../utils/withSSRAuth";

const Propietarios = () => {
    const modalpropietarios = useRef();
    const [total, setTotal] = useState();
    const [filtro, setFiltro] = useState({});
    const { currentPage, setCurrentPage, pagesCount, pages, pageSize } =
        usePagination({
            total: total,
            initialState: { currentPage: 1, pageSize: 15 },
        });
    const { data, isLoading, isFetching } = useQuery(
        [
            "usuarios",
            {
                ...filtro,
                linhas: pageSize,
                pagina: currentPage,
                proprietario: true,
            },
        ],
        listarUsuarios,
        {
            onSuccess: (data) => {
                setTotal(data.data.total);
            },
        }
    );
    return (
        <>
            <Layout title="Propietários">
                <Box p={5}>
                    <Box bg="graylight" p={5}>
                        <Grid
                            gap={5}
                            templateColumns={{
                                sm: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                            }}
                        >
                            <GridItem>
                                <FormInput
                                    label="Propietários"
                                    placeholder="digite o nome do propietário..."
                                    bg="white"
                                    value={filtro.nome}
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            nome: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="CPF/CNPJ"
                                    placeholder="digite o cpf ou cnpj..."
                                    bg="white"
                                    value={filtro.documento}
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            documento: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="Email"
                                    placeholder="digite o número do email..."
                                    bg="white"
                                    value={filtro.email}
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>
                        </Grid>
                        <Box
                            w="100%"
                            mt={5}
                            d="flex"
                            gap={5}
                            justifyContent="flex-end"
                        >
                            <Button
                                size="md"
                                bg="none"
                                border="1px solid red"
                                _hover={{
                                    bg: "red",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                                _focus={{ bg: "none" }}
                                _active={{ bg: "none" }}
                                color="red"
                                onClick={() => {
                                    setFiltro({
                                        nome: "",
                                        documento: "",
                                        email: "",
                                        filtro: "",
                                    });
                                }}
                            >
                                Limpar Filtro
                            </Button>

                            <Button
                                size="md"
                                bg="none"
                                border="1px solid black"
                                _hover={{
                                    bg: "black",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                                _focus={{ bg: "none" }}
                                _active={{ bg: "none" }}
                                color="black"
                            >
                                Filtrar
                            </Button>
                        </Box>
                    </Box>

                    <Box bg="graylight" overflowX="auto" p={5} mt={5}>
                        <Box p={5} bg="white">
                            <FormInput
                                bg="white"
                                w="max"
                                placeholder="Busca rápida..."
                                value={filtro.filtro}
                                onChange={(e) =>
                                    setFiltro({
                                        ...filtro,
                                        filtro: e.target.value,
                                    })
                                }
                            />
                        </Box>

                        <Table variant="striped" mt={5} bg="white">
                            <Thead>
                                <Tr>
                                    <Th>Propietário</Th>
                                    <Th>CPF/CNPJ</Th>
                                    <Th>Email</Th>
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
                                            <Td>{item.nome}</Td>
                                            <Td>{item.documento}</Td>
                                            <Td>{item.email}</Td>
                                            <Td>
                                                <IconButton
                                                    as={MdPageview}
                                                    color="bluelight"
                                                    onClick={() =>
                                                        modalpropietarios.current.onOpen(
                                                            item.id
                                                        )
                                                    }
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
            <ModalPropietarios ref={modalpropietarios} />
        </>
    );
};
export default Propietarios;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    ["imobiliaria"]
);
