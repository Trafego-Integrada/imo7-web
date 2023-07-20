import { FormDateRange } from "@/components/Form/FormDateRange";
import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { ModalContratos } from "@/components/Modals/contratos";
import { FiltroContratos } from "@/components/Pages/FIltroContratos";
import { TabelaPadrao } from "@/components/Tabelas/TabelaPadrao";
import { formatoData } from "@/helpers/helpers";
import {
    excluirVariosContratos,
    listarContratos,
} from "@/services/models/contrato";
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
    Flex,
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
import { BsEye } from "react-icons/bs";
import { FiArrowLeft, FiArrowRight, FiEye, FiTrash } from "react-icons/fi";
import { MdPageview } from "react-icons/md";
import { useMutation, useQuery } from "react-query";

const Home = () => {
    const toast = useToast();
    const modal = useRef();
    const [total, setTotal] = useState();

    const [selecionados, setSelecionados] = useState([]);
    const [filtro, setFiltro] = useState({
        dataReajuste: [null, null],
        dataInicio: [null, null],
        dataFim: [null, null],
        dataCriacao: [null, null],
    });
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
            outer: 1,
        },
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
    const deleteMany = useMutation(excluirVariosContratos, {
        onSuccess: () => {
            queryClient.invalidateQueries("boletos");
            toast({
                title: "Sucesso",
                description: "Boletos excluídos com sucesso",
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
            <Layout title="Contratos">
                <TabelaPadrao
                    acoes={
                        <>
                            <Button
                                size="sm"
                                leftIcon={<FiTrash />}
                                colorScheme="red"
                                variant="outline"
                                disabled={selecionados.length ? false : true}
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
                                                    !selecionados.includes(item)
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
                                        data?.data?.data?.map((item) => item.id)
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
                            value: "Data Início",
                            w: 12,
                        },
                        {
                            value: "Data Reajuste",
                        },
                        {
                            value: "Inquilinos",
                        },
                        {
                            value: "Endereço",
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
                                                                  i !== item.id
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
                                              <IconButton
                                                  variant="ghost"
                                                  size="sm"
                                                  icon={<FiEye />}
                                                  color="bluelight"
                                                  onClick={() =>
                                                      modal.current.onOpen(
                                                          item.id
                                                      )
                                                  }
                                                  aria-label="Abrir"
                                              />
                                          </Flex>
                                      ),
                                  },
                                  {
                                      value: item?.codigo,
                                  },

                                  {
                                      value: item.dataInicio
                                          ? formatoData(item.dataInicio, "DATA")
                                          : "Não informada",
                                  },
                                  {
                                      value: item.dataReajuste
                                          ? formatoData(
                                                item.dataReajuste,
                                                "DATA"
                                            )
                                          : "Não informada",
                                  },
                                  {
                                      value: (
                                          <>
                                              {item.inquilinos.map((item) => (
                                                  <Text key={item.id}>
                                                      {item.nome}
                                                  </Text>
                                              ))}
                                          </>
                                      ),
                                  },
                                  {
                                      value: (
                                          <>
                                              {item?.imovel?.endereco},{" "}
                                              {item?.imovel?.numero},{" "}
                                              {item?.imovel?.bairro},{" "}
                                              {item?.imovel?.cidade}/
                                              {item?.imovel?.estado}
                                          </>
                                      ),
                                      whiteSpace: "pre-wrap",
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
                                    label="Dia de vencimento"
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            vencimento: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>
                            <GridItem>
                                <FormDateRange
                                    size="sm"
                                    label="Data de Reajuste"
                                    startDate={filtro?.dataReajuste[0]}
                                    endDate={filtro?.dataReajuste[1]}
                                    onChange={(e) => {
                                        setFiltro({
                                            ...filtro,
                                            dataReajuste: e,
                                        });
                                    }}
                                />
                            </GridItem>
                            <GridItem>
                                <FormDateRange
                                    size="sm"
                                    label="Data de Início do Contrato"
                                    startDate={filtro?.dataInicio[0]}
                                    endDate={filtro?.dataInicio[1]}
                                    onChange={(e) => {
                                        setFiltro({ ...filtro, dataInicio: e });
                                    }}
                                />
                            </GridItem>
                            <GridItem>
                                <FormDateRange
                                    size="sm"
                                    label="Data Final do Contrato"
                                    startDate={filtro?.dataFim[0]}
                                    endDate={filtro?.dataFim[1]}
                                    onChange={(e) => {
                                        setFiltro({ ...filtro, dataFim: e });
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
                                <FormInput
                                    size="sm"
                                    label="Nome do proprietário"
                                    placeholder="digite o nome do proprietário..."
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            proprietario: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Nome do inquilino"
                                    placeholder="digite o nome do inquilino..."
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            inquilino: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Nome do fiador"
                                    placeholder="digite o nome do fiador..."
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            fiador: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Rua"
                                    placeholder="digite o nome da rua..."
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
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            filtro: {
                                                ...filtro.filtro,
                                                cidade: e.target.value,
                                            },
                                        })
                                    }
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Estado"
                                    placeholder="digite o nome do estado..."
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            estado: {
                                                ...filtro.filtro,
                                                query: e.target.value,
                                            },
                                        })
                                    }
                                />
                            </GridItem>
                        </>
                    }
                />
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
