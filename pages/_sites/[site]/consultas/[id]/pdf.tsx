import { EnumTipoDeRelacionamento } from "@/components/Modals/ModalRevisaoFichaCadastral2/EmpresaRelacionada";
import { ISancoes, PessoaPoliticamenteExposta } from "@/components/Modals/ModalRevisaoFichaCadastral2/KYCCompliance/PessoaPoliticamenteExposta";
import { Sancoes } from "@/components/Modals/ModalRevisaoFichaCadastral2/KYCCompliance/Sancoes";
import { formatoData } from "@/helpers/helpers";
import prisma from "@/lib/prisma";
import {
    Badge,
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    Link,
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
            {consulta.tipoConsulta == 'endereco_cpf' && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta de Endereços
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna endereços
                        </Text>
                    </Box>
                    {
                        consulta.retorno?.enderecoCPF?.endereco?.map((endereco, index) => (
                            <>
                                <Grid key={index} mb={4} gridTemplateColumns="repeat(4,1fr)">
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Rua:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.logradouro}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Número:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.numero}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Bairro:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.bairro}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Complemento:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.complemento}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">CEP:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.cep}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Cidade:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.cidade}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">UF:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.uf}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">País:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.pais}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Tipo:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.tipo}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Prioridade:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.prioridade}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Vínculo Recente:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.logradouro}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Latitude:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.latitude}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Longitude:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {endereco?.longitude}
                                        </Text>
                                    </GridItem>
                                </Grid>
                                <Flex
                                    marginTop={4}
                                    border="2px"
                                    borderColor="blue.500"
                                    borderStyle="solid"
                                    borderRadius={4}
                                >
                                    <iframe
                                        src={`https://www.google.com/maps?q=${endereco?.latitude},${endereco?.longitude}&hl=es;z=14&output=embed`}
                                        width="100%"
                                        height="500"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </Flex>

                            </>
                        ))
                    }
                </>
            )}
            {consulta.tipoConsulta == 'empresas_relacionadas_cpf' && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta de Empresas Relacionadas
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna Empresas Relacionadas ao CPF
                        </Text>
                    </Box>
                    {
                        consulta?.retorno?.empresasRelacionadasCPF?.negociosRelacionados?.map((empresasRelacionadas, index) => (
                            <Grid key={index} mb={4} gridTemplateColumns="repeat(4,1fr)">
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Documento:</Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {empresasRelacionadas?.entidadeRelacionadaDocumento}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Tipo Documento:</Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {empresasRelacionadas?.entidadeRelacionadadaTipoDeDocumento}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">País:</Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {empresasRelacionadas?.entidadeRelacionadaPais}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Nome:</Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {empresasRelacionadas?.entidadeRelacionadaNome}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Tipo de Relacionamento:</Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {EnumTipoDeRelacionamento[empresasRelacionadas?.tipoDeRelacionamento as keyof typeof EnumTipoDeRelacionamento]}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Nível de Relacionamento:</Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {empresasRelacionadas?.nivelDeRelacionamento}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Data Início Relacionamento:</Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {formatoData(empresasRelacionadas?.dataInicioRelacionamento)}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Data Fim Relacionamento:</Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {formatoData(empresasRelacionadas?.dataFimRelacionamento)}
                                    </Text>
                                </GridItem>
                            </Grid>
                        ))
                    }
                </>
            )}
            {consulta.tipoConsulta == 'pessoas_relacionadas_cnpj' && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta de Pessoas Relacionadas
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna Pessoas Relacionadas
                        </Text>
                    </Box>
                    {consulta?.retorno?.pessoasRelacionadasCNPJ?.entidadesRelacionadas?.map((pessoasRelacionadas, index) => (
                        <Grid key={index} mb={4} gridTemplateColumns="repeat(4,1fr)">
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">Documento:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {pessoasRelacionadas?.entidadeRelacionadaDocumento}
                                </Text>
                            </GridItem>
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">Tipo Documento:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {pessoasRelacionadas?.entidadeRelacionadadaTipoDeDocumento}
                                </Text>
                            </GridItem>
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">País:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {pessoasRelacionadas?.entidadeRelacionadaPais}
                                </Text>
                            </GridItem>
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">Nome:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {pessoasRelacionadas?.entidadeRelacionadaNome}
                                </Text>
                            </GridItem>
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">Tipo de Relacionamento:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {EnumTipoDeRelacionamento[pessoasRelacionadas?.tipoDeRelacionamento as keyof typeof EnumTipoDeRelacionamento]}
                                </Text>
                            </GridItem>
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">Vínculo do Relacionamento:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {pessoasRelacionadas?.vinculoDoRelacionamento}
                                </Text>
                            </GridItem>
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">Nível de Relacionamento:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {pessoasRelacionadas?.nivelDeRelacionamento}
                                </Text>
                            </GridItem>
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">Origem Relacionamento:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {pessoasRelacionadas?.origemRelacionamento}
                                </Text>
                            </GridItem>
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">Data Início Relacionamento:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {formatoData(pessoasRelacionadas?.dataInicioRelacionamento)}
                                </Text>
                            </GridItem>
                            <GridItem borderWidth={1} px={2} py={1}>
                                <Text fontSize="xs">Data Fim Relacionamento:</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                    {formatoData(pessoasRelacionadas?.dataFimRelacionamento)}
                                </Text>
                            </GridItem>
                        </Grid>
                    ))}
                </>
            )}
            {consulta.tipoConsulta == 'pep_kyc_cpf' && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta KYC e Compliance
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna KYC e Compliance
                        </Text>
                    </Box>
                    <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Sanções Ativas:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.pepKyc?.currentlySanctioned}
                            </Text>
                        </GridItem>
                        {
                            consulta?.retorno?.pepKyc?.currentlySanctioned !== 'Não' && (
                                <>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Sanções encontradas nos últimos 30 dias:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {consulta?.retorno?.pepKyc?.last30DaysSanctions}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Sanções encontradas nos últimos 90 dias:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {consulta?.retorno?.pepKyc?.last90DaysSanctions}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Sanções encontradas nos últimos 180 dias:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {consulta?.retorno?.pepKyc?.last180DaysSanctions}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Sanções encontradas nos últimos 365 dias:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {consulta?.retorno?.pepKyc?.last365DaysSanctions}
                                        </Text>
                                    </GridItem>
                                </>
                            )
                        }
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Pessoas expostas politicamente (PEP) ou possui algum vínculo com alguma PEP:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.pepKyc?.currentlyPEP}
                            </Text>
                        </GridItem>
                        {
                            consulta?.retorno?.pepKyc?.currentlyPEP !== 'Não' && (
                                <>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Exposto politicamente no último ano:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {consulta?.retorno?.pepKyc?.lastYearOccurencePEP}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Exposto politicamente nos últimos 3 anos:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {consulta?.retorno?.pepKyc?.last3YearsOccurencePEP}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Exposto politicamente nos últimos 5 anos:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {consulta?.retorno?.pepKyc?.last5YearsOccurencePEP}
                                        </Text>
                                    </GridItem>
                                    <GridItem borderWidth={1} px={2} py={1}>
                                        <Text fontSize="xs">Exposto politicamente:</Text>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {consulta?.retorno?.pepKyc?.last5PlusYearsOccurencePEP}
                                        </Text>
                                    </GridItem>
                                </>
                            )
                        }
                        {
                            consulta?.retorno?.pepKyc.currentlyPEP !== 'Não' && (
                                <>
                                    {consulta?.retorno?.pepKyc?.historyPEP?.map(
                                        (pessoaPoliticamenteExposta, index) => (
                                            <PessoaPoliticamenteExposta
                                                key={index}
                                                data={
                                                    pessoaPoliticamenteExposta
                                                }
                                            />
                                        )
                                    )}
                                </>
                            )
                        }

                        {
                            consulta?.retorno?.pepKyc.currentlySanctioned !== 'Não' && (
                                <>
                                    {consulta?.retorno?.pepKyc?.sanctionsHistory?.map(
                                        (sancoes, index) => (
                                            <Sancoes
                                                key={index}
                                                data={sancoes as ISancoes}
                                            />
                                        )
                                    )}
                                </>

                            )
                        }
                    </Grid>
                </>
            )}
            {consulta.tipoConsulta == 'receita_federal_cnd_cpf' && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta CND Federal CPF
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna CND Federal CPF
                        </Text>
                    </Box>
                    <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">CPF: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.cpf}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Código: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.code}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Mensagem: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.message}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Código da Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.codigoCertidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.certidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Débitos Pendentes PGFN: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.debitosPendentesPGFN}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Débitos Pendentes PFB: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.debitosPendentesRFB}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Validade Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.validadeCertidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">URL Comprovante: </Text>
                            <Link href={consulta?.retorno?.receitaFederalCND?.urlComprovante} fontWeight="bold" fontSize="sm" textColor='blue'>
                                Clique para baixar o comprovante
                            </Link>
                        </GridItem>
                    </Grid>
                </>
            )}
            {consulta.tipoConsulta == 'receita_federal_cnd_cnpj' && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta CND Federal CNPJ
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna CND Federal CNPJ
                        </Text>
                    </Box>
                    <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">CPF: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.cnpj}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Código: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.code}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Mensagem: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.message}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Código da Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.codigoCertidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.certidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Débitos Pendentes PGFN: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.debitosPendentesPGFN}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Débitos Pendentes PFB: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.debitosPendentesRFB}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Validade Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalCND?.validadeCertidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">URL Comprovante: </Text>
                            <Link href={consulta?.retorno?.receitaFederalCND?.urlComprovante} fontWeight="bold" fontSize="sm" textColor='blue'>
                                Clique para baixar o comprovante
                            </Link>
                        </GridItem>
                    </Grid>
                </>
            )}
            {consulta.tipoConsulta == 'cnd_trabalhista_cpf' && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta CND Trabalhista TST
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna CND Trabalhista TST
                        </Text>
                    </Box>
                    <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">CPF: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.cpf}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Nome: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.nome}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.certidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Mensagem: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.mensagem}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Emitiu Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.emitiuCertidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Data da Emissão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.emissaoData}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Validade: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.validade}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">URL Comprovante: </Text>
                            <Link href={consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.urlComprovante} fontWeight="bold" fontSize="sm" textColor='blue' textDecoration='underline'>
                                Clique para baixar o comprovante
                            </Link>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Processos Encontrados: </Text>
                            {
                                consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.processos_encontrados?.map((processo, index) => (
                                    <Text key={index} fontWeight="bold" fontSize="sm">
                                        {processo}
                                    </Text>
                                ))
                            }
                        </GridItem>
                    </Grid>

                </>
            )}
            {consulta.tipoConsulta == 'cnd_trabalhista_cnpj' && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta CND Trabalhista TST
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna CND Trabalhista TST
                        </Text>
                    </Box>
                    <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">CNPJ: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.cnpj}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Nome: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.nome}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.certidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Mensagem: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.mensagem}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Emitiu Certidão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.emitiuCertidao}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Data da Emissão: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.emissaoData}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Validade: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.validade}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">URL Comprovante: </Text>
                            <Link href={consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.urlComprovante} fontWeight="bold" fontSize="sm" textColor='blue' textDecoration='underline'>
                                Clique para baixar o comprovante
                            </Link>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">Processos Encontrados: </Text>
                            {
                                consulta?.retorno?.tribunalSuperiorTrabalhoCNDT?.processos_encontrados?.map((processo, index) => (
                                    <Text key={index} fontWeight="bold" fontSize="sm">
                                        {processo}
                                    </Text>
                                ))
                            }
                        </GridItem>
                    </Grid>

                </>
            )}
            {consulta.tipoConsulta == 'receita_federal_cnpj_qsa' && (
                <>
                    <Box py={4}>
                        <Heading
                            size="md"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            Consulta Receita Federal CNPJ QSA
                        </Heading>
                        <Text textAlign="center" fontSize="xs" color="gray">
                            Retorna Receita Federal CNPJ QSA
                        </Text>
                    </Box>
                    <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">CPF: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.cpf}
                            </Text>
                        </GridItem>
                        <GridItem borderWidth={1} px={2} py={1}>
                            <Text fontSize="xs">URL Comprovante: </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {consulta?.retorno?.receitaFederalQsa?.urlComprovante}
                            </Text>
                        </GridItem>
                    </Grid>
                    {
                        consulta?.retorno?.receitaFederalQsa?.qsa?.map((qsa, index) => (
                            <Grid key={index} mb={4} gridTemplateColumns="repeat(4,1fr)">
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Nome: </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {qsa?.nome}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Qualificação: </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {qsa?.qualificacao}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Nome Representante Legal: </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {qsa?.nomeRepresentanteLegal}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">Qualificação Representante Legal: </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {qsa?.qualificacaoRepresentanteLegal}
                                    </Text>
                                </GridItem>
                                <GridItem borderWidth={1} px={2} py={1}>
                                    <Text fontSize="xs">País de Origem: </Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                        {qsa?.paisOrigem}
                                    </Text>
                                </GridItem>
                            </Grid>
                        ))
                    }
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
