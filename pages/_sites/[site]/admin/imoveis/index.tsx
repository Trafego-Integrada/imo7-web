import { Excluir } from "@/components/AlertDialogs/Excluir";
import { FormDateRange } from "@/components/Form/FormDateRange";
import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { Layout } from "@/components/Layout/layout";
import { ModalFichaCadastral } from "@/components/Modals/ModalFichaCadastral";
import { ModalRevisaoFichaCadastral } from "@/components/Modals/ModalRevisaoFichaCadastral";
import { ModalValidar } from "@/components/Modals/ModalValidar";

import {
    arrayStatusFicha,
    formatoData,
    statusFicha,
    tipoFicha,
} from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import {
    excluirFicha,
    excluirVariasFichas,
    listarFichas,
} from "@/services/models/fichaCadastral";
import { listarUsuarios } from "@/services/models/usuario";
import { queryClient } from "@/services/queryClient";
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
    Menu,
    MenuButton,
    MenuIcon,
    MenuItem,
    MenuList,
    Progress,
    Table,
    TableContainer,
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
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import {
    FiCheck,
    FiEdit,
    FiEye,
    FiLink,
    FiPlus,
    FiTrash,
} from "react-icons/fi";
import { MdOutlineVerifiedUser, MdAccessibilityNew } from "react-icons/md";
import { exportToExcel } from "react-json-to-excel";
import { useMutation, useQuery } from "react-query";
import { CiCircleMore } from "react-icons/ci";
import { RiMore2Line } from "react-icons/ri";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { TabelaPadrao } from "@/components/Tabelas/TabelaPadrao";
import { usePagination } from "@ajna/pagination";
import { ModalImovel } from "@/components/Modals/ModalImovel";
import { imo7ApiService } from "@/services/apiServiceUsage";
import { TooltipAvatar } from "@/components/TooltipAvatar";
const filtroPadrao = {
    query: "",
    identificacao: "",
    createdAt: [null, null],
    updatedAt: [null, null],
    status: ["aguardando"],
    responsaveis: [],
};
const FichasCadastrais = ({ query }) => {
    const { usuario } = useAuth();
    const [total, setTotal] = useState();
    const [filtro, setFiltro] = useState({
        ...filtroPadrao,
        status:
            query?.status && Array.isArray(query.status)
                ? query?.status
                : query?.status
                ? [query?.status]
                : ["aguardando"],
        dataReajuste: [null, null],
        dataInicio: [null, null],
        dataFim: [null, null],
        dataCriacao: [null, null],
    });
    const toast = useToast();
    const router = useRouter();
    const modal = useRef();
    const modalExcluir = useRef();
    const modalRevisar = useRef();
    const modalValidar = useRef();
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
    const { data: imoveis, isLoading } = useQuery(
        [
            "imoveis",
            {
                ...filtro,
                createdAt: filtro.createdAt[0]
                    ? JSON.stringify(filtro.createdAt)
                    : null,
                updatedAt: filtro.updatedAt[0]
                    ? JSON.stringify(filtro.updatedAt)
                    : null,
                status: filtro.status[0] ? JSON.stringify(filtro.status) : null,
                responsaveis: filtro.responsaveis[0]
                    ? JSON.stringify(filtro.responsaveis)
                    : null,
                linhas: pageSize,
                pagina: currentPage,
            },
        ],
        imo7ApiService("imovel").list,
        {
            onSuccess: (data) => {
                setTotal(data.total);
            },
        }
    );

    const excluir = useMutation(imo7ApiService("imovel").delete);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Ficha excluida",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["imoveis"]);
            },
        });
    };
    const [selecionados, setSelecionados] = useState([]);
    // console.log(usuario);
    const deleteMany = useMutation(imo7ApiService("imovel").deleteMany, {
        onSuccess: () => {
            queryClient.invalidateQueries("imoveis");
            toast({
                title: "Sucesso",
                description: "Imoveis excluidos com sucesso com sucesso",
                status: "success",
                duration: 3000,
            });
        },
    });

    const onDeleteMany = () => {
        deleteMany.mutate(
            JSON.stringify(selecionados.map((i) => i.toString()))
        );
        setSelecionados([]);
        queryClient.invalidateQueries("imoveis");
    };
    return (
        <Layout>
            <Box p={4}>
                <Box mb={4}>
                    <Heading size="md" color="gray.600">
                        Imóveis
                    </Heading>
                    <Text color="gray" fontSize="sm" fontStyle="italic">
                        Cadastre e gerêncie os imóveis
                    </Text>
                </Box>
                <Box mb={4}>
                    <Box bg="white" p={4} mb={4}>
                        <Flex align="center" justify="space-between">
                            <Heading size="sm" mb={2}>
                                Filtro avançado
                            </Heading>
                            <Button
                                variant="outline"
                                size="sm"
                                colorScheme="gray"
                                onClick={() => setFiltro(filtroPadrao)}
                            >
                                Limpar filtro
                            </Button>
                        </Flex>
                        <Grid
                            gridTemplateColumns={{
                                sm: "repeat(3,1fr)",
                                md: "repeat(4,1fr)",
                                lg: "repeat(4,1fr)",
                                xl: "repeat(6,1fr)",
                            }}
                            gap={2}
                        >
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Codigo"
                                    placeholder="Por codigo"
                                    value={filtro.codigo}
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
                                    label="Identificação"
                                    placeholder="Por nome, cpf/cnpj, telefone ou e-mail"
                                    value={filtro.identificacao}
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            identificacao: e.target.value,
                                        })
                                    }
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
                            <GridItem>
                                <FormDateRange
                                    size="sm"
                                    label="Data de Atualização"
                                    startDate={filtro?.updatedAt[0]}
                                    endDate={filtro?.updatedAt[1]}
                                    onChange={(e) => {
                                        setFiltro({
                                            ...filtro,
                                            updatedAt: e,
                                        });
                                    }}
                                />
                            </GridItem>
                        </Grid>
                    </Box>
                    <Flex
                        justify="space-between"
                        align="center"
                        bg="white"
                        wrap="wrap"
                        p={4}
                        gap={2}
                    >
                        <Flex gap={4} align="center">
                            <Flex gap={4}>
                                <FormInput
                                    size="sm"
                                    minW={96}
                                    label="Pesquisa rápida"
                                    value={filtro.query}
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            query: e.target.value,
                                        })
                                    }
                                />
                            </Flex>
                            <Text fontSize="xs" color="gray" w="full">
                                <Text as="span" fontWeight="bold">
                                    {imoveis?.total}
                                </Text>{" "}
                                imoveis encontrados
                            </Text>
                        </Flex>
                        <Flex gap={2}>
                            <Button
                                size="sm"
                                leftIcon={<Icon as={FiPlus} />}
                                colorScheme="blue"
                                onClick={() => modal.current.onOpen()}
                            >
                                Novo
                            </Button>
                        </Flex>
                    </Flex>
                </Box>
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
                                        imoveis?.data?.data
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
                                        imoveis?.data?.data?.data?.map(
                                            (item) => item.id
                                        )
                                    )}
                                />
                            ),
                            w: 4,
                        },
                        {
                            value: "Ações",
                            w: 12,
                            textAlign: "center",
                        },
                        {
                            value: "Código",
                            w: 12,
                        },
                        {
                            value: "Tipo",
                            w: 12,
                        },
                        {
                            value: "Endereço",
                            w: 12,
                        },
                        {
                            value: "Proprietários",
                            w: 12,
                        },
                    ]}
                    data={
                        imoveis?.data?.data?.length > 0
                            ? imoveis?.data?.data?.map((item, key) => [
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
                                      w: 4,
                                  },
                                  {
                                      value: (
                                          <Flex gap={2} justify="center">
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
                                                          icon={<FiEdit />}
                                                          onClick={() =>
                                                              modal.current.onOpen(
                                                                  item.id
                                                              )
                                                          }
                                                      >
                                                          Editar
                                                      </MenuItem>

                                                      <MenuItem
                                                          icon={<FiTrash />}
                                                          onClick={() => {
                                                              modalExcluir.current.onOpen(
                                                                  item.id
                                                              );
                                                          }}
                                                      >
                                                          Excluir
                                                      </MenuItem>
                                                  </MenuList>
                                              </Menu>
                                          </Flex>
                                      ),
                                  },
                                  {
                                      value: item?.codigo,
                                  },

                                  {
                                      value: <>{item.tipo}</>,
                                  },
                                  {
                                      value: (
                                          <>
                                              <Text>{`${item.endereco}, ${item.numero}, ${item.bairro}`}</Text>
                                          </>
                                      ),
                                  },
                                  {
                                      value: (
                                          <>
                                              <AvatarGroup size="sm">
                                                  {item?.proprietarios?.map(
                                                      (i) => (
                                                          <TooltipAvatar
                                                              name={`${i.proprietario?.nome} - ${i.porcentagem}%`}
                                                          />
                                                      )
                                                  )}
                                              </AvatarGroup>
                                          </>
                                      ),
                                  },
                              ])
                            : []
                    }
                />
            </Box>
            <ModalImovel ref={modal} />
            <Excluir ref={modalExcluir} onDelete={onDelete} />
        </Layout>
    );
};

export default FichasCadastrais;

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {
            query: ctx.query,
        },
    };
});
