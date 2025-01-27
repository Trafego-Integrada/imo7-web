import { formatoData } from "@/helpers/helpers";
import prisma from "@/lib/prisma";
import { formatarParaDataBR } from "@/utils/formatarParaDataBR";
import {
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
import "react-quill/dist/quill.snow.css";

const FichaCadastral = ({ consulta }: any) => {
    const totalProtestos = (protestos: any) => {
        let total = 0;
        if (protestos.code != 606) {
            Object.entries(protestos)?.map((i: any) => {
                if (i.length > 1) {
                    i[1].map((i: any) => {
                        total += i.protestos?.length;
                    });
                }
            });
        }
        return total;
    };

    return (
        <Flex minH="100vh" flexDir="column" gap={4}>
            <Flex align="center" py={0} gap={6}>
                <Box>
                    <Image
                        h={70}
                        src={consulta?.imobiliaria?.logo}
                        alt="Imobiliária"
                    />
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
                                (item: any, k: any) => (
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
                                                borderWidth={1}
                                                px={2}
                                                py={1}
                                            >
                                                <Text fontSize="xx-small">
                                                    Status
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="xs"
                                                >
                                                    {item?.status}
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
                                                        (
                                                            parte: any,
                                                            kp: any
                                                        ) => (
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
                                (item: any, k: any) => (
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
                                                        (
                                                            parte: any,
                                                            kp: any
                                                        ) => (
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
            {consulta.tipoConsulta == "protestos_pf" && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta de Protestos Pessoa Física
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna protestos de todos estados brasileiros
                            ligados ao documento informado na consulta
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
                                        Protestos encontrados
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {totalProtestos(
                                            consulta?.retorno?.cenprotProtestos
                                        )}
                                    </Text>
                                </GridItem>
                            </Grid>
                        </Flex>
                        <Grid gap={5}>
                            {consulta?.retorno?.cenprotProtestos?.code != 606 &&
                                Object.entries(
                                    consulta?.retorno?.cenprotProtestos
                                )?.map((item: any, k: any) => {
                                    return (
                                        <GridItem as={Grid} gap={4} key={k}>
                                            <Text>
                                                Protestos no estado:{" "}
                                                <strong>{item[0]}</strong>
                                            </Text>
                                            {item[1].map((i: any, k: any) => (
                                                <Grid
                                                    key={k}
                                                    mb={4}
                                                    gridTemplateColumns="repeat(4,1fr)"
                                                >
                                                    <GridItem
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Cidade
                                                        </Text>
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="xs"
                                                        >
                                                            {i?.cidade}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem
                                                        colSpan={3}
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Cartório
                                                        </Text>
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="xs"
                                                        >
                                                            {i?.cartorio}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem
                                                        colSpan={3}
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Endereço
                                                        </Text>
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="xs"
                                                        >
                                                            {i?.endereco}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Telefone
                                                        </Text>
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="xs"
                                                        >
                                                            {i?.telefone}
                                                        </Text>
                                                    </GridItem>

                                                    <GridItem
                                                        colSpan={4}
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Protestos
                                                        </Text>
                                                        <Table size="sm">
                                                            <Thead>
                                                                <Tr>
                                                                    <Th fontSize="xx-small">
                                                                        Documento
                                                                    </Th>
                                                                    <Th fontSize="xx-small">
                                                                        Data
                                                                    </Th>
                                                                    <Th fontSize="xx-small">
                                                                        Data do
                                                                        Protesto
                                                                    </Th>
                                                                    <Th fontSize="xx-small">
                                                                        Data de
                                                                        Vencimento
                                                                    </Th>
                                                                    <Th fontSize="xx-small">
                                                                        Valor
                                                                    </Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {i.protestos?.map(
                                                                    (
                                                                        protesto,
                                                                        key
                                                                    ) => (
                                                                        <Tr
                                                                            key={
                                                                                key
                                                                            }
                                                                        >
                                                                            <Td fontSize="xs">
                                                                                {
                                                                                    protesto.cpfCnpj
                                                                                }
                                                                            </Td>
                                                                            <Td fontSize="xs">
                                                                                {protesto.data &&
                                                                                    formatoData(
                                                                                        protesto.data
                                                                                    )}
                                                                            </Td>
                                                                            <Td fontSize="xs">
                                                                                {protesto.dataProtesto &&
                                                                                    formatoData(
                                                                                        protesto.dataProtesto
                                                                                    )}
                                                                            </Td>
                                                                            <Td fontSize="xs">
                                                                                {protesto.dataVencimento &&
                                                                                    formatoData(
                                                                                        protesto.dataVencimento
                                                                                    )}
                                                                            </Td>
                                                                            <Td fontSize="xs">
                                                                                {
                                                                                    protesto.valor
                                                                                }
                                                                            </Td>
                                                                        </Tr>
                                                                    )
                                                                )}
                                                            </Tbody>
                                                        </Table>
                                                    </GridItem>
                                                </Grid>
                                            ))}
                                        </GridItem>
                                    );
                                })}
                        </Grid>
                    </Flex>
                </>
            )}
            {consulta.tipoConsulta == "protestos_pj" && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta de Protestos Pessoa Jurídica
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna protestos de todos estados brasileiros
                            ligados ao documento informado na consulta
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
                                        Protestos encontrados
                                    </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {totalProtestos(
                                            consulta?.retorno?.cenprotProtestos
                                        )}
                                    </Text>
                                </GridItem>
                            </Grid>
                        </Flex>
                        <Grid gap={5}>
                            {consulta?.retorno?.cenprotProtestos?.code != 606 &&
                                Object.entries(
                                    consulta?.retorno?.cenprotProtestos
                                )?.map((item: any, k: any) => {
                                    return (
                                        <GridItem as={Grid} gap={4} key={k}>
                                            <Text>
                                                Protestos no estado:{" "}
                                                <strong>{item[0]}</strong>
                                            </Text>
                                            {item[1].map((i: any, k: any) => (
                                                <Grid
                                                    key={k}
                                                    mb={4}
                                                    gridTemplateColumns="repeat(4,1fr)"
                                                >
                                                    <GridItem
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Cidade
                                                        </Text>
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="xs"
                                                        >
                                                            {i?.cidade}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem
                                                        colSpan={3}
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Cartório
                                                        </Text>
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="xs"
                                                        >
                                                            {i?.cartorio}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem
                                                        colSpan={3}
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Endereço
                                                        </Text>
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="xs"
                                                        >
                                                            {i?.endereco}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Telefone
                                                        </Text>
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="xs"
                                                        >
                                                            {i?.telefone}
                                                        </Text>
                                                    </GridItem>

                                                    <GridItem
                                                        colSpan={4}
                                                        borderWidth={1}
                                                        px={2}
                                                        py={1}
                                                    >
                                                        <Text fontSize="xx-small">
                                                            Protestos
                                                        </Text>
                                                        <Table size="sm">
                                                            <Thead>
                                                                <Tr>
                                                                    <Th fontSize="xx-small">
                                                                        Documento
                                                                    </Th>
                                                                    <Th fontSize="xx-small">
                                                                        Data
                                                                    </Th>
                                                                    <Th fontSize="xx-small">
                                                                        Data do
                                                                        Protesto
                                                                    </Th>
                                                                    <Th fontSize="xx-small">
                                                                        Data de
                                                                        Vencimento
                                                                    </Th>
                                                                    <Th fontSize="xx-small">
                                                                        Valor
                                                                    </Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {i.protestos?.map(
                                                                    (
                                                                        protesto,
                                                                        key
                                                                    ) => (
                                                                        <Tr
                                                                            key={
                                                                                key
                                                                            }
                                                                        >
                                                                            <Td fontSize="xs">
                                                                                {
                                                                                    protesto.cpfCnpj
                                                                                }
                                                                            </Td>
                                                                            <Td fontSize="xs">
                                                                                {protesto.data &&
                                                                                    formatoData(
                                                                                        protesto.data
                                                                                    )}
                                                                            </Td>
                                                                            <Td fontSize="xs">
                                                                                {protesto.dataProtesto &&
                                                                                    formatoData(
                                                                                        protesto.dataProtesto
                                                                                    )}
                                                                            </Td>
                                                                            <Td fontSize="xs">
                                                                                {protesto.dataVencimento &&
                                                                                    formatoData(
                                                                                        protesto.dataVencimento
                                                                                    )}
                                                                            </Td>
                                                                            <Td fontSize="xs">
                                                                                {
                                                                                    protesto.valor
                                                                                }
                                                                            </Td>
                                                                        </Tr>
                                                                    )
                                                                )}
                                                            </Tbody>
                                                        </Table>
                                                    </GridItem>
                                                </Grid>
                                            ))}
                                        </GridItem>
                                    );
                                })}
                        </Grid>
                    </Flex>
                </>
            )}
            {consulta.tipoConsulta == "receita_federal_cpf" && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta de Cadastro de Pessoa Física
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna situação do cadastro de pessoa física
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
                        <GridItem>
                            <Text fontSize="xs">Situação:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {
                                    consulta.retorno?.CpfBirthdate
                                        ?.situacaoCadastral
                                }
                            </Text>
                        </GridItem>
                    </Grid>
                    <Grid gridTemplateColumns="repeat(4,1fr)">
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Nome:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta.retorno?.CpfBirthdate?.nome}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Idade:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta.retorno?.CpfBirthdate?.idade}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Data de Nascimento:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {formatarParaDataBR(consulta.retorno?.CpfBirthdate?.dataNascimento)}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Genero:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta.retorno?.CpfBirthdate?.genero}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Nome da Mãe:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta.retorno?.CpfBirthdate?.nomeMae}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Ano do Óbito:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta.retorno?.CpfBirthdate?.anoObito}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">País de Origem:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta.retorno?.CpfBirthdate?.paisOrigem}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Data de Inscrição:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta.retorno?.CpfBirthdate?.dataInscricao}
                            </Text>
                        </GridItem>
                    </Grid>
                </>
            )}
        </Flex>
    );
};

export default FichaCadastral;

export const getServerSideProps = async (ctx: any) => {
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
