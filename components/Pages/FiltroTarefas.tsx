import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { listarUsuarios } from "@/services/models/usuario";
import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { FormDateRange } from "../Form/FormDateRange";
import { FormMultiSelect } from "../Form/FormMultiSelect";

export const FiltroTarefas = ({ setFiltro, filtro }) => {
    const { data: responsaveis } = useQuery(
        ["responsaveis", { admImobiliaria: true, status: true }],
        listarUsuarios
    );
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
                            placeholder="por nº contrato"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    codigoContrato: e.target.value,
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormInput
                            size="sm"
                            label="Codigo do Imóvel"
                            placeholder="Codigo imóvel"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    codigoContrato: e.target.value,
                                })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormMultiSelect
                            size="sm"
                            label="Responsáveis"
                            placeholder="Responsáveis"
                            isMulti
                            options={responsaveis?.data?.data}
                            getOptionLabel={(e) => e.nome}
                            getOptionValue={(e) => e.id}
                            value={filtro.responsaveis}
                            onChange={(e) =>
                                setFiltro({ ...filtro, responsaveis: e })
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <FormDateRange
                            size="sm"
                            label="Data de Criação"
                            startDate={filtro?.dataCriacao[0]}
                            endDate={filtro?.dataCriacao[1]}
                            onChange={(e) => {
                                setFiltro({ ...filtro, dataCriacao: e });
                            }}
                        />
                    </GridItem>
                    <GridItem>
                        <FormDateRange
                            size="sm"
                            label="Data de Vencimento"
                            startDate={filtro?.dataVencimento[0]}
                            endDate={filtro?.dataVencimento[1]}
                            onChange={(e) => {
                                setFiltro({ ...filtro, dataVencimento: e });
                            }}
                        />
                    </GridItem>
                    <GridItem>
                        <FormDateRange
                            size="sm"
                            label="Data de Entrega"
                            placeholder="por data de entrega"
                            startDate={filtro?.dataEntrega[0]}
                            endDate={filtro?.dataEntrega[1]}
                            onChange={(e) => {
                                setFiltro({ ...filtro, dataEntrega: e });
                            }}
                        />
                    </GridItem>
                    <GridItem>
                        <FormSelect
                            size="sm"
                            label="Status"
                            placeholder="Por status"
                            onChange={(e) =>
                                setFiltro({
                                    ...filtro,
                                    status: e.target.value,
                                })
                            }
                        >
                            <option value="aberta">Aberta</option>
                            <option value="finalizada">Finalizada</option>
                        </FormSelect>
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
                                dataCriacao: [null, null],
                                dataEntrega: [null, null],
                                dataVencimento: [null, null],
                                responsaveis: [],
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
