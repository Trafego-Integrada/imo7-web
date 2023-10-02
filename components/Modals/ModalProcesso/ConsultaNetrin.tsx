import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { formatoData, tagTipoConsultaNetrin } from "@/helpers/helpers";
import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    IconButton,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiPrinter } from "react-icons/fi";
import { useQuery } from "react-query";

export const ConsultasNetrin = ({
    processoId = null,
    fichaCadastralId = null,
}) => {
    const toast = useToast();
    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.post("v1/integracao/netrin", {
                ...data,
                processoId,
                fichaCadastralId,
            });
            queryClient.invalidateQueries(["consultasNetrin"]);
            toast({
                title: "Consulta realizada com sucesso",
                status: "success",
            });
        } catch (error) {
            console.log(error?.response);
            toast({
                title: "Houve um problema",
                description: error?.response?.data?.message,
                status: "warning",
            });
        }
    };

    const { data } = useQuery(
        [
            "consultasNetrin",
            {
                processoId,
                fichaCadastralId,
            },
        ],
        async ({ queryKey }) => {
            try {
                const response = await api.get("v1/integracao/netrin", {
                    params: {
                        ...queryKey[1],
                    },
                });

                return response?.data;
            } catch (error) {
                throw Error(error.message);
            }
        }
    );
    return (
        <Flex flexDir="column" gap={4}>
            <Flex
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                flexDir="column"
                gap={4}
            >
                <Text fontWeight="bold">Realizar Consultas</Text>

                <Grid gap={4} gridTemplateColumns={{ lg: "repeat(4,1fr)" }}>
                    <GridItem>
                        <FormSelect
                            size="sm"
                            label="Tipo de Consulta"
                            placeholer="Selecione..."
                            {...register("tipoConsulta")}
                        >
                            <option value="processos_pj">Processos PJ</option>
                            <option value="processos_pf">Processos PF</option>
                            <option value="protestos" disabled>
                                Protestos
                            </option>
                            <option value="protestos_sp" disabled>
                                Protestos SP
                            </option>
                            <option value="cnd_federal" disabled>
                                CND Federal
                            </option>
                            <option value="cnd_estadual" disabled>
                                CND Estadual
                            </option>
                            <option value="cnd_trabalhista_tst" disabled>
                                CND Trabalhista TST
                            </option>
                            <option value="cnd_trabalhista_mte" disabled>
                                CND Trabalhista MTE
                            </option>
                            <option value="receita_cnpj" disabled>
                                Receita CNPJ
                            </option>
                            <option value="receita_cnpj_qsa" disabled>
                                Receita CNPJ QSA
                            </option>
                            <option value="receita_cpf" disabled>
                                Receita CPF
                            </option>
                        </FormSelect>
                    </GridItem>
                    {watch("tipoConsulta") == "processos_pf" && (
                        <GridItem>
                            <FormInput
                                size="sm"
                                label="CPF"
                                placeholder="Digite o CPF"
                                mask="999.999.999-99"
                                {...register("requisicao.cpf")}
                            />
                        </GridItem>
                    )}
                    {watch("tipoConsulta") == "processos_pj" && (
                        <GridItem>
                            <FormInput
                                size="sm"
                                label="CNPJ"
                                placeholder="Digite o CNPJ"
                                mask="99.999.999/9999-99"
                                {...register("requisicao.cnpj")}
                            />
                        </GridItem>
                    )}
                    <GridItem display="flex" alignItems="flex-end">
                        <Button
                            type="submit"
                            size="sm"
                            isLoading={isSubmitting}
                        >
                            Consultar
                        </Button>
                    </GridItem>
                </Grid>
            </Flex>
            <Flex flexDir="column" gap={4}>
                <Text fontWeight="bold">
                    Consultas <Text as="span">({data?.length})</Text>
                </Text>
                <Table size="sm">
                    <Thead>
                        <Tr>
                            <Th w={12}></Th>
                            <Th w={44}>Data</Th>
                            <Th w={44}>Tipo de Consulta</Th>
                            <Th w={44}>Requisição</Th>
                            <Th>Resultado</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((item) => (
                            <Tr key={item.id}>
                                <Td>
                                    <Tooltip label="Imprimir">
                                        <Link
                                            href={{
                                                pathname:
                                                    process.env.NODE_ENV ==
                                                    "production"
                                                        ? `https://www.imo7.com.br/api/v1/integracao/netrin/${item.id}/pdf`
                                                        : `http://localhost:3000/api/v1/integracao/netrin/${item.id}/pdf`,
                                            }}
                                            target="_blank"
                                        >
                                            <IconButton
                                                size="sm"
                                                icon={<FiPrinter />}
                                            />
                                        </Link>
                                    </Tooltip>
                                </Td>
                                <Td>
                                    {formatoData(item.createdAt, "DATA_HORA")}
                                </Td>
                                <Td>
                                    {tagTipoConsultaNetrin(item.tipoConsulta)}
                                </Td>
                                <Td>
                                    {item.tipoConsulta == "processos_pf" ? (
                                        <Text>
                                            <Text as="span" fontWeight="bold">
                                                CPF:
                                            </Text>{" "}
                                            <Text as="span" fontStyle="italic">
                                                {item?.requisicao?.cpf}
                                            </Text>
                                        </Text>
                                    ) : item.tipoConsulta == "processos_pj" ? (
                                        <Text>
                                            <Text as="span" fontWeight="bold">
                                                CNPJ:
                                            </Text>{" "}
                                            <Text as="span" fontStyle="italic">
                                                {item?.requisicao?.cnpj}
                                            </Text>
                                        </Text>
                                    ) : (
                                        ""
                                    )}
                                </Td>
                                <Td>
                                    {item.tipoConsulta == "processos_pf" ? (
                                        <Text>
                                            <Text as="span" fontWeight="bold">
                                                {
                                                    item.retorno?.processosCPF
                                                        ?.totalProcessos
                                                }
                                            </Text>{" "}
                                            <Text as="span" fontStyle="italic">
                                                processos encontrados
                                            </Text>
                                        </Text>
                                    ) : item.tipoConsulta == "processos_pj" ? (
                                        <Text>
                                            <Text as="span" fontWeight="bold">
                                                {
                                                    item.retorno
                                                        ?.processoJudicial
                                                        ?.totalProcessos
                                                }
                                            </Text>{" "}
                                            <Text as="span" fontStyle="italic">
                                                processos encontrados
                                            </Text>
                                        </Text>
                                    ) : (
                                        ""
                                    )}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Flex>
        </Flex>
    );
};
