import { FormDateRange } from "@/components/Form/FormDateRange";
import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { ModalProcesso } from "@/components/Modals/ModalProcesso";
import { ModalContratos } from "@/components/Modals/contratos";
import { FiltroContratos } from "@/components/Pages/FIltroContratos";
import { TabelaPadrao } from "@/components/Tabelas/TabelaPadrao";
import { TooltipAvatar } from "@/components/TooltipAvatar";
import { formatoData, statusFicha, statusProcesso } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import { imo7ApiService } from "@/services/apiServiceUsage";
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
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Checkbox,
    Flex,
    GridItem,
    Icon,
    IconButton,
    Progress,
    ProgressLabel,
    Spinner,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { BsEye } from "react-icons/bs";
import {
    FiArrowLeft,
    FiArrowRight,
    FiEye,
    FiPlus,
    FiTrash,
} from "react-icons/fi";
import { MdPageview } from "react-icons/md";
import { useMutation, useQuery } from "react-query";

const Home = () => {
    const { usuario } = useAuth();
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
            "processos",
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
        imo7ApiService("processo").list,
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
    const TooltipAvatar: typeof Avatar = (props: any) => (
        <Tooltip label={props.name}>
            <Avatar {...props} />
        </Tooltip>
    );
    return (
        <>
            <Layout title="Processos">
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
                            <Flex>
                                {usuario?.permissoes?.includes(
                                    "imobiliaria.processos.cadastrar"
                                ) && (
                                    <Button
                                        size="sm"
                                        leftIcon={<FiPlus />}
                                        colorScheme="blue"
                                        onClick={() => modal.current.onOpen()}
                                    >
                                        Novo Processo
                                    </Button>
                                )}
                            </Flex>
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
                            value: "Codigo",
                            w: 12,
                        },
                        {
                            value: "Imovel",
                            w: 12,
                        },
                        {
                            value: "Fichas",
                        },
                        {
                            value: "Progresso",
                        },
                        {
                            value: "Responsável",
                        },
                        {
                            value: "Status",
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
                                      value: (
                                          <>
                                              {item?.imovel?.codigo} -
                                              {item?.imovel?.endereco},{" "}
                                              {item?.imovel?.numero},{" "}
                                              {item?.imovel?.bairro},{" "}
                                              {item?.imovel?.cidade}/
                                              {item?.imovel?.estado}
                                          </>
                                      ),
                                  },
                                  {
                                      value: (
                                          <>
                                              <AvatarGroup size="xs">
                                                  {item.fichas?.map((f) => (
                                                      <TooltipAvatar
                                                          name={f.descricao}
                                                      />
                                                  ))}
                                              </AvatarGroup>
                                          </>
                                      ),
                                  },
                                  {
                                      value: (
                                          <>
                                              <Progress
                                                  height="20px"
                                                  value={item.fichas?.reduce(
                                                      (acc, item) =>
                                                          item._count
                                                              .preenchimento +
                                                          acc,
                                                      0
                                                  )}
                                                  max={item.fichas?.reduce(
                                                      (acc, item) =>
                                                          Object.entries(
                                                              item.modelo.campos
                                                          ).length + acc,
                                                      0
                                                  )}
                                              >
                                                  <ProgressLabel
                                                      fontSize="sm"
                                                      color="gray.600"
                                                  >
                                                      {Intl.NumberFormat(
                                                          "pt-BR",
                                                          {
                                                              style: "percent", // Define o estilo como porcentagem
                                                              minimumFractionDigits: 2, // Define o número mínimo de casas decimais
                                                              maximumFractionDigits: 2, // Define o número máximo de casas decimais
                                                          }
                                                      ).format(
                                                          item.fichas.reduce(
                                                              (acc, item) =>
                                                                  Number(
                                                                      item
                                                                          ._count
                                                                          .preenchimento
                                                                  ) + acc,
                                                              0
                                                          ) == 0
                                                              ? 0
                                                              : item.fichas.reduce(
                                                                    (
                                                                        acc,
                                                                        item
                                                                    ) =>
                                                                        Number(
                                                                            item
                                                                                ._count
                                                                                .preenchimento
                                                                        ) + acc,
                                                                    0
                                                                ) /
                                                                    item.fichas.reduce(
                                                                        (
                                                                            acc,
                                                                            item
                                                                        ) => {
                                                                            if (
                                                                                Object.entries(
                                                                                    item
                                                                                        .modelo
                                                                                        .campos
                                                                                )
                                                                                    ?.length
                                                                            ) {
                                                                                return (
                                                                                    Object.entries(
                                                                                        item
                                                                                            .modelo
                                                                                            .campos
                                                                                    )
                                                                                        ?.length +
                                                                                    acc
                                                                                );
                                                                            } else {
                                                                                return acc;
                                                                            }
                                                                        },
                                                                        0
                                                                    )
                                                      )}
                                                  </ProgressLabel>
                                              </Progress>
                                          </>
                                      ),
                                  },
                                  {
                                      value: (
                                          <>
                                              <TooltipAvatar
                                                  size="xs"
                                                  name={item?.responsavel?.nome}
                                              />
                                          </>
                                      ),
                                  },
                                  {
                                      value: <>{statusProcesso(item.status)}</>,
                                  },
                              ])
                            : []
                    }
                    filtroAvancado={
                        <>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Pesquisa Geral"
                                    placeholder="O que procura?"
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            query: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Código da Ficha"
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
                                    label="Código do Imóvel"
                                    placeholder="digite um número..."
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            codigoImovel: e.target.value,
                                        })
                                    }
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
            <ModalProcesso ref={modal} />
        </>
    );
};
export default Home;
