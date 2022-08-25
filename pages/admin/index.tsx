import {
    Box,
    Button,
    Collapse,
    Flex,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
    MdPageview,
} from "react-icons/md";
import { FormDate } from "@/components/Form/FormDate";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { ModalContratos } from "@/components/Modals/contratos";
import { withSSRAuth } from "../../utils/withSSRAuth";

const Home = () => {
    const { isOpen, onToggle } = useDisclosure();
    const modalcontratos = useRef();

    return (
        <>
            <Layout title="Contratos">
                <Box p={5}>
                    <Box bg="graylight" p={5}>
                        <Grid gap={5}>
                            <Grid
                                templateColumns={{
                                    sm: "repeat(1, 1fr)",
                                    md: "repeat(2, 1fr)",
                                    lg: "repeat(5, 1fr)",
                                }}
                                gap={5}
                            >
                                <GridItem>
                                    <FormInput
                                        label="Nº do contrato"
                                        placeholder="digite um número..."
                                        bg="white"
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormDate
                                        label="Data de vencimento"
                                        bg="white"
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Nome do propietário"
                                        placeholder="digite o nome do propietário..."
                                        bg="white"
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Nome do inquilino"
                                        placeholder="digite o nome do inquilino..."
                                        bg="white"
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Nome do fiador"
                                        placeholder="digite o nome do fiador..."
                                        bg="white"
                                    />
                                </GridItem>

                                <GridItem>
                                    <FormInput
                                        label="Rua"
                                        placeholder="digite o nome da rua..."
                                        bg="white"
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Número"
                                        placeholder="digite o número da rua..."
                                        bg="white"
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Bairro"
                                        placeholder="digite o nome do bairro..."
                                        bg="white"
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Cidade"
                                        placeholder="digite o nome da cidade..."
                                        bg="white"
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        label="Estado"
                                        placeholder="digite o nome do estado..."
                                        bg="white"
                                    />
                                </GridItem>
                            </Grid>

                            <Collapse in={isOpen} animateOpacity>
                                <Flex gap={5}>
                                    <Box w="max">
                                        <FormDate label="Data início" />
                                    </Box>
                                    <FormSelect
                                        label="Formas de pagamento"
                                        placeholder="selecione..."
                                        bg="white"
                                        w="max"
                                    >
                                        <option value=""></option>
                                    </FormSelect>
                                </Flex>
                            </Collapse>
                        </Grid>
                        <Grid
                            mt={5}
                            templateColumns={{
                                sm: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                            }}
                        >
                            <GridItem w="100%">
                                <Button
                                    size="md"
                                    onClick={onToggle}
                                    bg="none"
                                    border="none"
                                    p={0}
                                    _hover={{
                                        bg: "none",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    _focus={{ bg: "none", border: "none" }}
                                    _active={{ bg: "none", border: "none" }}
                                    color="red"
                                >
                                    {isOpen ? (
                                        <Text pr="2">
                                            Fechar opções de filtros
                                        </Text>
                                    ) : (
                                        <Text pr="2">
                                            Exibir mais opções de filtros
                                        </Text>
                                    )}
                                    {isOpen ? (
                                        <Icon as={MdOutlineKeyboardArrowUp} />
                                    ) : (
                                        <Icon as={MdOutlineKeyboardArrowDown} />
                                    )}
                                </Button>
                            </GridItem>

                            <GridItem
                                w="100%"
                                d="flex"
                                justifyContent="flex-end"
                                gap={5}
                            >
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

                    <Box bg="graylight" overflowX="auto" p={5} mt={5}>
                        <Box p={5} bg="white">
                            <FormInput
                                bg="white"
                                w="max"
                                placeholder="Busca rápida..."
                            />
                        </Box>

                        <Table variant="striped" mt={5} bg="white">
                            <Thead>
                                <Tr>
                                    <Th>Nº do contrato</Th>
                                    <Th>Data de início</Th>
                                    <Th>Data de reajuste</Th>
                                    <Th>Inquilino Principal</Th>
                                    <Th>Endereço</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>83282323</Td>
                                    <Td>06/05/2022</Td>
                                    <Td>15/05/2022</Td>
                                    <Td>Fernando Camargo</Td>
                                    <Td>
                                        Rua Orlando de moraes, 146, Santa Rita
                                        2, Nova Odessa
                                    </Td>
                                    <Td>
                                        <IconButton
                                            as={MdPageview}
                                            color="bluelight"
                                            onClick={() =>
                                                modalcontratos.current.onOpen()
                                            }
                                            aria-label="Abrir"
                                        />

                                        <IconButton
                                            as={IoIosRemoveCircle}
                                            color="red"
                                            size="sm"
                                            aria-label="Remover"
                                        />
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>83282323</Td>
                                    <Td>06/05/2022</Td>
                                    <Td>15/05/2022</Td>
                                    <Td>Fernando Camargo</Td>
                                    <Td>
                                        Rua Orlando de moraes, 146, Santa Rita
                                        2, Nova Odessa
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </Layout>
            <ModalContratos ref={modalcontratos} />
        </>
    );
};
export default Home;

export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    {
        cargos: ["imobiliaria"],
    }
);
