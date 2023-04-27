import { formatoData } from "@/helpers/helpers";
import {
    Box,
    Icon,
    IconButton,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { FiEye } from "react-icons/fi";
import { ModalChamado } from "../ModalChamado";

export const Chamados = ({ data }) => {
    const router = useRouter();
    const modal = useRef();
    return (
        <TableContainer>
            <Table size="sm" variant="striped">
                <Thead>
                    <Tr>
                        <Th w={18} textAlign="center">
                            Nº do chamado
                        </Th>
                        <Th w={36} textAlign="center">
                            Departamento
                        </Th>
                        <Th w={36} textAlign="center">
                            Assunto
                        </Th>
                        <Th w={44} textAlign="center">
                            Aberto por
                        </Th>
                        <Th w={36} textAlign="center">
                            Criado em
                        </Th>
                        <Th w={18} textAlign="center">
                            Status
                        </Th>
                        <Th w={24} textAlign="center">
                            Ações
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item) => (
                        <Tr key={item.id}>
                            <Td textAlign="center">{item.id}</Td>
                            <Td textAlign="center">
                                {item.assunto?.departamento?.titulo}
                            </Td>
                            <Td textAlign="center">{item.assunto?.titulo}</Td>
                            <Td textAlign="center">{item.criador?.nome}</Td>

                            <Td textAlign="center">
                                {formatoData(item.createdAt)}
                            </Td>

                            <Td textAlign="center">
                                <Tag>{item.status}</Tag>
                            </Td>
                            <Td textAlign="center">
                                <IconButton
                                    size="sm"
                                    icon={<Icon as={FiEye} />}
                                    colorScheme="blue"
                                    onClick={() =>
                                        modal.current.onOpen(item.id)
                                    }
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <ModalChamado ref={modal} />
        </TableContainer>
    );
};
