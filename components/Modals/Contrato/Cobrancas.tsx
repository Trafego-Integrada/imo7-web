import { formatoData, formatoValor } from "@/helpers/helpers";
import { listarUsuarios } from "@/services/models/usuario";
import {
    Box,
    IconButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { VscFilePdf } from "react-icons/vsc";
import { useQuery } from "react-query";

export const Cobrancas = ({ data }) => {
    return (
        <Box>
            <Table size="sm" variant="striped">
                <Thead>
                    <Tr>
                        <Th w={32}>Vencimento</Th>
                        <Th>Descrição</Th>
                        <Th w={32}>Valor</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item) => (
                        <Tr key={item.id}>
                            <Td>
                                <Tooltip label="Gerar PDF">
                                    <Link
                                        href={`https://www.imo7.com.br/api/boleto/${item.id}/pdf`}
                                        target="_blank"
                                        passHref
                                    >
                                        <IconButton
                                            size="sm"
                                            icon={<VscFilePdf />}
                                            color="red"
                                        />
                                    </Link>
                                </Tooltip>
                            </Td>
                            <Td>
                                {formatoData(item.data_vencimen.slice(0, 10))}
                            </Td>
                            <Td>{item.instrucoes3}</Td>
                            <Td>{formatoValor(item.valor_doc2)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};
