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
import { FormDate } from "@/Form/FormDate";
import { FormInput } from "@/Form/FormInput";
import { FormSelect } from "@/Form/FormSelect";

export const FiltroContratos = ({ setFiltro, filtro }) => {
    const { isOpen, onToggle } = useDisclosure();
    return (
        <Box bg="white" p={5}>
            <Grid gap={5}>
                <Grid
                    templateColumns={{
                        sm: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(5, 1fr)",
                    }}
                    gap={2}
                >
                    <GridItem>
                        <FormInput
                            size="sm"
                            label="Nº do contrato"
                            placeholder="digite um número..."
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
                            label="Dia de vencimento"
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
                            size="sm"
                            label="Nome do propietário"
                            placeholder="digite o nome do propietário..."
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
                            size="sm"
                            label="Nome do inquilino"
                            placeholder="digite o nome do inquilino..."
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
                            size="sm"
                            label="Nome do fiador"
                            placeholder="digite o nome do fiador..."
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
                            size="sm"
                            label="Rua"
                            placeholder="digite o nome da rua..."
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
                            label="Número"
                            placeholder="digite o número da rua..."
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
                            size="sm"
                            label="Bairro"
                            placeholder="digite o nome do bairro..."
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
                            size="sm"
                            label="Cidade"
                            placeholder="digite o nome da cidade..."
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
                            size="sm"
                            label="Estado"
                            placeholder="digite o nome do estado..."
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
            </Grid>
            <Grid mt={2}>
                <GridItem w="100%" d="flex" justifyContent="flex-end" gap={5}>
                    <Button
                        size="sm"
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
                        size="sm"
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
