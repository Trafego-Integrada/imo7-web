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
import { FiDownload, FiEye, FiTrash } from "react-icons/fi";
import { RiAddLine } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import { ModalAnexo } from "./ModalAnexo";

export const Documentos = ({ contratoId }) => {
    const router = useRouter();
    const toast = useToast();
    const modalAnexo = useRef();
    const modalExcluir = useRef();
    const { data } = useQuery(
        [
            "anexos",
            {
                contratoId,
            },
        ],
        listarAnexos
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
            <Grid d="flex" gap={3}>
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
                        <Th>Anexo</Th>
                        <Th w={32}>Upload feito por</Th>
                        <Th w={44}>Data do upload</Th>
                        <Th w={32}></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item) => (
                        <Tr key={item.id}>
                            <Td>{item.nome}</Td>
                            <Td>{item.usuario?.nome}</Td>
                            <Td>{formatoData(item.createdAt, "DATA_HORA")}</Td>
                            <Td>
                                <Flex>
                                    {" "}
                                    <NextChakraLink
                                        href={item.anexo}
                                        target="_blank"
                                    >
                                        <Tooltip label="Download">
                                            <IconButton
                                                size="sm"
                                                icon={<Icon as={FiDownload} />}
                                            />
                                        </Tooltip>
                                    </NextChakraLink>
                                    <Tooltip label="Excluir">
                                        <IconButton
                                            variant="ghost"
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
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <ModalAnexo ref={modalAnexo} contratoId={contratoId} />{" "}
            <Excluir
                ref={modalExcluir}
                titulo="Excluir anexo"
                onDelete={onDelete}
            />
        </Box>
    );
};
