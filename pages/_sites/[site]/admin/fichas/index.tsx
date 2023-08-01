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
import { excluirFicha, listarFichas } from "@/services/models/fichaCadastral";
import { listarUsuarios } from "@/services/models/usuario";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
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
const filtroPadrao = {
    query: "",
    identificacao: "",
    createdAt: [null, null],
    updatedAt: [null, null],
    status: [],
    responsaveis: [],
};
const FichasCadastrais = ({ query }) => {
    const { usuario } = useAuth();
    const [filtro, setFiltro] = useState({
        ...filtroPadrao,
        status:
            query?.status && Array.isArray(query.status)
                ? query?.status
                : query?.status
                ? [query?.status]
                : [],
    });
    const toast = useToast();
    const router = useRouter();
    const modal = useRef();
    const modalExcluir = useRef();
    const modalRevisar = useRef();
    const modalValidar = useRef();
    const { data: fichas } = useQuery(
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
            },
        ],
        listarFichas
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
    // console.log(usuario);

    return (
        <Layout>
            <Box p={4}>
                <Box mb={6}>
                    <Heading size="md" color="gray.600">
                        Fichas Cadastrais
                    </Heading>
                    <Text color="gray" fontSize="sm" fontStyle="italic">
                        Gere e gerêncie as fichas cadastrais
                    </Text>
                </Box>
                <Box>
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
                            <GridItem>
                                <FormMultiSelect
                                    placeholder="Selecione..."
                                    size="sm"
                                    label="Status"
                                    value={arrayStatusFicha.filter((i) =>
                                        filtro.status.includes(i.value)
                                    )}
                                    onChange={(e) => {
                                        setFiltro({
                                            ...filtro,
                                            status: e.map((i) => i.value),
                                        });
                                    }}
                                    isMulti
                                    options={arrayStatusFicha}
                                />
                            </GridItem>
                            <GridItem>
                                <FormMultiSelect
                                    size="sm"
                                    label="Responsável"
                                    value={filtro.responsaveis}
                                    onChange={(e) => {
                                        setFiltro({
                                            ...filtro,
                                            responsaveis: e,
                                        });
                                    }}
                                    isMulti
                                    placeholder="Selecione..."
                                    options={responsaveis?.data?.data}
                                    getOptionLabel={(e) => e.nome}
                                    getOptionValue={(e) => e.id}
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
                    <Box bg="white" mt={4} p={4}>
                        <TableContainer>
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th w={12}>Ações</Th>
                                        <Th w={12}>ID</Th>
                                        <Th w={44}>Tipo</Th>
                                        <Th>Nome</Th>
                                        <Th w={44}>Preenchimento</Th>
                                        <Th w={44}>Responsável</Th>
                                        <Th w={24}>Criado em</Th>
                                        <Th w={24}>Última atualização</Th>
                                        <Th w={44}>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {fichas?.data?.length > 0 ? (
                                        fichas.data.map((item) => (
                                            <Tr key={item.id}>
                                                <Td>
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
                                                                icon={
                                                                    <FiEdit />
                                                                }
                                                                onClick={() =>
                                                                    modal.current.onOpen(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                Editar Ficha
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={
                                                                    <FiLink />
                                                                }
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(
                                                                        `${window.location.origin}/fichaCadastral/${item.id}`
                                                                    );
                                                                    toast({
                                                                        title: "URL Copiada",
                                                                    });
                                                                }}
                                                            >
                                                                Copiar URL da
                                                                Ficha
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
                                                                Exportar para
                                                                Excel
                                                            </MenuItem>
                                                            <MenuItem
                                                                as={Link}
                                                                icon={
                                                                    <FaFilePdf />
                                                                }
                                                                href={`https://www.imo7.com.br/api/fichaCadastral/${item.id}/pdf`}
                                                                target="_blank"
                                                                passHref
                                                            >
                                                                Gerar PDF
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
                                                                Excluir Ficha
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                                <Td w={12}># {item.codigo}</Td>
                                                <Td>
                                                    {tipoFicha(
                                                        item.modelo?.tipo
                                                    )}
                                                    <br />
                                                    {item.modelo?.nome}
                                                </Td>
                                                <Td>
                                                    <Text fontWeight="bold">
                                                        {item.nome}
                                                    </Text>
                                                    <Text>
                                                        {item.descricao}
                                                    </Text>
                                                </Td>
                                                <Td>
                                                    <Box pos="relative">
                                                        <Tooltip
                                                            label={`${
                                                                item.preenchimento.filter(
                                                                    (i) =>
                                                                        i.valor
                                                                ).length
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
                                                                    ) == 100
                                                                        ? "white"
                                                                        : ""
                                                                }
                                                            >
                                                                {item.preenchimento.filter(
                                                                    (i) =>
                                                                        i.valor
                                                                ).length
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
                                                                % preenchida {}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Td>

                                                <Td>
                                                    {item.responsavel?.nome}
                                                </Td>
                                                <Td>
                                                    {formatoData(
                                                        item.createdAt,
                                                        "DATA_HORA"
                                                    )}
                                                </Td>
                                                <Td>
                                                    {formatoData(
                                                        item.updatedAt,
                                                        "DATA_HORA"
                                                    )}
                                                </Td>
                                                <Td>
                                                    {statusFicha(item.status)}
                                                </Td>
                                                {/* <Td>
                                                    
                                                    {usuario?.permissoes?.includes(
                                                        "imobiliaria.fichas.revisar"
                                                    ) && (
                                                        <Tooltip label="Revisar Ficha">
                                                            <IconButton
                                                                colorScheme="green"
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            MdOutlineVerifiedUser
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() =>
                                                                    modalRevisar.current.onOpen(
                                                                        item.id
                                                                    )
                                                                }
                                                            />
                                                        </Tooltip>
                                                    )}
                                                    {usuario?.permissoes?.includes(
                                                        "imobiliaria.fichas.editar"
                                                    ) && (
                                                        <Tooltip label="Editar Ficha">
                                                            <IconButton
                                                                colorScheme="blue"
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiEdit
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() =>
                                                                    modal.current.onOpen(
                                                                        item.id
                                                                    )
                                                                }
                                                            />
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip label="Copiar URL da Ficha">
                                                        <IconButton
                                                            size="sm"
                                                            variant="ghost"
                                                            icon={
                                                                <Icon
                                                                    as={FiLink}
                                                                />
                                                            }
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    `${window.location.origin}/fichaCadastral/${item.id}`
                                                                );
                                                                toast({
                                                                    title: "URL Copiada",
                                                                });
                                                            }}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip label="Visualizar Ficha">
                                                        <Link
                                                            href={`/fichaCadastral/${item.id}`}
                                                            target="_blank"
                                                        >
                                                            <IconButton
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiEye
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip label="Exportar para Excel">
                                                        <IconButton
                                                            size="sm"
                                                            variant="ghost"
                                                            icon={
                                                                <Icon
                                                                    as={
                                                                        FaFileExcel
                                                                    }
                                                                />
                                                            }
                                                            onClick={() =>
                                                                exportToExcel(
                                                                    item.preenchimento,
                                                                    "ficha-cadastral-" +
                                                                        item.id
                                                                )
                                                            }
                                                        />
                                                    </Tooltip>
                                                    <Tooltip label="Gerar PDF">
                                                        <Link
                                                            href={`https://www.imo7.com.br/api/fichaCadastral/${item.id}/pdf`}
                                                            target="_blank"
                                                            passHref
                                                        >
                                                            <IconButton
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FaFilePdf
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    {usuario?.permissoes?.includes(
                                                        "imobiliaria.fichas.excluir"
                                                    ) && (
                                                        <Tooltip label="Excluir Ficha">
                                                            <IconButton
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiTrash
                                                                        }
                                                                    />
                                                                }
                                                                colorScheme="red"
                                                                onClick={() => {
                                                                    modalExcluir.current.onOpen(
                                                                        item.id
                                                                    );
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </Td> */}
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td
                                                colSpan={8}
                                                textAlign="center"
                                                color="gray"
                                            >
                                                Não encontramos fichas
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
            <ModalFichaCadastral ref={modal} />
            <ModalRevisaoFichaCadastral ref={modalRevisar} />
            <ModalValidar ref={modalValidar} />
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
