import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Box, Container, Flex } from "@chakra-ui/layout";

import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { Tooltip } from "@chakra-ui/tooltip";
import { useRef, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useQuery } from "react-query";
import { ImobiliariaDrawer } from "@/components/Drawers/ImobiliariaDrawer";
import { Input } from "@/components/Forms/Input";
import { Select } from "@/components/Forms/Select";
import { Header } from "@/components/Header";
import { listarContas } from "@/services/models/conta";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { Layout } from "@/components/Layout/layout";
import { ContaModal } from "@/components/Modals/ContaModal";

const Contas = () => {
    const drawer = useRef();
    const [filter, setFilter] = useState({
        query: "",
        contaId: null,
    });
    const { data: contas, isFetching } = useQuery(
        ["contas", filter],
        listarContas
    );
    return (
        <Layout>
            <Header title="Contas" isFetching={isFetching}></Header>
            <Container maxW="full">
                <Flex justify="space-between" align="center" py={4}>
                    <Flex gridGap={2}>
                        <Input
                            minW={96}
                            placeholder="Qual conta está procurando?"
                            value={filter.query}
                            onChange={(e) =>
                                setFilter({ ...filter, query: e.target.value })
                            }
                        />
                    </Flex>
                    <Button
                        colorScheme="blue"
                        leftIcon={<FaPlus />}
                        onClick={() => drawer.current.onOpen()}
                    >
                        Adicionar conta
                    </Button>
                </Flex>
                <Box>
                    <Table variant="striped" size="sm">
                        <Thead>
                            <Tr>
                                <Th>Conta</Th>
                                <Th w={24}>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {contas && contas.length ? (
                                contas.map((item, key) => (
                                    <Tr key={key}>
                                        <Td>{item.nome}</Td>
                                        <Td>
                                            <Tooltip label="Editar conta">
                                                <Button
                                                    rounded="full"
                                                    size="xs"
                                                    onClick={() =>
                                                        drawer.current.onOpen(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    <FaEdit />
                                                </Button>
                                            </Tooltip>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan={5} textAlign="center">
                                        Não há contas cadastradas
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </Container>
            <ContaModal ref={drawer} />
        </Layout>
    );
};

export default Contas;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
