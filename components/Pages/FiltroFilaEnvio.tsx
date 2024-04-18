import { FormInput } from "@/components/Form/FormInput";
import { Box, Button, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { FormDateRange } from "../Form/FormDateRange";

export const FiltroFilaEnvio = ({ setFiltro, filtro }) => {
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
                            label="Nome do Destinatario"
                            placeholder="digite um nome..."
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    nomeDestinatario: e.target.value,
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormInput
                            size="sm"
                            label="E-mail do destinatario"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    destinatario: e.target.value,
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormDateRange
                            size="sm"
                            label="Previsão de envio"
                            startDate={filtro?.previsaoEnvio[0]}
                            endDate={filtro?.previsaoEnvio[1]}
                            onChange={(e) => {
                                setFiltro({ ...filtro, previsaoEnvio: e });
                            }}
                        />
                    </GridItem>
                    <GridItem>
                        <FormDateRange
                            size="sm"
                            label="Data do Envio"
                            startDate={filtro?.dataEnvio[0]}
                            endDate={filtro?.dataEnvio[1]}
                            onChange={(e) => {
                                setFiltro({ ...filtro, dataEnvio: e });
                            }}
                        />
                    </GridItem>
                    <GridItem>
                        <FormDateRange
                            size="sm"
                            label="Data de Criação"
                            startDate={filtro?.createdAt[0]}
                            endDate={filtro?.createdAt[1]}
                            onChange={(e) => {
                                setFiltro({ ...filtro, createdAt: e });
                            }}
                        />
                    </GridItem>
                </Grid>
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
                                previsaoEnvio: [null, null],
                                dataEnvio: [null, null],
                                createdAt: [null, null],
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
