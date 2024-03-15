import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import {
    Button,
    Flex,
    Grid,
    Icon,
    Image,
    Text,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { useQuery } from "react-query";
import { ModalPreview } from "../Preview";

interface TipoConsultaProps {
    tipoConsultas: string[];
    ficha: any;
    cpf?: string;
    cnpj?: string;
    uf?: string;
}

export const Consultas = ({
    tipoConsultas,
    ficha,
    cpf,
    cnpj,
}: TipoConsultaProps) => {
    const toast = useToast();
    const preview = useRef();
    const [consultandoNetrin, setConsultandoNetrin] = useState(false);
    const consultarNetrin = async (data) => {
        try {
            setConsultandoNetrin(true);
            const response = await api.post("v1/integracao/netrin", {
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
            //console.log(error);
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
    console.log("consultas netrin", data);
    return (
        <Flex flexDir="column">
            <Text>Consultas Disponíveis</Text>
            <Grid gridTemplateColumns="repeat(6,1fr)" gap={2} overflow="auto">
                {consultasDisponiveis.map((consulta) => (
                    <Flex
                        key={consulta.codigo}
                        rounded="lg"
                        borderWidth={1}
                        p={2}
                        flexDir="column"
                        justify="space-between"
                    >
                        <Flex
                            flexDir="column"
                            gap={1}
                            align="center"
                            justify="center"
                            h="full"
                        >
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Logo_Receita_Federal_do_Brasil.svg/1200px-Logo_Receita_Federal_do_Brasil.svg.png"
                                w={8}
                                h={8}
                            />
                            <Flex align="center" h="full">
                                <Text
                                    fontSize="x-small"
                                    textAlign="center"
                                    fontWeight="bold"
                                >
                                    {consulta?.nome}
                                </Text>
                            </Flex>
                        </Flex>
                        <Button
                            leftIcon={<FiSearch />}
                            size="xs"
                            variant="outline"
                        >
                            Consultar Agora
                        </Button>
                        <Button
                            w="full"
                            variant="outline"
                            size="xs"
                            leftIcon={<Icon as={FiSearch} />}
                            onClick={() =>
                                consultarNetrin({
                                    tipoConsulta: consulta.codigo,
                                    requisicao: {
                                        cpf,
                                        cnpj,
                                    },
                                })
                            }
                            isLoading={consultandoNetrin}
                        >
                            Consultar
                        </Button>
                        {JSON.stringify(
                            data?.find(
                                (c) =>
                                    c.tipoConsulta == consulta.codigo &&
                                    c.requisicao.cpf == cpf
                            ).retorno
                        )}
                        {data?.find(
                            (c) =>
                                c.tipoConsulta == consulta.codigo &&
                                c.requisicao.cpf == cpf
                        )?.retorno?.processosCPF && (
                            <Tooltip label="Visualizar Arquivo">
                                <Button
                                    variant="outline"
                                    size="xs"
                                    leftIcon={<Icon as={FiEye} />}
                                    onClick={() =>
                                        preview.current.onOpen(
                                            process.env.NODE_ENV == "production"
                                                ? `https://www.imo7.com.br/api/v1/integracao/netrin/${
                                                      data?.find(
                                                          (ii) =>
                                                              ii.tipoConsulta ==
                                                                  "processos_pf" &&
                                                              ii.requisicao
                                                                  .cpf == cpf
                                                      ).id
                                                  }/pdf`
                                                : `http://localhost:3000/api/v1/integracao/netrin/${
                                                      data?.find(
                                                          (ii) =>
                                                              ii.tipoConsulta ==
                                                                  "processos_pf" &&
                                                              ii.requisicao
                                                                  .cpf == cpf
                                                      ).id
                                                  }/pdf`
                                        )
                                    }
                                >
                                    {data?.find(
                                        (ii) =>
                                            ii.tipoConsulta == "processos_pf" &&
                                            ii.requisicao.cpf == cpf
                                    )?.retorno?.processosCPF?.code
                                        ? "0"
                                        : data?.find(
                                              (ii) =>
                                                  ii.tipoConsulta ==
                                                      "processos_pf" &&
                                                  ii.requisicao.cpf == cpf
                                          )?.retorno?.processosCPF
                                              ?.totalProcessos}{" "}
                                    processos encontrados
                                </Button>
                            </Tooltip>
                        )}
                    </Flex>
                ))}
            </Grid>
            <ModalPreview ref={preview} />
        </Flex>
    );
};

const consultasDisponiveis = [
    {
        tipoConsulta: ["cpf"],
        codigo: "receita_federal_cpf",
        nome: "Situação Cadastral do CPF",
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "processos_pf",
        nome: "Processos Judiciais",
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "protestos_pf",
        nome: "Protestos",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "receita_federal_cnd",
        nome: "Certidão Negativa de Débitos Federais",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "sefaz_cnd",
        nome: "Certidão Negativa de Débitos Estaduais",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "cnd_trabalhista",
        nome: "Certidão Negativa de Débitos Trabalhistas",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "cnd_trabalhista_mte",
        nome: "Certidão Negativa de Débitos Trabalhistas do MTE",
    },
];
