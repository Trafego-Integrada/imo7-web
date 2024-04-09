import { useMemo, useRef, useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import Image from "next/image";
import { useQuery } from "react-query";
import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { Button, Flex, Icon, Text, Tooltip, useToast } from "@chakra-ui/react";

interface TipoConsultaProps {
    ficha: any;
    consulta: any;
    cpf?: string;
    cnpj?: string;
    uf?: string;
    dataNascimento?: string;
}

export const Consulta = ({
    consulta,
    ficha,
    cpf,
    cnpj,
    dataNascimento,
}: TipoConsultaProps) => {
    const toast = useToast();
    const preview = useRef();

    const [consultandoNetrin, setConsultandoNetrin] = useState(false);

    const deveRenderizar = useMemo(() => {
        const validaCpf = consulta.tipoConsulta.includes("cpf") && cpf;
        const validaCnpj = consulta.tipoConsulta.includes("cnpj") && cnpj;

        return validaCpf || validaCnpj;
    }, [consulta, cpf, cnpj]);

    const consultarNetrin = async (data) => {
        try {
            setConsultandoNetrin(true);

            await api.post("v1/integracao/netrin", {
                ...data,
                processoId: ficha.processoId,
                fichaCadastralId: ficha.id,
            });

            queryClient.invalidateQueries(["consultasNetrin"]);

            toast({
                title: "Consulta realizada com sucesso, entre na aba consultas para visualizar o documento",
                status: "success",
            });

            setConsultandoNetrin(false);
        } catch (error) {
            setConsultandoNetrin(false);

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
                fichaCadastralId: ficha.id,
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

    if (!deveRenderizar) return null;

    return (
        <Flex
            key={consulta.codigo}
            rounded="lg"
            borderWidth={1}
            flexDir="column"
            justify="space-between"
            w="14rem"
        >
            <Flex
                flexDir="column"
                gap={3}
                align="center"
                justify="center"
                h="full"
                p={4}
            >
                <Image
                    alt="Receita Federal"
                    src={consulta.image}
                    style={{
                        width: consulta.size[0],
                        height: consulta.size[1],
                    }}
                />

                <Flex align="center">
                    <Text fontSize="small" textAlign="center" fontWeight="bold">
                        {consulta?.nome}
                    </Text>
                </Flex>
            </Flex>

            <Button
                w="full"
                variant="outline"
                size="xs"
                border={0}
                borderTop="1px"
                borderColor="#e1e8f0"
                rounded={0}
                py="1rem"
                leftIcon={<Icon as={FiSearch} />}
                onClick={() =>
                    consultarNetrin({
                        tipoConsulta: consulta.codigo,
                        requisicao: {
                            cpf,
                            cnpj,
                            dataNascimento,
                        },
                    })
                }
                isLoading={consultandoNetrin}
            >
                Consultar
            </Button>

            {data?.find(
                (c) =>
                    c.tipoConsulta == consulta.codigo && c.requisicao.cpf == cpf
            )?.retorno && (
                <Tooltip label="Visualizar Arquivo">
                    <Button
                        variant="outline"
                        size="xs"
                        border={0}
                        borderTop="1px"
                        borderColor="#e1e8f0"
                        rounded={0}
                        py="1rem"
                        leftIcon={<Icon as={FiEye} />}
                        onClick={() =>
                            preview?.current?.onOpen(
                                process.env.NODE_ENV == "production"
                                    ? `https://www.imo7.com.br/api/v1/integracao/netrin/${
                                          data?.find(
                                              (ii) =>
                                                  ii.tipoConsulta ==
                                                      consulta.codigo &&
                                                  ii.requisicao.cpf == cpf
                                          ).id
                                      }/pdf`
                                    : `http://localhost:3000/api/v1/integracao/netrin/${
                                          data?.find(
                                              (ii) =>
                                                  ii.tipoConsulta ==
                                                      consulta.codigo &&
                                                  ii.requisicao.cpf == cpf
                                          ).id
                                      }/pdf`
                            )
                        }
                    >
                        {data?.find(
                            (ii) =>
                                ii.tipoConsulta == consulta.codigo &&
                                ii.requisicao.cpf == cpf
                        )?.retorno?.processosCPF?.code
                            ? "0"
                            : data?.find(
                                  (ii) =>
                                      ii.tipoConsulta == consulta.codigo &&
                                      ii.requisicao.cpf == cpf
                              )?.retorno?.processosCPF?.totalProcessos}{" "}
                        Resultados
                    </Button>
                </Tooltip>
            )}
        </Flex>
    );
};
