import { Excluir } from "@/components/AlertDialogs/Excluir";
import { FormDateRange } from "@/components/Form/FormDateRange";
import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { ModalContratos } from "@/components/Modals/contratos";
import { FiltroContratos } from "@/components/Pages/FIltroContratos";
import { FiltroFilaEnvio } from "@/components/Pages/FiltroFilaEnvio";
import { TabelaPadrao } from "@/components/Tabelas/TabelaPadrao";
import { formatoData } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import { listarContratos } from "@/services/models/contrato";
import {
    excluirFilaEnvio,
    excluirVariosFilaEnvio,
    listarFilaEnvio,
} from "@/services/models/filaEnvio";
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
    const { usuario } = useAuth();
    const toast = useToast();
    const modal = useRef();
    const [total, setTotal] = useState();
    const [selecionados, setSelecionados] = useState([]);
    const [filtro, setFiltro] = useState({
        previsaoEnvio: [null, null],
        dataEnvio: [null, null],
        createdAt: [null, null],
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
    const deleteMany = useMutation(excluirVariosFilaEnvio, {
        onSuccess: () => {
            queryClient.invalidateQueries("filaEnvio");
            toast({
                title: "Sucesso",
                description: "Itens da fila excluídos com sucesso",
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
            <Layout title="Fila de Envio">
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
                                        selecionados.length &&
                                        usuario.permissoes.find(
                                            (i) =>
                                                i ==
                                                "imobiliaria.filaEnvio.excluir"
                                        )
                                            ? false
                                            : true
                                    }
                                    onClick={onDeleteMany}
                                >
                                    Excluir Selecionados
                                </Button>
                            </>
                        }
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
                                        isDisabled={
                                            usuario?.permissoes?.find(
                                                (i) =>
                                                    i ==
                                                    "imobiliaria.filaEnvio.excluir"
                                            )
                                                ? false
                                                : true
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
                                w: 12,
                            },
                            {
                                value: "Ações",
                                w: 12,
                                textAlign: "center",
                            },
                            {
                                value: "Previsão",
                                w: 24,
                            },
                            {
                                value: "Data envio",
                                w: 24,
                            },
                            {
                                value: "Destinatário",
                                w: 72,
                            },
                            {
                                value: "Assunto",
                            },
                        ]}
                        data={
                            data?.data?.length > 0
                                ? data?.data?.map((item, key) => [
                                      {
                                          value: (
                                              <Checkbox
                                                  isChecked={selecionados.includes(
                                                      item.id
                                                  )}
                                                  isDisabled={
                                                      usuario?.permissoes?.find(
                                                          (i) =>
                                                              i ==
                                                              "imobiliaria.filaEnvio.excluir"
                                                      )
                                                          ? false
                                                          : true
                                                  }
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
                                                              isDisabled={
                                                                  usuario.permissoes.find(
                                                                      (i) =>
                                                                          i ==
                                                                          "imobiliaria.filaEnvio.excluir"
                                                                  )
                                                                      ? false
                                                                      : true
                                                              }
                                                          />
                                                      </Tooltip>
                                                  )}
                                              </Flex>
                                          ),
                                      },
                                      {
                                          value: formatoData(
                                              item.previsaoEnvio,
                                              "DATA_HORA"
                                          ),
                                      },
                                      {
                                          value:
                                              item.dataEnvio &&
                                              formatoData(
                                                  item.dataEnvio,
                                                  "DATA_HORA"
                                              ),
                                      },
                                      {
                                          value: (
                                              <>
                                                  <Text>
                                                      {item.nomeDestinatario}
                                                  </Text>
                                                  <Text>
                                                      {item.destinatario}
                                                  </Text>
                                              </>
                                          ),
                                      },
                                      {
                                          value: (
                                              <>
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
                                              </>
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
                                        label="Nome do Destinatario"
                                        placeholder="digite um nome..."
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                nomeDestinatario:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="E-mail do destinatario"
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                destinatario: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormDateRange
                                        size="sm"
                                        label="Previsão de envio"
                                        startDate={filtro?.previsaoEnvio[0]}
                                        endDate={filtro?.previsaoEnvio[1]}
                                        onChange={(e) => {
                                            setFiltro({
                                                ...filtro,
                                                previsaoEnvio: e,
                                            });
                                        }}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormDateRange
                                        size="sm"
                                        label="Data do Envio"
                                        startDate={filtro?.dataEnvio[0]}
                                        endDate={filtro?.dataEnvio[1]}
                                        onChange={(e) => {
                                            setFiltro({
                                                ...filtro,
                                                dataEnvio: e,
                                            });
                                        }}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormDateRange
                                        size="sm"
                                        label="Data de Criação"
                                        startDate={filtro?.createdAt[0]}
                                        endDate={filtro?.createdAt[1]}
                                        onChange={(e) => {
                                            setFiltro({
                                                ...filtro,
                                                createdAt: e,
                                            });
                                        }}
                                    />
                                </GridItem>
                            </>
                        }
                    />
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
