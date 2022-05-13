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
import { IoAddOutline } from "react-icons/io5";
import { MdPageview } from "react-icons/md";
import { FormInput } from "../../components/Form/FormInput";
import { Layout } from "../../components/Layout/layout";
import { ModalUsuarios } from "../../components/Modals/usuarios";

const Usuarios = () => {
    const modalusuarios = useRef();
    return (
        <>
            <Layout title="Usuários">
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
                                    label="Usuários"
                                    placeholder="digite o nome do propietário..."
                                    bg="white"
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="Nome"
                                    placeholder="digite o cpf ou cnpj..."
                                    bg="white"
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="Fone"
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
                            <Grid templateColumns="repeat(2, 1fr)">
                                <GridItem>
                                    <FormInput
                                        bg="white"
                                        w="max"
                                        placeholder="Busca rápida..."
                                    />
                                </GridItem>
                                <GridItem d="flex" justifyContent="flex-end">
                                    <Button
                                        bg="none"
                                        border="1px solid #2F80ED"
                                        color="bluelight"
                                        _hover={{
                                            bg: "bluelight",
                                            color: "white",
                                            cursor: "pointer",
                                        }}
                                        _focus={{ bg: "none" }}
                                        _active={{ bg: "none" }}
                                    >
                                        Novo usuário <IoAddOutline />
                                    </Button>
                                </GridItem>
                            </Grid>
                        </Box>

                        <Table variant="striped" mt={5} bg="white">
                            <Thead>
                                <Tr>
                                    <Th>Usuários</Th>
                                    <Th>Nome</Th>
                                    <Th>Fone</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>Fernando Camargo</Td>
                                    <Td>Suporte - Trafego Integrada</Td>
                                    <Td>dev@trafegointegrada.com.br</Td>
                                    <Td>
                                        <IconButton
                                            as={MdPageview}
                                            color="bluelight"
                                            onClick={() =>
                                                modalusuarios.current.onOpen()
                                            }
                                        />
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </Layout>
            <ModalUsuarios ref={modalusuarios} />
        </>
    );
};
export default Usuarios;
