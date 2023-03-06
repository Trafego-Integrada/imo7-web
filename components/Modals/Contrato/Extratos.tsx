import { formatoData } from "@/helpers/helpers";
import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export const Extratos = ({ data }) => {
    return (
        <Box>
            <Table size="sm" variant="striped">
                <Thead>
                    <Tr>
                        <Th>Nº Parcela</Th>
                        <Th>Data Depósito</Th>
                        <Th>Responsável</Th>
                        <Th>Período</Th>
                        <Th>Vencimento</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item) => (
                        <Tr key={item.id}>
                            <Td>{item.parcela}</Td>
                            <Td>{formatoData(item.dataDeposito)}</Td>
                            <Td>{item.responsavel}</Td>
                            <Td>{item.periodo}</Td>
                            <Td>
                                {item.vencimento &&
                                    formatoData(item.vencimento)}
                            </Td>
                            <Td></Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};
