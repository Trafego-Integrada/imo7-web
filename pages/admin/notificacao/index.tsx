import { useState } from "react";
import { Layout } from "@/components/Layout/layout";
import {
    Box,
    Button,
    Grid,
    GridItem,
    Spinner,
    Table,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { listarNotificacoes } from "@/services/models/notificacao";
import { useQuery } from "react-query";
import moment from "moment";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { InferGetServerSidePropsType } from "next";

const Notificacao = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [filtro, setFiltro] = useState({
        filtro: {},
    });

    const { data, isFetching, isLoading } = useQuery(
        ["noticacao",{
            ...filtro
        }],
        listarNotificacoes
    );

    const status = {
        "1": "AGUARDANDO",
        "2": "ENVIADO",
        "3": "ERRO",
    };

    const ctrlStatus = (n) => {
        return status[n];
    };

    return (
        <>
            <Layout title="Notificações" subtitle={"Listagem"}>
                <Box p={5}>
                    {/* FILTROS */}
                    <Box p={5} mt={5} bg={"white"} borderRadius="lg">
                        <Grid
                            gap={5}
                            templateColumns={{
                                sm: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(4, 1fr)",
                            }}
                        >
                            <GridItem>
                                <FormInput
                                    label="E-mail"
                                    placeholder="digite um e-mail"
                                    bg="white"
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>

                            <GridItem>
                                <FormInput
                                    label="Telefone"
                                    placeholder="digite um telefone"
                                    bg="white"
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            telefone: e.target.value,
                                        })
                                    }
                                />
                            </GridItem>

                            <GridItem>
                                <FormSelect
                                    label="Tipo de Midia"
                                    bg="white"
                                    placeholder="Selecione..."
                                     onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            tipo: e.target.value,
                                        })
                                    }

                                >
                                    <option value="1">E-mail</option>
                                    <option value="2">WhatsApp</option>
                                    <option value="3">SMS</option>
                                </FormSelect>
                            </GridItem>

                            <GridItem>
                                <FormSelect
                                    label="Status"
                                    bg="white"
                                    placeholder="Selecione..."
                                     onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            status: e.target.value,
                                        })
                                    }
                                >
                                    <option value="1">Aguardando</option>
                                    <option value="2">Enviado</option>
                                    <option value="3">Erro</option>
                                </FormSelect>
                            </GridItem>

                            <GridItem colSpan={4} textAlign={"right"}>
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
                                >
                                    Limpar Filtro
                                </Button>

                                <Button
                                    ml="5"
                                    
                                    size="md"
                                    bg="none"
                                    border="1px solid black"
                                    _hover={{
                                        bg: "black",
                                        color: "white",
                                        cursor: "pointer",
                                    }}
                                    _focus={{ bg: "none" }}
                                    _active={{ bg: "none" }}
                                    color="black"
                                >
                                    Filtrar
                                </Button>
                            </GridItem>
                        </Grid>
                    </Box>

                    <Box bg={"graylight"} p="5" mt="5" borderRadius="lg">
                        <Table variant="striped" mt={5} bg="white">
                            <Thead>
                                <Th>Data de envio</Th>
                                <Th>Nº de Contrato</Th>
                                <Th>Canal Mídia</Th>
                                <Th>Assunto</Th>
                                <Th>Status</Th>
                                <Th>Nome Destinatário</Th>
                            </Thead>
                            <Tbody>
                                {isLoading && (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            <Spinner />
                                        </Td>
                                    </Tr>
                                )}
                                {/* REGRAS */}
                                {data?.content.map((not) => {
                                    let lista = not.notificacao;

                                    return lista.map((v) => (
                                        <Tr>
                                            <Td>
                                                {moment(v.createdAt).format(
                                                    "DD/MM/YYYY H:m"
                                                )}
                                            </Td>
                                            <Td>{v.contrato}</Td>
                                            <Td>{v.canalMidia.descricao}</Td>
                                            <Td>{v.assunto}</Td>
                                            <Td>
                                                <Tag
                                                    colorScheme="cyan"
                                                    key={"md"}
                                                    variant="solid"
                                                >
                                                    {ctrlStatus(v.status)}
                                                </Tag>
                                            </Td>
                                            <Td>{v.usuario.nome}</Td>
                                        </Tr>
                                    ));
                                })}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </Layout>
        </>
    );
};

export default Notificacao;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);

