import {
    Box,
    Button,
    Collapse,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    HStack,
    Heading,
    Icon,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Spinner,
    Stat,
    StatArrow,
    StatGroup,
    StatHelpText,
    StatLabel,
    StatNumber,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useRadio,
    useRadioGroup,
} from "@chakra-ui/react";
import { Chart } from "react-google-charts";

import React, { useRef, useState } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import {
    MdCheck,
    MdClose,
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
    MdPageview,
} from "react-icons/md";
import { FormDate } from "@/components/Form/FormDate";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { ModalContratos } from "@/components/Modals/contratos";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { BsCalendarWeek } from "react-icons/bs";
import { useQuery } from "react-query";
import { dadosDashboard } from "@/services/models/dashboard";
import { formatoData, formatoValor, statusTarefa } from "@/helpers/helpers";
import moment from "moment";
import Link from "next/link";
import dynamic from "next/dynamic";

const ColumnChart = dynamic(import("@/components/Charts/ColumnChart"), {
    ssr: false,
});
const Home = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [filtro, setFiltro] = useState({
        periodo: "semanal",
    });

    const { data, isLoading } = useQuery(["dashboard", filtro], dadosDashboard);

    const options = [
        {
            label: "Últimos 7 dias",
            value: "semanal",
        },
        {
            label: "Último mês",
            value: "mensal",
        },
        {
            label: "Último trimestre",
            value: "trimestral",
        },
        {
            label: "Último semestre",
            value: "semestral",
        },
        {
            label: "Último ano",
            value: "anual",
        },
        // {
        //     label: "Personalizado",
        //     value: "personalizado",
        // },
    ];

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "periodo",
        defaultValue: "semanal",
        onChange: (v) => {
            setFiltro({ ...filtro, periodo: v });
            onClose();
        },
    });

    const group = getRootProps();
    function RadioCard(props) {
        const { getInputProps, getRadioProps } = useRadio(props);

        const input = getInputProps();
        const checkbox = getRadioProps();

        return (
            <Box as="label">
                <input {...input} />
                <Box
                    {...checkbox}
                    cursor="pointer"
                    borderWidth="1px"
                    borderRadius="md"
                    boxShadow="sm"
                    _checked={{
                        bg: "blue.600",
                        color: "white",
                        borderColor: "blue.600",
                    }}
                    _focus={{
                        boxShadow: "outline",
                    }}
                    px={4}
                    py={1}
                    fontSize={12}
                >
                    {props.children}
                </Box>
            </Box>
        );
    }
    return (
        <>
            <Layout>
                <Container maxW="container.xl" p={5}>
                    {/* <Flex mb={4}>
                        <Popover placement="top-start" isOpen={isOpen}>
                            <PopoverTrigger>
                                <Button
                                    leftIcon={<BsCalendarWeek />}
                                    size="sm"
                                    variant="outline"
                                    colorScheme="blue"
                                    zIndex={20}
                                    onClick={onOpen}
                                >
                                    {
                                        options.find(
                                            (i) => i.value == filtro.periodo
                                        )?.label
                                    }
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                mt={-50}
                                ml={-3}
                                pt={50}
                                zIndex="10"
                            >
                                <PopoverBody>
                                    <Flex wrap="wrap" gap={2} {...group}>
                                        {options.map((item) => {
                                            const radio = getRadioProps({
                                                value: item.value,
                                            });
                                            return (
                                                <RadioCard
                                                    key={item.value}
                                                    {...radio}
                                                >
                                                    {item.label}
                                                </RadioCard>
                                            );
                                        })}
                                    </Flex>
                                </PopoverBody>
                                <PopoverFooter
                                    gap={2}
                                    display="flex"
                                    justifyContent="flex-end"
                                >
                                    <Button
                                        size="xs"
                                        variant="ghost"
                                        leftIcon={<MdClose />}
                                        colorScheme="gray"
                                        onClick={onClose}
                                    >
                                        Desistir
                                    </Button>
                                </PopoverFooter>
                            </PopoverContent>
                        </Popover>
                    </Flex> */}
                    <Grid
                        gap={4}
                        gridTemplateColumns={{
                            base: "repeat(1,1fr)",
                            lg: "repeat(4,1fr)",
                        }}
                    >
                        <GridItem colSpan={{ lg: 3 }}>
                            <Heading size="sm" color="gray" mb={2}>
                                Próximas Tarefas
                            </Heading>
                            <Box bg="white" p={4}>
                                <Table size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Tarefa</Th>
                                            <Th>Contrato</Th>
                                            <Th>Data</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data?.tarefas.length > 0 ? (
                                            data?.tarefas
                                                .slice(0, 5)
                                                .map((item) => (
                                                    <Tr
                                                        key={item.id}
                                                        fontSize="xs"
                                                    >
                                                        <Td fontSize="xs">
                                                            {item.titulo}
                                                        </Td>
                                                        <Td fontSize="xs">
                                                            {
                                                                item.contrato
                                                                    ?.codigo
                                                            }
                                                        </Td>
                                                        <Td fontSize="xs">
                                                            {formatoData(
                                                                item.dataVencimento
                                                            )}
                                                        </Td>
                                                        <Td fontSize="xs">
                                                            {statusTarefa(
                                                                item.status
                                                            )}
                                                        </Td>
                                                    </Tr>
                                                ))
                                        ) : (
                                            <Tr>
                                                <Td colSpan={4}>
                                                    Não há tarefas
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </Box>
                        </GridItem>
                        <GridItem colSpan={{ lg: 1 }}>
                            <Heading size="sm" color="gray" mb={2}>
                                Tarefas
                            </Heading>
                            <Flex flexDir="column" gap={2}>
                                <Box bg="white" p={4}>
                                    <Heading size="sm" textAlign="center">
                                        Em aberto
                                    </Heading>
                                    <Divider my={2} />
                                    <Text textAlign="center">
                                        {data?.tarefas?.reduce((a, i) => {
                                            if (
                                                moment(i.dataVencimento) <=
                                                moment()
                                            ) {
                                                return a + 1;
                                            } else {
                                                return a;
                                            }
                                        }, 0)}
                                    </Text>
                                </Box>
                                <Box bg="white" p={4}>
                                    <Heading size="sm" textAlign="center">
                                        Em atraso
                                    </Heading>
                                    <Divider my={2} />
                                    <Text textAlign="center" fontSize="xl">
                                        {data?.tarefas?.reduce((a, i) => {
                                            if (
                                                moment(i.dataVencimento) <
                                                moment()
                                            ) {
                                                return a + 1;
                                            } else {
                                                return a;
                                            }
                                        }, 0)}
                                    </Text>
                                </Box>
                            </Flex>
                        </GridItem>
                        <GridItem colSpan={{ lg: 2 }}>
                            <Box>
                                <Heading size="sm" color="gray" mb={2}>
                                    Processos
                                </Heading>
                                <Flex p={4} bg="white" h="full" align="center">
                                    <Chart
                                        chartType="PieChart"
                                        width={"200px"}
                                        data={[
                                            ["teste", "teste"],
                                            [
                                                "Em andamento",
                                                data?.processos?.processos?.filter(
                                                    (i) =>
                                                        i.status ==
                                                        "EM_ANDAMENTO"
                                                )?.length,
                                            ],
                                            [
                                                "Cancelado",
                                                data?.processos?.processos?.filter(
                                                    (i) =>
                                                        i.status == "CANCELADO"
                                                )?.length,
                                            ],
                                            [
                                                "Arquivado",
                                                data?.processos?.processos?.filter(
                                                    (i) =>
                                                        i.status == "ARQUIVADO"
                                                )?.length,
                                            ],
                                            [
                                                "Completo",
                                                data?.processos?.processos?.filter(
                                                    (i) =>
                                                        i.status == "COMPLETO"
                                                )?.length,
                                            ],
                                            [
                                                "Aprovados",
                                                data?.processos?.processos?.filter(
                                                    (i) =>
                                                        i.status == "APROVADO"
                                                )?.length,
                                            ],
                                            [
                                                "Reprovados",
                                                data?.processos?.processos?.filter(
                                                    (i) =>
                                                        i.status == "REPROVADO"
                                                )?.length,
                                            ],
                                        ]}
                                        options={{
                                            legend: "none",
                                            pieHole: 0.4,
                                            is3D: false,
                                            colors: [
                                                "orange",
                                                "yellow",
                                                "gray",
                                                "blue",
                                                "green",
                                                "red",
                                            ],
                                            width: 200,
                                            height: 200,
                                        }}
                                        style={{ padding: 0 }}
                                    />
                                    <Flex flexDir="column" gap={1}>
                                        <Link
                                            href={{
                                                pathname: "/admin/processos",
                                                query: {
                                                    status: "EM_ANDAMENTO",
                                                },
                                            }}
                                        >
                                            <Button
                                                size="xs"
                                                colorScheme="orange"
                                            >
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.processos?.processos?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "EM_ANDAMENTO"
                                                        )?.length
                                                    }
                                                </Text>
                                                Em andamento
                                            </Button>
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/processos",
                                                query: {
                                                    status: "CANCELADO",
                                                },
                                            }}
                                        >
                                            <Button
                                                size="xs"
                                                colorScheme="yellow"
                                            >
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.processos?.processos?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "CANCELADO"
                                                        )?.length
                                                    }
                                                </Text>
                                                Cancelados
                                            </Button>{" "}
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/fichas",
                                                query: {
                                                    status: "ARQUIVADO",
                                                },
                                            }}
                                        >
                                            <Button
                                                size="xs"
                                                colorScheme="gray"
                                            >
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.processos?.processos?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "ARQUIVADO"
                                                        )?.length
                                                    }
                                                </Text>
                                                Arquivados
                                            </Button>{" "}
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/processos",
                                                query: {
                                                    status: "COMPLETO",
                                                },
                                            }}
                                        >
                                            <Button
                                                size="xs"
                                                colorScheme="blue"
                                            >
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.processos?.processos?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "COMPLETO"
                                                        )?.length
                                                    }
                                                </Text>
                                                Completos
                                            </Button>{" "}
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/processos",
                                                query: {
                                                    status: "APROVADO",
                                                },
                                            }}
                                        >
                                            <Button
                                                size="xs"
                                                colorScheme="green"
                                            >
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.processos?.processos?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "APROVADO"
                                                        )?.length
                                                    }
                                                </Text>
                                                Aprovados
                                            </Button>{" "}
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/processos",
                                                query: {
                                                    status: "REPROVADO",
                                                },
                                            }}
                                        >
                                            <Button size="xs" colorScheme="red">
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.processos?.processos?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "REPROVADO"
                                                        )?.length
                                                    }
                                                </Text>
                                                Reprovados
                                            </Button>{" "}
                                        </Link>
                                    </Flex>
                                </Flex>
                            </Box>
                        </GridItem>
                        <GridItem colSpan={{ lg: 2 }}>
                            <Box>
                                <Heading size="sm" color="gray" mb={2}>
                                    Fichas Cadastrais
                                </Heading>
                                <Flex p={4} bg="white" h="full" align="center">
                                    <Chart
                                        chartType="PieChart"
                                        width={"200px"}
                                        data={[
                                            ["Aguardando", "teste"],
                                            [
                                                "Aguardando",
                                                data?.fichasCadastrais?.filter(
                                                    (i) =>
                                                        i.status == "aguardando"
                                                )?.length,
                                            ],
                                            [
                                                "Preenchidas",
                                                data?.fichasCadastrais?.filter(
                                                    (i) =>
                                                        i.status == "preenchida"
                                                )?.length,
                                            ],
                                            [
                                                "Em análise",
                                                data?.fichasCadastrais?.filter(
                                                    (i) =>
                                                        i.status == "em_analise"
                                                )?.length,
                                            ],
                                            [
                                                "Reprovadas",
                                                data?.fichasCadastrais?.filter(
                                                    (i) =>
                                                        i.status == "reprovada"
                                                )?.length,
                                            ],
                                            [
                                                "Aprovadas",
                                                data?.fichasCadastrais?.filter(
                                                    (i) =>
                                                        i.status == "aprovada"
                                                )?.length,
                                            ],
                                            [
                                                "Arquivadas",
                                                data?.fichasCadastrais?.filter(
                                                    (i) =>
                                                        i.status == "arquivada"
                                                )?.length,
                                            ],
                                        ]}
                                        options={{
                                            legend: "none",
                                            pieHole: 0.4,
                                            is3D: false,
                                            colors: [
                                                "orange",
                                                "yellow",
                                                "blue",
                                                "red",
                                                "green",
                                                "gray",
                                            ],
                                            width: 200,
                                            height: 200,
                                        }}
                                        style={{ padding: 0 }}
                                    />
                                    <Flex flexDir="column" gap={1}>
                                        <Link
                                            href={{
                                                pathname: "/admin/fichas",
                                                query: {
                                                    status: "aguardando",
                                                },
                                            }}
                                        >
                                            <Button
                                                size="xs"
                                                colorScheme="orange"
                                            >
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.fichasCadastrais?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "aguardando"
                                                        )?.length
                                                    }
                                                </Text>
                                                Aguardando
                                            </Button>
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/fichas",
                                                query: {
                                                    status: "preenchida",
                                                },
                                            }}
                                        >
                                            <Button
                                                size="xs"
                                                colorScheme="yellow"
                                            >
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.fichasCadastrais?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "preenchida"
                                                        )?.length
                                                    }
                                                </Text>
                                                Preenchidas
                                            </Button>{" "}
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/fichas",
                                                query: {
                                                    status: "em_analise",
                                                },
                                            }}
                                        >
                                            <Button
                                                size="xs"
                                                colorScheme="blue"
                                            >
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.fichasCadastrais?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "em_analise"
                                                        )?.length
                                                    }
                                                </Text>
                                                Em análise
                                            </Button>{" "}
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/fichas",
                                                query: {
                                                    status: "reprovada",
                                                },
                                            }}
                                        >
                                            <Button size="xs" colorScheme="red">
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.fichasCadastrais?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "reprovada"
                                                        )?.length
                                                    }
                                                </Text>
                                                Reprovadas
                                            </Button>{" "}
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/fichas",
                                                query: {
                                                    status: "aprovada",
                                                },
                                            }}
                                        >
                                            <Button
                                                size="xs"
                                                colorScheme="green"
                                            >
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.fichasCadastrais?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "aprovada"
                                                        )?.length
                                                    }
                                                </Text>
                                                Aprovadas
                                            </Button>{" "}
                                        </Link>
                                        <Link
                                            href={{
                                                pathname: "/admin/fichas",
                                                query: {
                                                    status: "arquivada",
                                                },
                                            }}
                                        >
                                            <Button size="xs">
                                                <Text
                                                    as="span"
                                                    mr={3}
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        data?.fichasCadastrais?.filter(
                                                            (i) =>
                                                                i.status ==
                                                                "arquivada"
                                                        )?.length
                                                    }
                                                </Text>
                                                Arquivadas
                                            </Button>{" "}
                                        </Link>
                                    </Flex>
                                </Flex>
                            </Box>
                        </GridItem>
                        <GridItem colSpan={{ lg: 4 }} bg="white" p={4}>
                            <Box>
                                <Heading
                                    size="sm"
                                    color="gray"
                                    mb={2}
                                    lineHeight={1}
                                >
                                    Comparativo de Processos
                                </Heading>
                                <Text fontSize="xs" color="gray" lineHeight={1}>
                                    Este mês x Mês passado
                                </Text>
                            </Box>
                            {data?.processos?.grafico && (
                                <ColumnChart data={data?.processos?.grafico} />
                            )}
                        </GridItem>
                        <GridItem colSpan={{ lg: 2 }}>
                            <Heading size="sm" color="gray" mb={2}>
                                Contratos
                            </Heading>
                            <StatGroup gap={2}>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Contratos à reajustar</StatLabel>
                                    <StatNumber>
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            data?.contratosReajuste
                                        )}
                                    </StatNumber>
                                    <StatHelpText fontSize="xs">
                                        Nos próximos 30 dias
                                    </StatHelpText>
                                </Stat>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Contratos Iniciados</StatLabel>
                                    <StatNumber>
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            data?.contratosInicio
                                        )}
                                    </StatNumber>
                                    <StatHelpText fontSize="xs">
                                        Nos últimos 30 dias
                                    </StatHelpText>
                                </Stat>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Contratos à finalizar</StatLabel>
                                    <StatNumber>
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            data?.contratosFim
                                        )}
                                    </StatNumber>
                                    <StatHelpText fontSize="xs">
                                        Nos próximos 30 dias
                                    </StatHelpText>
                                </Stat>
                            </StatGroup>
                        </GridItem>
                        <GridItem colSpan={{ lg: 2 }}>
                            <Heading size="sm" color="gray" mb={2}>
                                Boletos
                            </Heading>
                            <StatGroup gap={2}>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Boletos cadastrados</StatLabel>
                                    <StatNumber>
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            data?.boletos?.length
                                        )}
                                    </StatNumber>
                                    {/* <StatHelpText>
                                        <StatArrow type="decrease" />
                                        9.05%
                                    </StatHelpText> */}
                                </Stat>
                                <Stat bg="white" p={4}>
                                    <StatLabel>E-mails enviados</StatLabel>
                                    <StatNumber>
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            data?.emailBoletoEnviados
                                        )}
                                    </StatNumber>
                                    {/* <StatHelpText>
                                        <StatArrow type="increase" />
                                        23.36%
                                    </StatHelpText> */}
                                </Stat>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Whatsapps enviados</StatLabel>
                                    <StatNumber>
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            data?.whatsappBoletoEnviados
                                        )}
                                    </StatNumber>
                                    {/* <StatHelpText>
                                        <StatArrow type="decrease" />
                                        9.05%
                                    </StatHelpText> */}
                                </Stat>
                            </StatGroup>
                        </GridItem>
                        <GridItem colSpan={{ lg: 2 }}>
                            <Heading size="sm" color="gray" mb={2}>
                                Extratos
                            </Heading>
                            <StatGroup gap={2}>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Extratos cadastrados</StatLabel>
                                    <StatNumber>
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            data?.extratos?.length
                                        )}
                                    </StatNumber>
                                    {/* <StatHelpText>
                                        <StatArrow type="decrease" />
                                        9.05%
                                    </StatHelpText> */}
                                </Stat>
                                <Stat bg="white" p={4}>
                                    <StatLabel>E-mails enviados</StatLabel>
                                    <StatNumber>
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            data?.emailExtratoEnviados
                                        )}
                                    </StatNumber>
                                    {/* <StatHelpText>
                                        <StatArrow type="increase" />
                                        23.36%
                                    </StatHelpText> */}
                                </Stat>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Whatsapps enviados</StatLabel>
                                    <StatNumber>
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            data?.whatsappExtratoEnviados
                                        )}
                                    </StatNumber>
                                    {/* <StatHelpText>
                                        <StatArrow type="decrease" />
                                        9.05%
                                    </StatHelpText> */}
                                </Stat>
                            </StatGroup>
                        </GridItem>
                    </Grid>
                </Container>
            </Layout>
        </>
    );
};
export default Home;

export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    {
        cargos: ["imobiliaria", "adm", "conta"],
    }
);
