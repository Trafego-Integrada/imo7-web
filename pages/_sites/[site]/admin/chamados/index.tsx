import {
    Box,
    Button,
    Circle,
    Flex,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Table,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MdPageview } from "react-icons/md";
import { FormDate } from "@/components/Form/FormDate";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { ModalChamados } from "@/components/Modals/chamados";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { useQuery } from "react-query";
import { listarChamados } from "@/services/models/chamado";
import { formatoData } from "@/helpers/helpers";
import { useRouter } from "next/router";
import { FiBookOpen, FiEye, FiSearch } from "react-icons/fi";
import { ModalAbrirChamado } from "@/components/Modals/AbrirChamado";

const Cobrancas = () => {
    const router = useRouter();
    const modalchamados = useRef();
    const abrirChamado = useRef();
    const [filtro, setFiltro] = useState({});
    const { data } = useQuery(["chamados", filtro], listarChamados);
    return (
        <>
            <Layout title="Chamados">
                <Flex flexDir="column" gridGap={4} p={4}>
                    <Box bg="white" p={4}>
                        <Grid gap={5}>
                            <Grid
                                templateColumns={{
                                    sm: "repeat(1, 1fr)",
                                    md: "repeat(2, 1fr)",
                                    lg: "repeat(7, 1fr)",
                                }}
                                gap={5}
                            >
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Nº do contrato"
                                        placeholder="digite um número..."
                                        value={filtro.codigo}
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                codigo: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Endereço"
                                        placeholder="digite a rua/bairro/cidade..."
                                        value={filtro.endereco}
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                endereco: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Inquilino"
                                        placeholder="digite o nome do inquilino..."
                                        value={filtro.inquilino}
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                inquilino: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>

                                <GridItem>
                                    <FormSelect
                                        size="sm"
                                        label="Status"
                                        placeholder="Selecione..."
                                        value={filtro.status}
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="ABERTO" selected>
                                            Aberto
                                        </option>
                                        <option value="FINALIZADO">
                                            Finalizado
                                        </option>
                                        <option value="ARQUIVADO">
                                            Arquivado
                                        </option>
                                    </FormSelect>
                                </GridItem>

                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        type="date"
                                        label="Data de criação"
                                        value={filtro.createdAt}
                                        onChange={(e) =>
                                            setFiltro({
                                                ...filtro,
                                                createdAt: e.target.value,
                                            })
                                        }
                                    />
                                </GridItem>

                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        type="date"
                                        label="Data de retorno"
                                    />
                                </GridItem>
                                <GridItem as={Flex} align="flex-end">
                                    <Button
                                        size="md"
                                        bg="none"
                                        border="1px solid red"
                                        _hover={{
                                            bg: "red",
                                            color: "white",
                                            cursor: "pointer",
                                        }}
                                        _focus={{ bg: "none" }}
                                        _active={{ bg: "none" }}
                                        color="red"
                                        onClick={() =>
                                            setFiltro({
                                                status: null,
                                                createdAt: "",
                                                codigo: "",
                                                endereco: "",
                                                inquilino: "",
                                                query: "",
                                            })
                                        }
                                    >
                                        Limpar Filtro
                                    </Button>
                                </GridItem>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box bg="white" overflowX="auto" p={4}>
                        <Flex p={5} bg="white" justify="space-between">
                            <FormInput
                                bg="white"
                                w="max"
                                placeholder="Busca rápida..."
                                value={filtro.query}
                                onChange={(e) =>
                                    setFiltro({
                                        ...filtro,
                                        query: e.target.value,
                                    })
                                }
                            />
                            <Button
                                colorScheme="blue"
                                onClick={() => abrirChamado.current.onOpen()}
                            >
                                Abrir Chamado
                            </Button>
                        </Flex>
                        <Table variant="striped" mt={5} bg="white" size="sm">
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

                                    <Th>Contrato</Th>
                                    <Th w={36} textAlign="center">
                                        Criado em
                                    </Th>
                                    <Th w={36} textAlign="center">
                                        Ultima interação
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
                                {data?.data?.data.map((item) => (
                                    <Tr key={item.id}>
                                        <Td textAlign="center">{item.id}</Td>
                                        <Td textAlign="center">
                                            {item.assunto?.departamento?.titulo}
                                        </Td>
                                        <Td textAlign="center">
                                            {item.assunto?.titulo}
                                        </Td>
                                        <Td textAlign="center">
                                            {item.criador?.nome}
                                        </Td>

                                        <Td>
                                            <Text>{item.contrato?.codigo}</Text>
                                            <Text>
                                                {
                                                    item.contrato?.imovel
                                                        ?.endereco
                                                }
                                            </Text>
                                        </Td>
                                        <Td textAlign="center">
                                            {formatoData(item.createdAt)}
                                        </Td>
                                        <Td textAlign="center">
                                            {item.interacoes.length &&
                                                formatoData(
                                                    item.interacoes[
                                                        item.interacoes.length -
                                                            1
                                                    ].createdAt
                                                )}
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
                                                    router.push({
                                                        pathname:
                                                            "/admin/chamados/[id]",
                                                        query: {
                                                            id: item.id,
                                                        },
                                                    })
                                                }
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Flex>
            </Layout>
            <ModalChamados ref={modalchamados} />
            <ModalAbrirChamado ref={abrirChamado} />
        </>
    );
};
export default Cobrancas;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
