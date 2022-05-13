import {
    Box,
    Button,
    Grid,
    GridItem,
    IconButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useRef } from "react";
import { MdPageview } from "react-icons/md";
import { FormInput } from "../../components/Form/FormInput";
import { Layout } from "../../components/Layout/layout";
import { ModalPropietarios } from "../../components/Modals/propietarios";

const Propietarios = () => {
    const modalpropietarios = useRef();
    return (
        <>
            <Layout title="Propietários">
                <Box p={5}>
                    <Box bg="graylight" p={5}>
                        <Grid
                            gap={5}
                            templateColumns={{
                                sm: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                            }}
                        >
                            <GridItem>
                                <FormInput
                                    label="Propietários"
                                    placeholder="digite o nome do propietário..."
                                    bg="white"
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="CPF/CNPJ"
                                    placeholder="digite o cpf ou cnpj..."
                                    bg="white"
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="Email"
                                    placeholder="digite o número do email..."
                                    bg="white"
                                />
                            </GridItem>
                        </Grid>
                        <Box
                            w="100%"
                            mt={5}
                            d="flex"
                            gap={5}
                            justifyContent="flex-end"
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
                        </Box>
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
                                    <Th>Propietário</Th>
                                    <Th>CPF/CNPJ</Th>
                                    <Th>Email</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>Fernando Camargo</Td>
                                    <Td>467.151.078-23</Td>
                                    <Td>dev@trafegointegrada.com.br</Td>
                                    <Td>
                                        <IconButton
                                            as={MdPageview}
                                            color="bluelight"
                                            onClick={() =>
                                                modalpropietarios.current.onOpen()
                                            }
                                        />
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </Layout>
            <ModalPropietarios ref={modalpropietarios} />
        </>
    );
};
export default Propietarios;
