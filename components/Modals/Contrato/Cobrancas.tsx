import { formatoValor } from "@/helpers/helpers";
import { listarUsuarios } from "@/services/models/usuario";
import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
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
                            <Td>{item.data_vencimen}</Td>
                            <Td>{item.instrucoes3}</Td>
                            <Td>{formatoValor(item.valor_doc2)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};
