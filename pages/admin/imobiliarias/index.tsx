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
import { getAll as getAllImobiliarias } from "@/services/models/imobiliaria";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { Layout } from "@/components/Layout/layout";

const Imobiliarias = () => {
    const imobiliariaDrawer = useRef();
    const [filter, setFilter] = useState({
        query: "",
        contaId: null,
    });
    const { data: contas } = useQuery(["contas"], listarContas);
    const { data: imobiliarias, isFetching } = useQuery(
        ["imobiliarias", filter],
        getAllImobiliarias
    );
    return (
        <Layout>
            <Header title="Imobiliarias" isFetching={isFetching}></Header>
            <Container maxW="full">
                <Flex justify="space-between" align="center" py={4}>
                    <Flex gridGap={2}>
                        <Input
                            minW={96}
                            placeholder="Qual imobiliária está procurando?"
                            value={filter.query}
                            onChange={(e) =>
                                setFilter({ ...filter, query: e.target.value })
                            }
                        />
                        {/* <Select
                            placeholder="De qual conta é?"
                            value={filter.contaId}
                            onChange={(e) =>
                                setFilter({
                                    ...filter,
                                    contaId: e.target.value,
                                })
                            }
                        >
                            {contas &&
                                contas.map((item, key) => (
                                    <option value={item.id}>{item.nome}</option>
                                ))}
                        </Select> */}
                    </Flex>
                    <Button
                        colorScheme="blue"
                        leftIcon={<Icon as={FaPlus} />}
                        onClick={() => imobiliariaDrawer.current.onOpen()}
                    >
                        Adicionar imobiliária
                    </Button>
                </Flex>
                <Box>
                    <Table variant="striped" size="sm">
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th w={24}>Conta</Th>
                                <Th>Razão Social</Th>
                                <Th w={12}>Código</Th>
                                <Th>CNPJ</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {imobiliarias && imobiliarias.length ? (
                                imobiliarias.map((item, key) => (
                                    <Tr key={key}>
                                        <Td>{item?.id}</Td>
                                        <Td>{item.conta?.nome}</Td>
                                        <Td>{item.razaoSocial}</Td>
                                        <Td>{item.codigo}</Td>
                                        <Td>{item.cnpj}</Td>
                                        <Td>
                                            <Tooltip label="Editar imobiliária">
                                                <Button
                                                    rounded="full"
                                                    size="xs"
                                                    onClick={() =>
                                                        imobiliariaDrawer.current.onOpen(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    <Icon as={FaEdit} />
                                                </Button>
                                            </Tooltip>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan={5} textAlign="center">
                                        Não há imobiliarias cadastradas
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </Container>
            <ImobiliariaDrawer ref={imobiliariaDrawer} />
        </Layout>
    );
};

export default Imobiliarias;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
