import { NextChakraLink } from "@/components/NextChakraLink";
import { formatoData } from "@/helpers/helpers";
import { listarAnexos } from "@/services/models/anexo";
import { anexarArquivoContrato } from "@/services/models/contrato";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
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
    Tr,
    useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiDownload, FiEye } from "react-icons/fi";
import { RiAddLine } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";

export const Documentos = ({ contratoId }) => {
    const router = useRouter();
    const toast = useToast();
    const upload = useMutation(anexarArquivoContrato, {
        onSuccess: () => {
            toast({
                title: "Arquivo anexado com sucesso",
                status: "success",
            });
            queryClient.invalidateQueries(["anexos"]);
        },
    });
    const onUpload = async (event) => {
        const formData = new FormData();
        formData.append("contratoId", contratoId);
        formData.append("anexos", event.target.files[0]);
        await upload.mutateAsync(formData);
    };
    const { data } = useQuery(
        [
            "anexos",
            {
                contratoId,
            },
        ],
        listarAnexos
    );
    return (
        <Box>
            <Grid d="flex" gap={3}>
                <label>
                    <Button
                        as="label"
                        size="sm"
                        colorScheme="blue"
                        type="button"
                    >
                        <input
                            type="file"
                            onChange={(e) => onUpload(e)}
                            style={{
                                display: "none",
                            }}
                        />
                        <Icon as={RiAddLine} />
                        <Text pl="2">Anexar arquivo</Text>
                    </Button>
                </label>
            </Grid>

            <Table variant="striped" size="sm" mt={5} bg="white">
                <Thead>
                    <Tr>
                        <Th>Anexo</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item) => (
                        <Tr key={item.id}>
                            <Td>{item.anexo}</Td>
                            <Td>
                                <NextChakraLink
                                    href={item.anexo}
                                    target="_blank"
                                >
                                    <IconButton
                                        icon={<Icon as={FiDownload} />}
                                    />
                                </NextChakraLink>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};
