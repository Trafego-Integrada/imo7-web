import { formatoValor } from "@/helpers/helpers";
import { listarUsuarios } from "@/services/models/usuario";
import {
    Box,
    IconButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
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
                        <Th w={24}></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item) => (
                        <Tr key={item.id}>
                            <Td>{item.data_vencimen}</Td>
                            <Td>{item.instrucoes3}</Td>
                            <Td>{formatoValor(item.valor_doc2)}</Td>
                            <Td>
                                <Link
                                    href={`https://www.imo7.com.br/api/boleto/${item.id}/pdf`}
                                    target="_blank"
                                    passHref
                                >
                                    <IconButton
                                        size="sm"
                                        as={VscFilePdf}
                                        color="red"
                                    />
                                </Link>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};
