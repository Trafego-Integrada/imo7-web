import { Excluir } from "@/components/AlertDialogs/Excluir";
import { NextChakraLink } from "@/components/NextChakraLink";
import { formatoData } from "@/helpers/helpers";
import { excluirAnexo, listarAnexos } from "@/services/models/anexo";
import { anexarArquivoContrato } from "@/services/models/contrato";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    Grid,
    Icon,
    IconButton,
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
import { useRouter } from "next/router";
import { useRef } from "react";
import { FiDownload, FiEdit, FiEdit2, FiEye, FiTrash } from "react-icons/fi";
import { RiAddLine } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import { ModalAnexo } from "./ModalAnexo";
import { ModalTribunalJustica } from "../ModalRevisaoFichaCadastral2/TribunalJustica/Modal";

export const Documentos = ({ contratoId, fichaCadastralId, processoId }) => {
    const preview = useRef();
    const router = useRouter();
    const toast = useToast();
    const modalAnexo = useRef();
    const modalExcluir = useRef();
    const { data } = useQuery(
        [
            "anexos",
            {
                contratoId,
                fichaCadastralId,
                processoId,
            },
        ],
        listarAnexos,
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    const excluir = useMutation(excluirAnexo);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Anexo excluido",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["anexos"]);
            },
        });
    };

    return (
        <Box>
            <Grid display="flex" gap={3}>
                <label>
                    <Button
                        as="label"
                        size="sm"
                        colorScheme="blue"
                        type="button"
                        onClick={() => modalAnexo.current.onOpen()}
                    >
                        Anexar arquivo
                    </Button>
                </label>
            </Grid>
            <Table variant="striped" size="sm" mt={5} bg="white">
                <Thead>
                    <Tr>
                        <Th w={32}></Th>
                        <Th>Anexo</Th>
                        <Th w={32}>Upload feito por</Th>
                        <Th w={44}>Data do upload</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item) => (
                        <Tr key={item.id}>
                            <Td>
                                <Flex gap={1}>
                                    <Tooltip label="Visualizar Arquivo">
                                        <IconButton
                                            rounded="full"
                                            variant="outline"
                                            size="sm"
                                            icon={<Icon as={FiEye} />}
                                            onClick={() =>
                                                preview.current.onOpen(
                                                    item.anexo
                                                )
                                            }
                                        />
                                    </Tooltip>
                                    <Tooltip label="Editar">
                                        <IconButton
                                            rounded="full"
                                            variant="outline"
                                            size="sm"
                                            icon={<Icon as={FiEdit} />}
                                            onClick={() =>
                                                modalAnexo.current.onOpen(
                                                    item.id
                                                )
                                            }
                                        />
                                    </Tooltip>
                                    <NextChakraLink
                                        href={item.anexo}
                                        target="_blank"
                                    >
                                        <Tooltip label="Download">
                                            <IconButton
                                                rounded="full"
                                                variant="outline"
                                                size="sm"
                                                icon={<Icon as={FiDownload} />}
                                            />
                                        </Tooltip>
                                    </NextChakraLink>
                                    <Tooltip label="Excluir">
                                        <IconButton
                                            rounded="full"
                                            variant="outline"
                                            size="sm"
                                            icon={<Icon as={FiTrash} />}
                                            colorScheme="red"
                                            onClick={() =>
                                                modalExcluir.current.onOpen(
                                                    item.id
                                                )
                                            }
                                        />
                                    </Tooltip>
                                </Flex>
                            </Td>
                            <Td>{item.nome}</Td>
                            <Td>{item.usuario?.nome}</Td>
                            <Td>{formatoData(item.createdAt, "DATA_HORA")}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <ModalAnexo
                ref={modalAnexo}
                contratoId={contratoId}
                fichaCadastralId={fichaCadastralId}
                processoId={processoId}
            />
            <Excluir
                ref={modalExcluir}
                titulo="Excluir anexo"
                onDelete={onDelete}
            />
            <ModalTribunalJustica ref={preview} />
        </Box>
    );
};
