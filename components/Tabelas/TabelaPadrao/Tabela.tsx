import {
    Box,
    Flex,
    Spinner,
    Table,
    TableColumnHeaderProps,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

interface HeadItem extends TableColumnHeaderProps {
    value: string;
}

export interface TabelaProps {
    head: HeadItem[];
    data: any[];
}

export const Tabela = ({ head, data, isLoading }: TabelaProps) => {
    return (
        <TableContainer>
            <Table size="sm">
                <Thead>
                    <Tr>
                        {head?.map(({ value, ...props }, key) => (
                            <Th key={key} {...props}>
                                {value}
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {isLoading ? (
                        <Tr>
                            <Td colSpan={head.length}>
                                <Flex justify="center" align="center" gap={4}>
                                    <Spinner size="sm" color="gray" />
                                    <Text color="gray">
                                        Carregando informações...
                                    </Text>
                                </Flex>
                            </Td>
                        </Tr>
                    ) : data?.length > 0 ? (
                        data?.map((item, key) => (
                            <Tr key={key}>
                                {item.map(({ value, ...props }, k) => (
                                    <Td key={k} {...props}>
                                        {value}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={head.length}
                                color="gray"
                                textAlign="center"
                            >
                                Não foram encontrados dados para o filtro
                                selecionado, ou não há cadastros.
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
