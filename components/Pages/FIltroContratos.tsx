import {
    Box,
    Button,
    Collapse,
    Flex,
    Grid,
    GridItem,
    Icon,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { FormDate } from "../Form/FormDate";
import { FormInput } from "../Form/FormInput";
import { FormSelect } from "../Form/FormSelect";

export const FiltroContratos = ({ setFiltro, filtro }) => {
    const { isOpen, onToggle } = useDisclosure();
    return (
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
                            label="Dia de vencimento"
                            bg="white"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    vencimento: e.target.value,
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormInput
                            label="Nome do propietário"
                            placeholder="digite o nome do propietário..."
                            bg="white"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    proprietario: e.target.value,
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormInput
                            label="Nome do inquilino"
                            placeholder="digite o nome do inquilino..."
                            bg="white"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    inquilino: e.target.value,
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormInput
                            label="Nome do fiador"
                            placeholder="digite o nome do fiador..."
                            bg="white"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    fiador: e.target.value,
                                })
                            }
                        />
                    </GridItem>

                    <GridItem>
                        <FormInput
                            label="Rua"
                            placeholder="digite o nome da rua..."
                            bg="white"
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
                            label="Número"
                            placeholder="digite o número da rua..."
                            bg="white"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    numero: e.target.value,
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormInput
                            label="Bairro"
                            placeholder="digite o nome do bairro..."
                            bg="white"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    bairro: e.target.value,
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormInput
                            label="Cidade"
                            placeholder="digite o nome da cidade..."
                            bg="white"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    filtro: {
                                        ...filtro.filtro,
                                        cidade: e.target.value,
                                    },
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormInput
                            label="Estado"
                            placeholder="digite o nome do estado..."
                            bg="white"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    estado: {
                                        ...filtro.filtro,
                                        query: e.target.value,
                                    },
                                })
                            }
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
                            <Text pr="2">Fechar opções de filtros</Text>
                        ) : (
                            <Text pr="2">Exibir mais opções de filtros</Text>
                        )}
                        {isOpen ? (
                            <Icon as={MdOutlineKeyboardArrowUp} />
                        ) : (
                            <Icon as={MdOutlineKeyboardArrowDown} />
                        )}
                    </Button>
                </GridItem>

                <GridItem w="100%" d="flex" justifyContent="flex-end" gap={5}>
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
    );
};
