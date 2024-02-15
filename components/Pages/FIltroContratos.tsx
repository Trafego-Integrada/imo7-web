import { Box, Button, Grid, GridItem, useDisclosure } from "@chakra-ui/react";

export const FiltroContratos = ({ setFiltro, filtro }) => {
    const { isOpen, onToggle } = useDisclosure();
    console.log(filtro);
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
                ></Grid>
            </Grid>
            <Grid mt={2}>
                <GridItem
                    w="100%"
                    display="flex"
                    justifyContent="flex-end"
                    gap={5}
                >
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
                        onClick={() =>
                            setFiltro({
                                dataReajuste: [null, null],
                                dataInicio: [null, null],
                                dataFim: [null, null],
                                dataCriacao: [null, null],
                            })
                        }
                    >
                        Limpar Filtro
                    </Button>
                </GridItem>
            </Grid>
        </Box>
    );
};
