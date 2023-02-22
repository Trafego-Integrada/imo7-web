import { listarUsuarios } from "@/services/models/usuario";
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useQuery } from "react-query";

export const Inquilinos = ({ data }) => {
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
                            <Td>
                                <Text fontWeight="bold">{item.nome}</Text>
                                <Text color="gray">
                                    {item.telefone} / {item.celular} /{" "}
                                    {item.email}
                                </Text>
                            </Td>
                            <Td>{item.documento}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};
