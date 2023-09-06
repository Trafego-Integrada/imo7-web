import { Excluir } from "@/components/AlertDialogs/Excluir";
import { FormDateRange } from "@/components/Form/FormDateRange";
import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { Layout } from "@/components/Layout/layout";
import { ModalFichaCadastral } from "@/components/Modals/ModalFichaCadastral";
import { ModalProcesso } from "@/components/Modals/ModalProcesso";
import { ModalRevisaoFichaCadastral } from "@/components/Modals/ModalRevisaoFichaCadastral";
import { ModalValidar } from "@/components/Modals/ModalValidar";
import { Filtro } from "@/components/Tabelas/TabelaPadrao/Filtro";
import { TooltipAvatar } from "@/components/TooltipAvatar";
import {
    statusFicha,
    statusFichaTag,
    statusProcesso,
    tipoFicha,
} from "@/helpers/helpers";
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
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Avatar,
    AvatarGroup,
    Badge,
    Box,
    Button,
    Center,
    Checkbox,
    Divider,
    Flex,
    GridItem,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Progress,
    ProgressLabel,
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
import Link from "next/link";
import { useRef, useState } from "react";
import { BsEye } from "react-icons/bs";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import {
    FiArrowLeft,
    FiArrowRight,
    FiEdit,
    FiEye,
    FiLink,
    FiPlus,
    FiTrash,
} from "react-icons/fi";
import { MdOutlineVerifiedUser, MdPageview } from "react-icons/md";
import { useMutation, useQuery } from "react-query";

const Home = ({ query }) => {
    const { usuario } = useAuth();
    const toast = useToast();
    const modalProcesso = useRef();
    const modal = useRef();
    const modalExcluir = useRef();
    const modalRevisar = useRef();
    const modalValidar = useRef();
    const [total, setTotal] = useState();

    const [selecionados, setSelecionados] = useState([]);
    const [filtro, setFiltro] = useState({
        dataReajuste: [null, null],
        dataInicio: [null, null],
        dataFim: [null, null],
        dataCriacao: [null, null],
        status:
            query?.status && Array.isArray(query.status)
                ? query?.status
                : query?.status
                ? [query?.status]
                : ["EM_ANDAMENTO"],
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
                status: filtro.status[0] ? JSON.stringify(filtro.status) : null,
                linhas: pageSize,
                pagina: currentPage,
            },
        ],
        imo7ApiService("processo").list,
        {
            onSuccess: (data) => {
                setTotal(data.data.total);
            },
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    const deleteMany = useMutation(imo7ApiService("processo").deleteMany, {
        onSuccess: () => {
            queryClient.invalidateQueries("processos");
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
    const excluirFicha = useMutation(imo7ApiService("fichaCadastral").delete);

    const onDelete = async (id) => {
        await excluirFicha.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Ficha excluida",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["fichas"]);
            },
        });
    };
    const listaStatus = [
        {
            label: "Em Andamento",
            value: "EM_ANDAMENTO",
        },
        {
            label: "Cancelado",
            value: "CANCELADO",
        },
        {
            label: "Arquivado",
            value: "ARQUIVADO",
        },
        {
            label: "Completo",
            value: "COMPLETO",
        },
        {
            label: "Aprovado",
            value: "APROVADO",
        },
        {
            label: "Reprovado",
            value: "REPROVADO",
        },
    ];
    return (
        <>
            <Layout title="Processos">
                <Flex flexDir="column" gap={2} p={4}>
                    <Filtro
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
                                <GridItem>
                                    <FormMultiSelect
                                        size="sm"
                                        label="Status"
                                        options={listaStatus}
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                status: e.map((i) => i.value),
                                            })
                                        }
                                        value={listaStatus.filter((e) =>
                                            filtro.status.find(
                                                (i) => i == e.value
                                            )
                                        )}
                                        isMulti
                                    />
                                </GridItem>
                            </>
                        }
                    />
                    <Flex justify="space-between">
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
                                    onClick={() =>
                                        modalProcesso.current.onOpen()
                                    }
                                >
                                    Novo Processo
                                </Button>
                            )}
                        </Flex>
                    </Flex>

                    <Flex flexDir="column" gap={4}>
                        {data?.data?.data?.length > 0 ? (
                            data?.data?.data?.map((item, key) => (
                                <Accordion
                                    key={item.id}
                                    defaultIndex={0}
                                    allowToggle
                                    allowMultiple
                                    rounded="lg"
                                    bg="white"
                                    shadow="base"
                                >
                                    <AccordionItem border="none">
                                        <AccordionButton
                                            border="none"
                                            roundedTop="lg"
                                        >
                                            <Box fontSize="sm" w="full">
                                                <Flex
                                                    align="center"
                                                    gap={4}
                                                    w="full"
                                                >
                                                    <Checkbox
                                                        isChecked={selecionados.includes(
                                                            item.id
                                                        )}
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.checked
                                                            ) {
                                                                setSelecionados(
                                                                    [
                                                                        ...selecionados,
                                                                        item.id,
                                                                    ]
                                                                );
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
                                                    />{" "}
                                                    <Center>
                                                        <Divider
                                                            h={6}
                                                            orientation="vertical"
                                                        />
                                                    </Center>
                                                    <IconButton
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<FiEye />}
                                                        onClick={() =>
                                                            modalProcesso.current.onOpen(
                                                                item.id
                                                            )
                                                        }
                                                        aria-label="Abrir"
                                                    />
                                                    <Center>
                                                        <Divider
                                                            h={6}
                                                            orientation="vertical"
                                                        />
                                                    </Center>
                                                    <Text>#{item?.codigo}</Text>
                                                    <Center>
                                                        <Divider
                                                            h={6}
                                                            orientation="vertical"
                                                        />
                                                    </Center>
                                                    <>
                                                        {statusProcesso(
                                                            item.status
                                                        )}
                                                    </>
                                                    <Center>
                                                        <Divider
                                                            h={6}
                                                            orientation="vertical"
                                                        />
                                                    </Center>
                                                    <Box
                                                        gap={2}
                                                        textAlign="left"
                                                    >
                                                        <Text
                                                            fontSize="xs"
                                                            fontWeight="bold"
                                                            color="gray"
                                                        >
                                                            Imóvel
                                                        </Text>
                                                        <Text>
                                                            {
                                                                item?.imovel
                                                                    ?.codigo
                                                            }{" "}
                                                            -
                                                            {
                                                                item?.imovel
                                                                    ?.endereco
                                                            }
                                                            ,{" "}
                                                            {
                                                                item?.imovel
                                                                    ?.numero
                                                            }
                                                            ,{" "}
                                                            {
                                                                item?.imovel
                                                                    ?.bairro
                                                            }
                                                            ,{" "}
                                                            {
                                                                item?.imovel
                                                                    ?.cidade
                                                            }
                                                            /
                                                            {
                                                                item?.imovel
                                                                    ?.estado
                                                            }
                                                        </Text>
                                                    </Box>
                                                    <Center>
                                                        <Divider
                                                            h={6}
                                                            orientation="vertical"
                                                        />
                                                    </Center>
                                                    <Flex>
                                                        <AvatarGroup size="xs">
                                                            {item.fichas?.map(
                                                                (f) => (
                                                                    <TooltipAvatar
                                                                        name={
                                                                            f.nome
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </AvatarGroup>
                                                    </Flex>
                                                    <Center>
                                                        <Divider
                                                            h={6}
                                                            orientation="vertical"
                                                        />
                                                    </Center>
                                                    {/* <>
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
                                                                        item
                                                                            .modelo
                                                                            .campos
                                                                    ).length +
                                                                    acc,
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
                                                                        (
                                                                            acc,
                                                                            item
                                                                        ) =>
                                                                            Number(
                                                                                item
                                                                                    ._count
                                                                                    .preenchimento
                                                                            ) +
                                                                            acc,
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
                                                                                  ) +
                                                                                  acc,
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
                                                    </> */}
                                                    {/* <Center>
                                                        <Divider
                                                            h={6}
                                                            orientation="vertical"
                                                        />
                                                    </Center> */}
                                                    <TooltipAvatar
                                                        size="xs"
                                                        name={
                                                            item?.responsavel
                                                                ?.nome
                                                        }
                                                    />
                                                </Flex>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel p={0}>
                                            <Divider />
                                            <Table size="sm">
                                                <Tbody>
                                                    {item?.fichas?.map(
                                                        (item) => (
                                                            <Tr key={item.id}>
                                                                <Td
                                                                    p={0}
                                                                    w={12}
                                                                >
                                                                    {" "}
                                                                    <Flex
                                                                        gap={2}
                                                                        justify="center"
                                                                    >
                                                                        <Menu>
                                                                            <MenuButton>
                                                                                <IconButton
                                                                                    icon={
                                                                                        <CgMoreVerticalAlt />
                                                                                    }
                                                                                    size="xs"
                                                                                    rounded="full"
                                                                                    colorScheme="blue"
                                                                                    variant="outline"
                                                                                />
                                                                            </MenuButton>
                                                                            <MenuList>
                                                                                <MenuItem
                                                                                    icon={
                                                                                        <MdOutlineVerifiedUser />
                                                                                    }
                                                                                    onClick={() =>
                                                                                        modalRevisar.current.onOpen(
                                                                                            item.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Revisar
                                                                                    Ficha
                                                                                </MenuItem>
                                                                                <MenuItem
                                                                                    icon={
                                                                                        <FiEdit />
                                                                                    }
                                                                                    onClick={() =>
                                                                                        modal.current.onOpen(
                                                                                            item.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Editar
                                                                                    Ficha
                                                                                </MenuItem>
                                                                                <MenuItem
                                                                                    icon={
                                                                                        <FiLink />
                                                                                    }
                                                                                    onClick={() => {
                                                                                        navigator.clipboard.writeText(
                                                                                            `${window.location.origin}/fichaCadastral/${item.id}`
                                                                                        );
                                                                                        toast(
                                                                                            {
                                                                                                title: "URL Copiada",
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    Copiar
                                                                                    URL
                                                                                    da
                                                                                    Ficha
                                                                                </MenuItem>
                                                                                <MenuItem
                                                                                    as={
                                                                                        Link
                                                                                    }
                                                                                    icon={
                                                                                        <FiEye />
                                                                                    }
                                                                                    href={`/fichaCadastral/${item.id}`}
                                                                                    target="_blank"
                                                                                >
                                                                                    Visualizar
                                                                                    Ficha
                                                                                </MenuItem>
                                                                                <MenuItem
                                                                                    icon={
                                                                                        <FaFileExcel />
                                                                                    }
                                                                                    onClick={() =>
                                                                                        exportToExcel(
                                                                                            item.preenchimento,
                                                                                            "ficha-cadastral-" +
                                                                                                item.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Exportar
                                                                                    para
                                                                                    Excel
                                                                                </MenuItem>
                                                                                <MenuItem
                                                                                    as={
                                                                                        Link
                                                                                    }
                                                                                    icon={
                                                                                        <FaFilePdf />
                                                                                    }
                                                                                    href={`https://www.imo7.com.br/api/fichaCadastral/${item.id}/pdf`}
                                                                                    target="_blank"
                                                                                    passHref
                                                                                >
                                                                                    Gerar
                                                                                    PDF
                                                                                </MenuItem>
                                                                                <MenuItem
                                                                                    icon={
                                                                                        <FiTrash />
                                                                                    }
                                                                                    onClick={() => {
                                                                                        modalExcluir.current.onOpen(
                                                                                            item.id
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    Excluir
                                                                                    Ficha
                                                                                </MenuItem>
                                                                            </MenuList>
                                                                        </Menu>
                                                                    </Flex>
                                                                </Td>
                                                                <Td w={12}>
                                                                    {statusFichaTag(
                                                                        item.status
                                                                    )}
                                                                </Td>
                                                                <Td w={44}>
                                                                    <>
                                                                        <Text>
                                                                            {
                                                                                item
                                                                                    .modelo
                                                                                    ?.nome
                                                                            }
                                                                        </Text>
                                                                        <Text
                                                                            fontSize="xs"
                                                                            color="gray"
                                                                        >
                                                                            {tipoFicha(
                                                                                item
                                                                                    .modelo
                                                                                    ?.tipo
                                                                            )}
                                                                        </Text>
                                                                    </>
                                                                </Td>
                                                                <Td w={32}>
                                                                    <>
                                                                        <Text fontWeight="bold">
                                                                            {
                                                                                item.nome
                                                                            }
                                                                        </Text>
                                                                        <Text fontSize="xs">
                                                                            {
                                                                                item.descricao
                                                                            }
                                                                        </Text>
                                                                    </>
                                                                </Td>
                                                                <Td>
                                                                    <>
                                                                        <Tooltip
                                                                            label={`Responsável: ${item?.responsavel?.nome}`}
                                                                            hasArrow
                                                                        >
                                                                            <Avatar
                                                                                size="xs"
                                                                                name={
                                                                                    item
                                                                                        ?.responsavel
                                                                                        ?.nome
                                                                                }
                                                                            />
                                                                        </Tooltip>
                                                                    </>
                                                                </Td>
                                                                <Td>
                                                                    <>
                                                                        <Box pos="relative">
                                                                            <Tooltip
                                                                                label={`${
                                                                                    item.preenchimento.filter(
                                                                                        (
                                                                                            i
                                                                                        ) =>
                                                                                            i.valor
                                                                                    )
                                                                                        .length
                                                                                } de ${
                                                                                    item
                                                                                        .preenchimento
                                                                                        .length
                                                                                } campos preenchidos`}
                                                                            >
                                                                                <Box>
                                                                                    <Progress
                                                                                        size="lg"
                                                                                        value={
                                                                                            item.preenchimento.filter(
                                                                                                (
                                                                                                    i
                                                                                                ) =>
                                                                                                    i.valor
                                                                                            )
                                                                                                .length
                                                                                        }
                                                                                        max={
                                                                                            item
                                                                                                .preenchimento
                                                                                                .length >
                                                                                            0
                                                                                                ? item
                                                                                                      .preenchimento
                                                                                                      .length
                                                                                                : 100
                                                                                        }
                                                                                        colorScheme={
                                                                                            item.preenchimento.filter(
                                                                                                (
                                                                                                    i
                                                                                                ) =>
                                                                                                    i.valor
                                                                                            )
                                                                                                .length ==
                                                                                            item
                                                                                                .preenchimento
                                                                                                .length
                                                                                                ? "green"
                                                                                                : "yellow"
                                                                                        }
                                                                                    />
                                                                                </Box>
                                                                            </Tooltip>
                                                                            <Flex
                                                                                pos="absolute"
                                                                                top="0"
                                                                                justify="center"
                                                                                mx="auto"
                                                                                w="full"
                                                                            >
                                                                                <Text
                                                                                    textAlign="center"
                                                                                    fontSize="xs"
                                                                                    color={
                                                                                        Number(
                                                                                            (item.preenchimento.filter(
                                                                                                (
                                                                                                    i
                                                                                                ) =>
                                                                                                    i.valor
                                                                                            )
                                                                                                .length /
                                                                                                item
                                                                                                    .preenchimento
                                                                                                    .length) *
                                                                                                100
                                                                                        ).toFixed(
                                                                                            0
                                                                                        ) ==
                                                                                        100
                                                                                            ? "white"
                                                                                            : ""
                                                                                    }
                                                                                >
                                                                                    {item.preenchimento.filter(
                                                                                        (
                                                                                            i
                                                                                        ) =>
                                                                                            i.valor
                                                                                    )
                                                                                        .length
                                                                                        ? Number(
                                                                                              (item.preenchimento.filter(
                                                                                                  (
                                                                                                      i
                                                                                                  ) =>
                                                                                                      i.valor
                                                                                              )
                                                                                                  .length /
                                                                                                  item
                                                                                                      .preenchimento
                                                                                                      .length) *
                                                                                                  100
                                                                                          ).toFixed(
                                                                                              2
                                                                                          )
                                                                                        : Number(
                                                                                              0
                                                                                          ).toFixed(
                                                                                              2
                                                                                          )}

                                                                                    %
                                                                                    preenchida{" "}
                                                                                    {}
                                                                                </Text>
                                                                            </Flex>
                                                                        </Box>
                                                                    </>
                                                                </Td>
                                                            </Tr>
                                                        )
                                                    )}
                                                </Tbody>
                                            </Table>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            ))
                        ) : (
                            //  {/* [
                            //       {
                            //           value: (
                            //               <Checkbox
                            //                   isChecked={selecionados.includes(
                            //                       item.id
                            //                   )}
                            //                   onChange={(e) => {
                            //                       if (e.target.checked) {
                            //                           setSelecionados([
                            //                               ...selecionados,
                            //                               item.id,
                            //                           ]);
                            //                       } else {
                            //                           setSelecionados(
                            //                               selecionados.filter(
                            //                                   (i) =>
                            //                                       i !== item.id
                            //                               )
                            //                           );
                            //                       }
                            //                   }}
                            //               />
                            //           ),
                            //       },
                            //       {
                            //           value: (
                            //               <Flex gap={2} justify="center">
                            //                   <IconButton
                            //                       variant="ghost"
                            //                       size="sm"
                            //                       icon={<FiEye />}
                            //                       color="bluelight"
                            //                       onClick={() =>
                            //                           modal.current.onOpen(
                            //                               item.id
                            //                           )
                            //                       }
                            //                       aria-label="Abrir"
                            //                   />
                            //               </Flex>
                            //           ),
                            //       },
                            //       {
                            //           value: item?.codigo,
                            //       },

                            //       {
                            //           value: (
                            //               <>
                            //                   {item?.imovel?.codigo} -
                            //                   {item?.imovel?.endereco},{" "}
                            //                   {item?.imovel?.numero},{" "}
                            //                   {item?.imovel?.bairro},{" "}
                            //                   {item?.imovel?.cidade}/
                            //                   {item?.imovel?.estado}
                            //               </>
                            //           ),
                            //       },
                            //       {
                            //           value: (
                            //               <>
                            //                   <AvatarGroup size="xs">
                            //                       {item.fichas?.map((f) => (
                            //                           <TooltipAvatar
                            //                               name={f.descricao}
                            //                           />
                            //                       ))}
                            //                   </AvatarGroup>
                            //               </>
                            //           ),
                            //       },
                            //       {
                            //           value: (
                            //               <>
                            //                   <Progress
                            //                       height="20px"
                            //                       value={item.fichas?.reduce(
                            //                           (acc, item) =>
                            //                               item._count
                            //                                   .preenchimento +
                            //                               acc,
                            //                           0
                            //                       )}
                            //                       max={item.fichas?.reduce(
                            //                           (acc, item) =>
                            //                               Object.entries(
                            //                                   item.modelo.campos
                            //                               ).length + acc,
                            //                           0
                            //                       )}
                            //                   >
                            //                       <ProgressLabel
                            //                           fontSize="sm"
                            //                           color="gray.600"
                            //                       >
                            //                           {Intl.NumberFormat(
                            //                               "pt-BR",
                            //                               {
                            //                                   style: "percent", // Define o estilo como porcentagem
                            //                                   minimumFractionDigits: 2, // Define o número mínimo de casas decimais
                            //                                   maximumFractionDigits: 2, // Define o número máximo de casas decimais
                            //                               }
                            //                           ).format(
                            //                               item.fichas.reduce(
                            //                                   (acc, item) =>
                            //                                       Number(
                            //                                           item
                            //                                               ._count
                            //                                               .preenchimento
                            //                                       ) + acc,
                            //                                   0
                            //                               ) == 0
                            //                                   ? 0
                            //                                   : item.fichas.reduce(
                            //                                         (
                            //                                             acc,
                            //                                             item
                            //                                         ) =>
                            //                                             Number(
                            //                                                 item
                            //                                                     ._count
                            //                                                     .preenchimento
                            //                                             ) + acc,
                            //                                         0
                            //                                     ) /
                            //                                         item.fichas.reduce(
                            //                                             (
                            //                                                 acc,
                            //                                                 item
                            //                                             ) => {
                            //                                                 if (
                            //                                                     Object.entries(
                            //                                                         item
                            //                                                             .modelo
                            //                                                             .campos
                            //                                                     )
                            //                                                         ?.length
                            //                                                 ) {
                            //                                                     return (
                            //                                                         Object.entries(
                            //                                                             item
                            //                                                                 .modelo
                            //                                                                 .campos
                            //                                                         )
                            //                                                             ?.length +
                            //                                                         acc
                            //                                                     );
                            //                                                 } else {
                            //                                                     return acc;
                            //                                                 }
                            //                                             },
                            //                                             0
                            //                                         )
                            //                           )}
                            //                       </ProgressLabel>
                            //                   </Progress>
                            //               </>
                            //           ),
                            //       },
                            //       {
                            //           value: (
                            //               <>
                            //                   <TooltipAvatar
                            //                       size="xs"
                            //                       name={item?.responsavel?.nome}
                            //                   />
                            //               </>
                            //           ),
                            //       },
                            //       {
                            //           value: <>{statusProcesso(item.status)}</>,
                            //       },
                            //   ]) */}
                            <></>
                        )}
                    </Flex>
                </Flex>
            </Layout>
            <ModalProcesso ref={modalProcesso} />
            <ModalFichaCadastral ref={modal} />
            <ModalRevisaoFichaCadastral ref={modalRevisar} />
            <ModalValidar ref={modalValidar} />
            <Excluir ref={modalExcluir} onDelete={onDelete} />
        </>
    );
};
export default Home;
export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {
            query: ctx.query,
        },
    };
});
