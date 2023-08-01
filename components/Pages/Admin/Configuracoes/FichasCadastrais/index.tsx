import { Excluir } from "@/components/AlertDialogs/Excluir";
import { FormSelect } from "@/components/Form/FormSelect";
import { NextChakraLink } from "@/components/NextChakraLink";
import { TabelaPadrao } from "@/components/Tabelas/TabelaPadrao";
import { excluirVariosBoletos } from "@/services/models/boleto";
import { excluirFicha, listarFichas } from "@/services/models/modeloFicha";
import { queryClient } from "@/services/queryClient";
import { usePagination } from "@ajna/pagination";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Icon,
    IconButton,
    Table,
    TableContainer,
    Tag,
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
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";

export const FichasCadastrais = () => {
    const toast = useToast();
    const modalExcluir = useRef();
    const [total, setTotal] = useState();
    const [filtro, setFiltro] = useState({
        status: true,
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
            inner: 2,
            outer: 2,
        },
        initialState: { currentPage: 1, pageSize: 15 },
    });
    const { data, isLoading } = useQuery(["fichas", filtro], listarFichas, {
        onSuccess: (data) => {
            setTotal(data.data.total);
        },
    });
    const excluir = useMutation(excluirFicha);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Categoria excluida",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["modelosFicha"]);
            },
        });
    };
    const deleteMany = useMutation(excluirVariosBoletos, {
        onSuccess: () => {
            queryClient.invalidateQueries("modelosFicha");
            toast({
                title: "Sucesso",
                description: "Modelos excluídos com sucesso",
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
        <Box>
            <TabelaPadrao
                acoes={
                    <Flex gap={4}>
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
                        <NextChakraLink href="/admin/fichas/modelos/novo">
                            <Button
                                size="sm"
                                leftIcon={<Icon as={FiPlus} />}
                                colorScheme="blue"
                            >
                                Novo
                            </Button>
                        </NextChakraLink>
                    </Flex>
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
                        w: 12,
                    },
                    {
                        value: "Ações",
                        w: 12,
                        textAlign: "center",
                    },
                    {
                        value: "Tipo",
                        w: 12,
                    },
                    {
                        value: "Nome",
                    },
                    {
                        value: "Status",
                        w: 12,
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
                                          onChange={(e) => {
                                              if (e.target.checked) {
                                                  setSelecionados([
                                                      ...selecionados,
                                                      item.id,
                                                  ]);
                                              } else {
                                                  setSelecionados(
                                                      selecionados.filter(
                                                          (i) => i !== item.id
                                                      )
                                                  );
                                              }
                                          }}
                                      />
                                  ),
                                  w: 12,
                              },
                              {
                                  value: (
                                      <Flex gap={2} justify="center">
                                          <Link
                                              href={
                                                  "/admin/fichas/modelos/" +
                                                  item.id
                                              }
                                          >
                                              <IconButton
                                                  variant="ghost"
                                                  icon={<Icon as={FiEdit} />}
                                              />
                                              {/* <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    colorScheme="red"
                                                    icon={<Icon as={FiTrash} />}
                                                    onClick={() =>
                                                        modalExcluir.current.onOpen(
                                                            item.id
                                                        )
                                                    }
                                                /> */}
                                          </Link>
                                      </Flex>
                                  ),
                                  w: 12,
                              },
                              {
                                  value: item.tipo,
                              },
                              {
                                  value: (
                                      <>
                                          <Text>{item.nome}</Text>
                                          <Text>{item.descricao}</Text>
                                      </>
                                  ),
                              },
                              {
                                  value: (
                                      <>
                                          <Tag
                                              colorScheme={
                                                  item.status ? "green" : "red"
                                              }
                                          >
                                              {item.status
                                                  ? "Ativo"
                                                  : "Inátivo"}
                                          </Tag>
                                      </>
                                  ),
                              },
                          ])
                        : []
                }
                filtroAvancado={
                    <>
                        <FormSelect
                            size="sm"
                            label="Status"
                            value={filtro.status}
                            onChange={(e) =>
                                setFiltro({ ...filtro, status: e.target.value })
                            }
                        >
                            <option value={true}>Ativo</option>
                            <option value={false}>Inátivo</option>
                        </FormSelect>
                    </>
                }
            />
            <Excluir
                ref={modalExcluir}
                titulo="Excluir categoria"
                onDelete={onDelete}
            />
        </Box>
    );
};
