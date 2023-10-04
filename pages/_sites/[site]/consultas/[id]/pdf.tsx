import { formatoData, formatoValor, nl2br } from "@/helpers/helpers";
import prisma from "@/lib/prisma";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Badge,
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    List,
    ListItem,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import QRCode from "react-qr-code";
import "react-quill/dist/quill.snow.css";
const FichaCadastral = ({ consulta }) => {
    console.log(consulta);
    return (
        <Flex minH="100vh" flexDir="column" gap={4}>
            <Flex align="center" py={0} gap={6}>
                <Box>
                    <Image h={70} src={consulta?.imobiliaria?.logo} />
                </Box>
                <Box>
                    <Text fontSize="sm">
                        <Text as="span" fontWeight="bold">
                            {consulta?.imobiliaria?.razaoSocial}
                        </Text>{" "}
                        • CNPJ: {consulta?.imobiliaria?.cnpj}
                    </Text>
                    <Text fontSize="xs">
                        {consulta?.imobiliaria?.endereco}, nº{" "}
                        {consulta?.imobiliaria?.numero},
                        {consulta?.imobiliaria?.bairro},
                        {consulta?.imobiliaria?.cidade}/
                        {consulta?.imobiliaria?.estado} - CEP:{" "}
                        {consulta?.imobiliaria?.cep}
                    </Text>
                    <Text fontSize="xs">
                        <Text as="span" fontWeight="bold">
                            Fixo:
                        </Text>{" "}
                        {consulta.imobiliaria.telefone} •{" "}
                        <Text as="span" fontWeight="bold">
                            E-mail:
                        </Text>{" "}
                        {consulta.imobiliaria.email} •{" "}
                        <Text as="span" fontWeight="bold">
                            Site:
                        </Text>{" "}
                        {consulta.imobiliaria.site}
                    </Text>
                </Box>
            </Flex>

            {consulta.tipoConsulta == "processos_pf" && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta de Processos Pessoa Física
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna processos cíveis e criminais em que o
                            documento consultado esteja citado
                        </Text>
                    </Box>
                    <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Data/Hora da Consulta:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {formatoData(consulta.createdAt, "DATA_HORA")}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xx-small">
                                Documento Consultado
                            </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.requisicao?.cpf}
                            </Text>
                        </GridItem>
                    </Grid>
                    <Flex gap={4} flexDir="column">
                        <Flex gap={4} flexDir="column">
                            <Heading size="md">Resultado</Heading>
                            <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xx-small">
                                        Processos encontrados
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {
                                            consulta?.retorno?.processosCPF
                                                ?.totalProcessos
                                        }
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xx-small">
                                        Processos como autor
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {
                                            consulta?.retorno?.processosCPF
                                                ?.totalProcessosAutor
                                        }
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xx-small">
                                        Processos como reu
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {
                                            consulta?.retorno?.processosCPF
                                                ?.totalProcessosReu
                                        }
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xx-small">
                                        Processos nos últimos 180 dias
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {
                                            consulta?.retorno?.processoJudicial
                                                ?.processosUltimos180dias
                                        }
                                    </Text>
                                </GridItem>
                            </Grid>
                        </Flex>
                        <Grid gap={5}>
                            {consulta?.retorno?.processosCPF?.processos?.map(
                                (item, k) => (
                                    <GridItem key={k}>
                                        <Grid
                                            mb={4}
                                            gridTemplateColumns="repeat(4,1fr)"
                                        >
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Tipo
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.tipo}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                colSpan={3}
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Assunto Principal
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.assuntoPrincipal}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Numero
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.numero}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Estado
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.estado}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Tribunal
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.tribunal}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Tipo de Tribunal
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.tribunalTipo}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                colSpan={2}
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Vara Julgadora
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.varaJulgadora}
                                                </Text>
                                            </GridItem>

                                            <GridItem
                                                colSpan={4}
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Partes
                                                </Text>
                                                <List>
                                                    {item.partes?.map(
                                                        (parte, kp) => (
                                                            <ListItem key={kp}>
                                                                <Text fontSize="xs">
                                                                    {
                                                                        parte?.nome
                                                                    }{" "}
                                                                    <Badge>
                                                                        {
                                                                            parte?.tipo
                                                                        }
                                                                    </Badge>
                                                                </Text>
                                                            </ListItem>
                                                        )
                                                    )}
                                                </List>
                                            </GridItem>
                                        </Grid>
                                    </GridItem>
                                )
                            )}
                        </Grid>
                    </Flex>
                </>
            )}
            {consulta.tipoConsulta == "processos_pj" && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta de Processos Pessoa Jurídica
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna processos judiciais em que o documento
                            consultado esteja citado.
                        </Text>
                    </Box>
                    <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Data/Hora da Consulta:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {formatoData(consulta.createdAt, "DATA_HORA")}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xx-small">
                                Documento Consultado
                            </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.requisicao?.cnpj}
                            </Text>
                        </GridItem>
                    </Grid>
                    <Flex gap={4} flexDir="column">
                        <Flex gap={4} flexDir="column">
                            <Heading size="md">Resultado</Heading>
                            <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xx-small">
                                        Processos encontrados
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {
                                            consulta?.retorno?.processoJudicial
                                                ?.totalProcessos
                                        }
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xx-small">
                                        Processos como autor
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {
                                            consulta?.retorno?.processoJudicial
                                                ?.totalProcessosAutor
                                        }
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xx-small">
                                        Processos como reu
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {
                                            consulta?.retorno?.processoJudicial
                                                ?.totalProcessosReu
                                        }
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xx-small">
                                        Processos nos últimos 180 dias
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {
                                            consulta?.retorno?.processoJudicial
                                                ?.processosUltimos180dias
                                        }
                                    </Text>
                                </GridItem>
                            </Grid>
                        </Flex>
                        <Grid gap={5}>
                            {consulta?.retorno?.processosCPF?.processos.map(
                                (item, k) => (
                                    <GridItem key={k}>
                                        <Grid
                                            mb={4}
                                            gridTemplateColumns="repeat(4,1fr)"
                                        >
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Tipo
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.tipo}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                colSpan={3}
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Assunto Principal
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.assuntoPrincipal}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Numero
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.numero}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Estado
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.estado}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Tribunal
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.tribunal}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Tipo de Tribunal
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.tribunalTipo}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                colSpan={2}
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Vara Julgadora
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.varaJulgadora}
                                                </Text>
                                            </GridItem>

                                            <GridItem
                                                colSpan={4}
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Partes
                                                </Text>
                                                <List>
                                                    {item.partes.map(
                                                        (parte, kp) => (
                                                            <ListItem key={kp}>
                                                                <Text fontSize="xs">
                                                                    {
                                                                        parte?.nome
                                                                    }{" "}
                                                                    <Badge>
                                                                        {
                                                                            parte?.tipo
                                                                        }
                                                                    </Badge>
                                                                </Text>
                                                            </ListItem>
                                                        )
                                                    )}
                                                </List>
                                            </GridItem>
                                        </Grid>
                                    </GridItem>
                                )
                            )}
                        </Grid>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export default FichaCadastral;

export const getServerSideProps = async (ctx) => {
    const { id } = ctx.query;
    let consulta = await prisma.consultaNetrin.findUnique({
        where: { id },
        include: {
            imobiliaria: true,
            processo: true,
            fichaCadastral: true,
        },
    });

    return {
        props: {
            consulta: JSON.parse(JSON.stringify(consulta)),
        },
    };
};
