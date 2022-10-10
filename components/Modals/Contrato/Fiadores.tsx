import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export const Fiadores = ({ data }) => {
    return (
        <Box>
            <Table size="sm" variant="striped">
                <Thead>
                    <Tr>
                        <Th>Nome</Th>
                        <Th w={44}>CPF</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item) => (
                        <Tr key={item.id}>
                            <Td>{item.nome}</Td>
                            <Td>{item.documento}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};
