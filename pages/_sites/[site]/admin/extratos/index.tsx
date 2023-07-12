import { FormDateRange } from "@/components/Form/FormDateRange";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { TabelaPadrao } from "@/components/Tabelas/TabelaPadrao";
import { formatoData, formatoValor } from "@/helpers/helpers";
import {
    excluirVariosExtratos,
    listarExtratos,
} from "@/services/models/extrato";
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
    Button,
    Checkbox,
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
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiTrash } from "react-icons/fi";
import { VscFilePdf } from "react-icons/vsc";
import { useMutation, useQuery } from "react-query";

const Cobrancas = () => {
    const toast = useToast();
    const modal = useRef();
    const [total, setTotal] = useState();
    const [filtro, setFiltro] = useState({
        dataVencimento: [null, null],
        dataDeposito: [null, null],
        dataCriacao: [null, null],
    });
    const [selecionados, setSelecionados] = useState([]);
    const {
        currentPage,
        setCurrentPage,
        pagesCount,
        pages,
        pageSize,
        setPageSize,
    } = usePagination({
        total: total,
        limits: {
            inner: 1,
            outer: 2,
        },
        initialState: { currentPage: 1, pageSize: 15 },
    });

    const { data, isLoading, isFetching } = useQuery(
        [
            "extratos",
            {
                ...filtro,
                dataVencimento: filtro.dataVencimento[0]
                    ? JSON.stringify(filtro.dataVencimento)
                    : null,
                dataCriacao: filtro.dataCriacao[0]
                    ? JSON.stringify(filtro.dataCriacao)
                    : null,
                linhas: pageSize,
                pagina: currentPage,
            },
        ],
        listarExtratos,
        {
            onSuccess: (data) => {
                setTotal(data.data.total);
            },
        }
    );
    const deleteMany = useMutation(excluirVariosExtratos, {
        onSuccess: () => {
            queryClient.invalidateQueries("extratos");
            toast({
                title: "Sucesso",
                description: "Extratos excluídos com sucesso",
                status: "success",
                duration: 3000,
            });
        },
    });

    const onDeleteMany = () => {
        deleteMany.mutate(JSON.stringify(selecionados));
        setSelecionados([]);
    };
    return (
        <>
            <Layout title="Extratos">
                <Box p={5}>
                    <TabelaPadrao
                        acoes={
                            <>
                                <Button
                                    size="sm"
                                    leftIcon={<FiTrash />}
                                    colorScheme="red"
                                    variant="outline"
                                    disabled={
                                        selecionados.length ? false : true
                                    }
                                    onClick={onDeleteMany}
                                >
                                    Excluir Selecionados
                                </Button>
                            </>
                        }
                        total={total}
                        isLoading={isLoading}
                        paginatorProps={{
                            currentPage,
                            pagesCount,
                            setCurrentPage,
                            pages,
                            pageSize,
                            setPageSize,
                        }}
                        head={[
                            {
                                value: (
                                    <Checkbox
                                        isChecked={
                                            data?.data?.data
                                                ?.map((item) => item.id)
                                                .filter(
                                                    (item) =>
                                                        !selecionados.includes(
                                                            item
                                                        )
                                                ).length == 0
                                                ? true
                                                : false
                                        }
                                        onChange={(e) =>
                                            setSelecionados(
                                                e.target.checked
                                                    ? JSON.parse(e.target.value)
                                                    : []
                                            )
                                        }
                                        value={JSON.stringify(
                                            data?.data?.data?.map(
                                                (item) => item.id
                                            )
                                        )}
                                    />
                                ),
                            },
                            {
                                value: "Ações",
                                w: 12,
                                textAlign: "center",
                            },
                            {
                                value: "Nº Contrato",
                                w: 12,
                            },
                            {
                                value: "Nº Parcela",
                                w: 12,
                            },
                            {
                                value: "Vencimento",
                            },
                            {
                                value: "Deposito",
                            },
                            {
                                value: "Proprietários",
                            },
                            {
                                value: "Endereço",
                            },
                            {
                                value: "Valor",
                            },
                        ]}
                        data={
                            data?.data?.data?.length > 0
                                ? data?.data?.data?.map((item, key) => [
                                      {
                                          value: (
                                              <Checkbox
                                                  isChecked={selecionados.includes(
                                                      item.id
                                                  )}
                                                  onChange={(e) => {
                                                      if (e.target.checked) {
                                                          setSelecionados([
                                                              ...selecionados,
                                                              item.id,
                                                          ]);
                                                      } else {
                                                          setSelecionados(
                                                              selecionados.filter(
                                                                  (i) =>
                                                                      i !==
                                                                      item.id
                                                              )
                                                          );
                                                      }
                                                  }}
                                              />
                                          ),
                                      },
                                      {
                                          value: (
                                              <Flex gap={2} justify="center">
                                                  <Link
                                                      href={`https://www.imo7.com.br/api/extrato/${item.id}/pdf`}
                                                      // href={`http://localhost:3000/api/extrato/${item.id}/pdf`}
                                                      target="_blank"
                                                      passHref
                                                  >
                                                      <IconButton
                                                          size="sm"
                                                          icon={<VscFilePdf />}
                                                          color="red"
                                                          variant="ghost"
                                                      />
                                                  </Link>
                                              </Flex>
                                          ),
                                      },
                                      {
                                          value: item.contrato?.codigo,
                                      },
                                      {
                                          value: item.parcela,
                                      },
                                      {
                                          value: item.vencimento
                                              ? formatoData(item.vencimento)
                                              : "Não informada",
                                      },
                                      {
                                          value: item.dataDeposito
                                              ? formatoData(item.dataDeposito)
                                              : "Não informada",
                                      },
                                      {
                                          value: item.contrato?.proprietarios?.map(
                                              (i) => (
                                                  <Text key={i.id}>
                                                      {i.nome}
                                                  </Text>
                                              )
                                          ),
                                      },
                                      {
                                          value: (
                                              <>
                                                  {
                                                      item.contrato?.imovel
                                                          ?.endereco
                                                  }
                                                  ,{" "}
                                                  {
                                                      item.contrato?.imovel
                                                          ?.numero
                                                  }
                                                  ,{" "}
                                                  {
                                                      item.contrato?.imovel
                                                          ?.bairro
                                                  }
                                                  ,{" "}
                                                  {
                                                      item.contrato?.imovel
                                                          ?.cidade
                                                  }
                                                  /
                                                  {
                                                      item.contrato?.imovel
                                                          ?.estado
                                                  }
                                              </>
                                          ),
                                          whiteSpace: "pre-wrap",
                                      },
                                      {
                                          value: formatoValor(
                                              item.itens.reduce((acc, item) => {
                                                  return (
                                                      acc + Number(item.valor)
                                                  );
                                              }, 0)
                                          ),
                                      },
                                  ])
                                : []
                        }
                        filtroAvancado={
                            <>
                                <GridItem>
                                    <FormInput
                                        size="sm"
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
                                        size="sm"
                                        label="Nome do proprietário"
                                        placeholder="digite o nome do proprietário..."
                                        bg="white"
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                proprietario: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormDateRange
                                        size="sm"
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
                                    <FormDateRange
                                        size="sm"
                                        label="Data Depósito"
                                        startDate={filtro?.dataDeposito[0]}
                                        endDate={filtro?.dataDeposito[1]}
                                        onChange={(e) => {
                                            setFiltro({
                                                ...filtro,
                                                dataDeposito: e,
                                            });
                                        }}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormDateRange
                                        size="sm"
                                        label="Data de Criação"
                                        startDate={filtro?.dataCriacao[0]}
                                        endDate={filtro?.dataCriacao[1]}
                                        onChange={(e) => {
                                            setFiltro({
                                                ...filtro,
                                                dataCriacao: e,
                                            });
                                        }}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormSelect
                                        size="sm"
                                        label="status"
                                        bg="white"
                                        placeholder="Selecione..."
                                    >
                                        <option value="">Aberto</option>
                                    </FormSelect>
                                </GridItem>

                                <GridItem>
                                    <FormInput
                                        size="sm"
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
                                        size="sm"
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
                                        size="sm"
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
                                        size="sm"
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
                                        size="sm"
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
                            </>
                        }
                    />
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
