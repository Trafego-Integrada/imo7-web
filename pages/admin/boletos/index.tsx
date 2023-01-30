import {
    Box,
    Button,
    Circle,
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
} from "@chakra-ui/react";
import { FormDate } from "@/components/Form/FormDate";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { VscFilePdf } from "react-icons/vsc";
import { useRef, useState } from "react";
import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPage,
    PaginationPageGroup,
    PaginationPrevious,
    usePagination,
} from "@ajna/pagination";
import { useQuery } from "react-query";
import { listarBoletos } from "@/services/models/boleto";
import { formatoData } from "@/helpers/helpers";
import moment from "moment";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { FormDateRange } from "@/components/Form/FormDateRange";

const Cobrancas = () => {
    const modal = useRef();
    const [total, setTotal] = useState();
    const [filtro, setFiltro] = useState({
        dataVencimento: [null, null],
    });
    const { currentPage, setCurrentPage, pagesCount, pages, pageSize } =
        usePagination({
            total: total,
            initialState: { currentPage: 1, pageSize: 15 },
        });
    const { data, isLoading, isFetching } = useQuery(
        ["boletos", { ...filtro, linhas: pageSize, pagina: currentPage }],
        listarBoletos,
        {
            onSuccess: (data) => {
                setTotal(data.data.total);
            },
        }
    );
    return (
        <>
            <Layout title="Cobranças">
                <Box p={5}>
                    <Box bg="graylight" p={5}>
                        <Grid gap={5}>
                            <Grid
                                templateColumns={{
                                    sm: "repeat(1, 1fr)",
                                    md: "repeat(2, 1fr)",
                                    lg: "repeat(5, 1fr)",
                                }}
                                gap={5}
                            >
                                <GridItem>
                                    <FormInput
                                        label="Nº do contrato"
                                        placeholder="digite um número..."
                                        bg="white"
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                codigo: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Nome do inquilino"
                                        placeholder="digite o nome do inquilino..."
                                        bg="white"
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                inquilino: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormDateRange
                                        label="Data Vencimento"
                                        startDate={filtro?.dataVencimento[0]}
                                        endDate={filtro?.dataVencimento[1]}
                                        onChange={(e) => {
                                            setFiltro({
                                                ...filtro,
                                                dataVencimento: e,
                                            });
                                        }}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormSelect
                                        label="status"
                                        bg="white"
                                        placeholder="Selecione..."
                                    >
                                        <option value="">Aberto</option>
                                    </FormSelect>
                                </GridItem>

                                <GridItem>
                                    <FormInput
                                        label="Rua"
                                        placeholder="digite o nome da rua..."
                                        bg="white"
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                endereco: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Número"
                                        placeholder="digite o número da rua..."
                                        bg="white"
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                numero: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Bairro"
                                        placeholder="digite o nome do bairro..."
                                        bg="white"
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                bairro: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Cidade"
                                        placeholder="digite o nome da cidade..."
                                        bg="white"
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                cidade: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Estado"
                                        placeholder="digite o nome do estado..."
                                        bg="white"
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                estado: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                            </Grid>
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
                            />
                        </Box>
                        <Table variant="striped" mt={5} bg="white">
                            <Thead>
                                <Tr>
                                    <Th>Nº do contrato1</Th>
                                    <Th>Data de vencimento</Th>
                                    <Th>Inquilino principal</Th>
                                    <Th>Endereço</Th>
                                    <Th>Status</Th>
                                    <Th>Valor</Th>
                                    <Th>Boletos</Th>
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
                                            <Td>{item.contrato?.codigo}</Td>
                                            <Td>{item.data_vencimen}</Td>
                                            <Td>
                                                {item.contrato?.inquilinos?.map(
                                                    (i) => (
                                                        <Text key={i.id}>
                                                            {i.nome}
                                                        </Text>
                                                    )
                                                )}
                                            </Td>
                                            <Td>
                                                {
                                                    item.contrato?.imovel
                                                        ?.endereco
                                                }
                                                ,{" "}
                                                {item.contrato?.imovel?.numero},{" "}
                                                {item.contrato?.imovel?.bairro},{" "}
                                                {item.contrato?.imovel?.cidade}/
                                                {item.contrato?.imovel?.estado}
                                            </Td>
                                            <Td>
                                                <Grid gap={2}>
                                                    <Circle
                                                        size="5"
                                                        bg="green"
                                                    />
                                                    <Text>Ativo</Text>
                                                </Grid>
                                            </Td>
                                            <Td>{item.valor_doc2}</Td>
                                            <Td>
                                                <IconButton
                                                    size="sm"
                                                    as={VscFilePdf}
                                                    color="red"
                                                />
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            Não encontramos boletos cadastrados
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
                                    <PaginationPageGroup gridGap={4}>
                                        {pages.map((page: number) => (
                                            <PaginationPage
                                                key={`pagination_page_${page}`}
                                                page={page}
                                            />
                                        ))}
                                    </PaginationPageGroup>
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
        </>
    );
};
export default Cobrancas;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
