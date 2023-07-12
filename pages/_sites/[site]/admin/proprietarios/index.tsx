import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPage,
    PaginationPageGroup,
    PaginationPrevious,
    usePagination,
} from "@ajna/pagination";
import {
    Box,
    Button,
    Checkbox,
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
    useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiEye, FiTrash } from "react-icons/fi";
import { MdPageview } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { ModalInquilinos } from "@/components/Modals/inquilinos";
import {
    excluirVariosUsuarios,
    listarUsuarios,
} from "@/services/models/usuario";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { Usuario } from "@/components/Modals/Usuario";
import { TabelaPadrao } from "@/components/Tabelas/TabelaPadrao";
import { queryClient } from "@/services/queryClient";
import { excluirVariosBoletos } from "@/services/models/boleto";
import { FormDateRange } from "@/components/Form/FormDateRange";
import { formatoData, formatoValor } from "@/helpers/helpers";

const Inquilinos = () => {
    const modalinquilinos = useRef();
    const toast = useToast();
    const [total, setTotal] = useState();
    const [filtro, setFiltro] = useState({});
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
    const { data, isLoading } = useQuery(
        [
            "proprietarios",
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
    const deleteMany = useMutation(excluirVariosUsuarios, {
        onSuccess: () => {
            queryClient.invalidateQueries("proprietarario");
            toast({
                title: "Sucesso",
                description: "Proprietários excluídos com sucesso",
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
            <Layout title="Proprietários">
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
                                w: 12,
                            },
                            {
                                value: "Ações",
                                w: 12,
                                textAlign: "center",
                            },
                            {
                                value: "Inquilino",
                            },
                            {
                                value: "CPF/CNPJ",
                                w: 12,
                            },
                            {
                                value: "Telefones",
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
                                                  <IconButton
                                                      size="sm"
                                                      icon={<FiEye />}
                                                      variant="ghost"
                                                      colorScheme="blue"
                                                      onClick={() =>
                                                          modal.current.onOpen(
                                                              item.id
                                                          )
                                                      }
                                                  />
                                              </Flex>
                                          ),
                                      },
                                      {
                                          value: item.nome,
                                      },
                                      {
                                          value: item.documento,
                                      },
                                      {
                                          value: (
                                              <>
                                                  {item.telefone} /{" "}
                                                  {item.celular}
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
                                        label="Proprietário"
                                        placeholder="digite o nome do proprietário..."
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
                                        label="Contrato"
                                        placeholder="digite o número do contrato..."
                                        bg="white"
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Telefone"
                                        placeholder="digite um telefone..."
                                        bg="white"
                                        value={filtro.telefone}
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                telefone: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                            </>
                        }
                    />
                </Box>

                <Usuario ref={modalinquilinos} />
            </Layout>
        </>
    );
};
export default Inquilinos;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
