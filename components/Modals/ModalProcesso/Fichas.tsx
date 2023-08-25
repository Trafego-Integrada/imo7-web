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
const filtroPadrao = {
    query: "",
    identificacao: "",
    createdAt: [null, null],
    updatedAt: [null, null],
    status: ["aguardando"],
    responsaveis: [],
};
export const FichasCadastrais = ({ processoId, imovelId, responsavelId }) => {
    const { usuario } = useAuth();
    const [total, setTotal] = useState();
    const [filtro, setFiltro] = useState({
        ...filtroPadrao,
        dataReajuste: [null, null],
        dataInicio: [null, null],
        dataFim: [null, null],
        dataCriacao: [null, null],
        processoId,
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
    const { data: fichas, isLoading } = useQuery(
        [
            "fichas",
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
        listarFichas,
        {
            onSuccess: (data) => {
                setTotal(data.total);
            },
        }
    );
    const { data: responsaveis } = useQuery(
        [
            "listaResponsaveis",
            {
                imobiliariaId: usuario?.imobiliariaId,
                contaId: usuario?.conta?.id,
                admConta: usuario?.cargos?.includes("conta") ? true : false,
                admImobiliaria: usuario?.cargos?.includes("imobiliaria")
                    ? true
                    : false,
                adm: usuario?.cargos?.includes("adm") ? true : false,
            },
        ],
        listarUsuarios
    );
    const excluir = useMutation(excluirFicha);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
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
    const [selecionados, setSelecionados] = useState([]);
    // console.log(usuario);
    const deleteMany = useMutation(excluirVariasFichas, {
        onSuccess: () => {
            queryClient.invalidateQueries("fichas");
            toast({
                title: "Sucesso",
                description: "Fichas excluídas com sucesso",
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
            <Box>
                <Box>
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
                                    {fichas?.total}
                                </Text>{" "}
                                fichas cadastrais encontradas
                            </Text>
                        </Flex>
                        <Flex gap={2}>
                            {usuario?.permissoes?.includes(
                                "imobiliaria.fichas.visualizarExcluidas"
                            ) && (
                                <Link href="/admin/fichas/excluidas">
                                    <Button
                                        size="sm"
                                        leftIcon={<Icon as={FiTrash} />}
                                        colorScheme="blue"
                                    >
                                        Excluidas
                                    </Button>
                                </Link>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<Icon as={FaFileExcel} />}
                                colorScheme="blue"
                                onClick={() => {
                                    exportToExcel(
                                        fichas?.data,
                                        "fichas-cadastrais"
                                    );
                                }}
                            >
                                Exportar para Excel
                            </Button>
                            {usuario?.permissoes?.includes(
                                "imobiliaria.fichas.cadastrar"
                            ) && (
                                <Button
                                    size="sm"
                                    leftIcon={<Icon as={FiPlus} />}
                                    colorScheme="blue"
                                    onClick={() => modal.current.onOpen()}
                                >
                                    Novo
                                </Button>
                            )}
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
                                        fichas?.data
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
                                        fichas?.data?.data?.map(
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
                            value: "ID",
                            w: 12,
                        },
                        {
                            value: "Tipo",
                            w: 12,
                        },
                        {
                            value: "Nome",
                            w: 12,
                        },
                        {
                            value: "Preenchimento",
                            w: 12,
                        },
                        {
                            value: "Última Atualização",
                            w: 12,
                        },
                        {
                            value: "Status",
                            w: 24,
                        },
                    ]}
                    data={
                        fichas?.data?.length > 0
                            ? fichas?.data?.map((item, key) => [
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
                                                          icon={
                                                              <MdOutlineVerifiedUser />
                                                          }
                                                          onClick={() =>
                                                              modalRevisar.current.onOpen(
                                                                  item.id
                                                              )
                                                          }
                                                      >
                                                          Revisar Ficha
                                                      </MenuItem>
                                                      <MenuItem
                                                          icon={<FiEdit />}
                                                          onClick={() =>
                                                              modal.current.onOpen(
                                                                  item.id
                                                              )
                                                          }
                                                      >
                                                          Editar Ficha
                                                      </MenuItem>
                                                      <MenuItem
                                                          icon={<FiLink />}
                                                          onClick={() => {
                                                              navigator.clipboard.writeText(
                                                                  `${window.location.origin}/fichaCadastral/${item.id}`
                                                              );
                                                              toast({
                                                                  title: "URL Copiada",
                                                              });
                                                          }}
                                                      >
                                                          Copiar URL da Ficha
                                                      </MenuItem>
                                                      <MenuItem
                                                          as={Link}
                                                          icon={<FiEye />}
                                                          href={`/fichaCadastral/${item.id}`}
                                                          target="_blank"
                                                      >
                                                          Visualizar Ficha
                                                      </MenuItem>
                                                      <MenuItem
                                                          icon={<FaFileExcel />}
                                                          onClick={() =>
                                                              exportToExcel(
                                                                  item.preenchimento,
                                                                  "ficha-cadastral-" +
                                                                      item.id
                                                              )
                                                          }
                                                      >
                                                          Exportar para Excel
                                                      </MenuItem>
                                                      <MenuItem
                                                          as={Link}
                                                          icon={<FaFilePdf />}
                                                          href={`https://www.imo7.com.br/api/fichaCadastral/${item.id}/pdf`}
                                                          target="_blank"
                                                          passHref
                                                      >
                                                          Gerar PDF
                                                      </MenuItem>
                                                      <MenuItem
                                                          icon={<FiTrash />}
                                                          onClick={() => {
                                                              modalExcluir.current.onOpen(
                                                                  item.id
                                                              );
                                                          }}
                                                      >
                                                          Excluir Ficha
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
                                      value: (
                                          <>
                                              {tipoFicha(item.modelo?.tipo)}
                                              <br />
                                              {item.modelo?.nome}
                                          </>
                                      ),
                                  },
                                  {
                                      value: (
                                          <>
                                              <Text fontWeight="bold">
                                                  {item.nome}
                                              </Text>
                                              <Text>{item.descricao}</Text>
                                          </>
                                      ),
                                  },
                                  {
                                      value: (
                                          <>
                                              <Box pos="relative">
                                                  <Tooltip
                                                      label={`${
                                                          item.preenchimento.filter(
                                                              (i) => i.valor
                                                          ).length
                                                      } de ${
                                                          item.preenchimento
                                                              .length
                                                      } campos preenchidos`}
                                                  >
                                                      <Box>
                                                          <Progress
                                                              size="lg"
                                                              value={
                                                                  item.preenchimento.filter(
                                                                      (i) =>
                                                                          i.valor
                                                                  ).length
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
                                                                      (i) =>
                                                                          i.valor
                                                                  ).length ==
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
                                                                      (i) =>
                                                                          i.valor
                                                                  ).length /
                                                                      item
                                                                          .preenchimento
                                                                          .length) *
                                                                      100
                                                              ).toFixed(0) ==
                                                              100
                                                                  ? "white"
                                                                  : ""
                                                          }
                                                      >
                                                          {item.preenchimento.filter(
                                                              (i) => i.valor
                                                          ).length
                                                              ? Number(
                                                                    (item.preenchimento.filter(
                                                                        (i) =>
                                                                            i.valor
                                                                    ).length /
                                                                        item
                                                                            .preenchimento
                                                                            .length) *
                                                                        100
                                                                ).toFixed(2)
                                                              : Number(
                                                                    0
                                                                ).toFixed(2)}
                                                          % preenchida {}
                                                      </Text>
                                                  </Flex>
                                              </Box>
                                          </>
                                      ),
                                  },
                                  {
                                      value: (
                                          <>
                                              {formatoData(
                                                  item.updatedAt,
                                                  "DATA_HORA"
                                              )}
                                          </>
                                      ),
                                  },
                                  {
                                      value: <>{statusFicha(item.status)}</>,
                                  },
                              ])
                            : []
                    }
                />
            </Box>
            <ModalFichaCadastral
                ref={modal}
                processoId={processoId}
                responsavelId={responsavelId}
                imovelId={imovelId}
            />
            <ModalRevisaoFichaCadastral ref={modalRevisar} />
            <ModalValidar ref={modalValidar} />
            <Excluir ref={modalExcluir} onDelete={onDelete} />
        </>
    );
};
