import { formatoData, formatoValor, nl2br } from "@/helpers/helpers";
import prisma from "@/lib/prisma";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
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
const FichaCadastral = ({
    ficha,
    campos,
    modelo,
    historicos,
    historicosProcesso,
    processo,
}) => {
    const renderTable = (items) => {
        const rows = [];
        let currentRow = [];
        let currentRowColSpan = 0;

        items
            .filter(
                (i) =>
                    modelo.campos[i.codigo] && modelo?.campos[i.codigo]?.exibir
            )
            .forEach((campo) => {
                const colSpan =
                    campo.tipoCampo === "file"
                        ? 1
                        : campo.colSpan
                        ? campo.colSpan
                        : 1;

                if (currentRowColSpan + colSpan <= 5) {
                    currentRow.push(
                        <Td
                            key={campo.id}
                            colSpan={colSpan}
                            py={1}
                            px={2}
                            borderColor="black"
                            borderWidth={1}
                        >
                            <Text fontWeight="bold" fontSize="xx-small">
                                {campo.nome}
                            </Text>
                            {campo.tipoCampo === "date" ? (
                                <Text fontSize="xs">
                                    {moment(
                                        ficha.preenchimento[campo.codigo]
                                    ).format("DD/MM/YYYY")}
                                </Text>
                            ) : campo.tipoCampo === "image" ? (
                                ficha.preenchimento[campo.codigo] ? (
                                    <Flex flexDirection="column">
                                        <Image
                                            w={32}
                                            h={44}
                                            src={
                                                ficha.preenchimento[
                                                    campo.codigo
                                                ]
                                            }
                                            objectFit="cover"
                                            objectPosition="center"
                                        />
                                        <Text fontSize="xs" mt={2}>
                                            ou{" "}
                                            <Link
                                                href={
                                                    ficha.preenchimento[
                                                        campo.codigo
                                                    ]
                                                }
                                            >
                                                clique aqui
                                            </Link>
                                        </Text>
                                    </Flex>
                                ) : null
                            ) : campo.tipoCampo === "qrcode" ? (
                                ficha.preenchimento[campo.codigo] ? (
                                    <Flex flexDirection="column">
                                        <QRCode
                                            size={75}
                                            value={
                                                ficha.preenchimento[
                                                    campo.codigo
                                                ]
                                            }
                                        />
                                        <Text fontSize="xs" mt={2}>
                                            Leia o QRCode ou{" "}
                                            <Link
                                                href={
                                                    ficha.preenchimento[
                                                        campo.codigo
                                                    ]
                                                }
                                            >
                                                clique aqui
                                            </Link>
                                        </Text>
                                    </Flex>
                                ) : null
                            ) : campo.tipoCampo === "file" ? (
                                ficha.preenchimento[campo.codigo] ? (
                                    <Flex flexDirection="column">
                                        <QRCode
                                            size={75}
                                            value={
                                                ficha.preenchimento[
                                                    campo.codigo
                                                ]
                                            }
                                        />
                                        <Text fontSize="xs" mt={2}>
                                            Leia o QRCode ou{" "}
                                            <Link
                                                href={
                                                    ficha.preenchimento[
                                                        campo.codigo
                                                    ]
                                                }
                                            >
                                                clique aqui
                                            </Link>
                                        </Text>
                                    </Flex>
                                ) : null
                            ) : (
                                <Text fontSize="xs">
                                    {ficha.preenchimento[campo.codigo]}
                                </Text>
                            )}
                        </Td>
                    );
                    currentRowColSpan += colSpan;
                } else {
                    rows.push(<Tr key={currentRow.length}>{currentRow}</Tr>);
                    currentRow = [
                        <Td
                            key={campo.id}
                            colSpan={colSpan}
                            p={2}
                            borderColor="black"
                        >
                            <Text fontWeight="bold" fontSize="xx-small">
                                {campo.nome}
                            </Text>
                            {campo.tipoCampo === "date" ? (
                                <Text fontSize="xs">
                                    {moment(
                                        ficha.preenchimento[campo.codigo]
                                    ).format("DD/MM/YYYY")}
                                </Text>
                            ) : campo.tipoCampo === "file" ? (
                                ficha.preenchimento[campo.codigo] ? (
                                    <Flex flexDirection="column">
                                        <QRCode
                                            size={75}
                                            value={
                                                ficha.preenchimento[
                                                    campo.codigo
                                                ]
                                            }
                                        />
                                        <Text fontSize="xs" mt={2}>
                                            Leia o QRCode ou{" "}
                                            <Link
                                                href={
                                                    ficha.preenchimento[
                                                        campo.codigo
                                                    ]
                                                }
                                            >
                                                clique aqui
                                            </Link>
                                        </Text>
                                    </Flex>
                                ) : null
                            ) : (
                                <Text fontSize="xs">
                                    {ficha.preenchimento[campo.codigo]}
                                </Text>
                            )}
                        </Td>,
                    ];
                    currentRowColSpan = colSpan;
                }
            });

        if (currentRow.length > 0) {
            rows.push(<Tr key={currentRow.length}>{currentRow}</Tr>);
        }

        return (
            <Table variant="simple" borderWidth={1} borderColor="black">
                <Tbody>{rows}</Tbody>
            </Table>
        );
    };
    console.log(ficha);
    return (
        <Flex minH="100vh" flexDir="column" gap={4}>
            <Flex align="center" py={0} gap={6}>
                <Box>
                    <Image h={70} src={ficha?.imobiliaria?.logo} />
                </Box>
                <Box>
                    <Text fontSize="sm">
                        <Text as="span" fontWeight="bold">
                            {ficha?.imobiliaria?.razaoSocial}
                        </Text>{" "}
                        • CNPJ: {ficha?.imobiliaria?.cnpj}
                    </Text>
                    <Text fontSize="xs">
                        {ficha?.imobiliaria?.endereco},
                        {ficha?.imobiliaria?.bairro},
                        {ficha?.imobiliaria?.cidade}/
                        {ficha?.imobiliaria?.estado} - CEP:{" "}
                        {ficha?.imobiliaria?.cep}
                    </Text>
                    <Text fontSize="xs">
                        <Text as="span" fontWeight="bold">
                            Fixo:
                        </Text>{" "}
                        {ficha.imobiliaria.telefone} •{" "}
                        <Text as="span" fontWeight="bold">
                            E-mail:
                        </Text>{" "}
                        {ficha.imobiliaria.email} •{" "}
                        <Text as="span" fontWeight="bold">
                            Site:
                        </Text>{" "}
                        {ficha.imobiliaria.site}
                    </Text>
                </Box>
            </Flex>
            <Box py={4}>
                <Heading size="md" textAlign="center">
                    {modelo.nome}
                </Heading>
                <Text textAlign="center" fontSize="sm" color="gray">
                    {modelo.descricao}
                </Text>
                {ficha.status == "aprovada" && (
                    <Alert status="success" my={2}>
                        <AlertIcon />
                        <AlertTitle>Ficha Aprovada</AlertTitle>
                    </Alert>
                )}
                {ficha.status == "reprovada" && (
                    <Alert status="error" my={2}>
                        <AlertIcon />
                        <AlertTitle>Ficha reprovada</AlertTitle>
                        <AlertDescription>
                            {ficha.motivoReprovacao}
                        </AlertDescription>
                    </Alert>
                )}
            </Box>
            <Grid mb={4} gridTemplateColumns="repeat(4,1fr)">
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="xx-small">Nº Processo:</Text>
                    <Text fontWeight="bold" fontSize="sm">
                        {" "}
                        {ficha.Processo?.codigo}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="xs">Responsável:</Text>
                    <Text fontWeight="bold" fontSize="sm">
                        {ficha.responsavel?.nome}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="xs">Tipo Garantia:</Text>
                    <Text fontWeight="bold" fontSize="sm">
                        {ficha.Processo?.tipoGarantia}
                    </Text>
                </GridItem>
                <GridItem colSpan={4} borderWidth={1} px={2} py={1}>
                    {ficha.imovel ? (
                        <Box bg="white">
                            <Text fontSize="xs">Imóvel:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {ficha.imovel?.codigo} -{" "}
                                {ficha.imovel?.endereco}, {ficha.imovel?.bairro}
                                , {ficha.imovel?.cidade}/{ficha.imovel?.estado}
                            </Text>
                        </Box>
                    ) : ficha.codigoImovel ? (
                        <Box bg="white">
                            <Text fontSize="xs">Imóvel:</Text>
                            <Text fontWeight="bold" fontSize="sm">
                                {ficha?.codigoImovel} - {ficha?.enderecoImovel}{" "}
                                nº {ficha?.numeroImovel}{" "}
                                {ficha?.complementoImovel &&
                                    `(${ficha.complementoImovel})`}
                                , {ficha?.bairroImovel}, {ficha?.cidadeImovel}/
                                {ficha?.estadoImovel}
                            </Text>
                        </Box>
                    ) : (
                        ""
                    )}
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="xs">Valor Negociado:</Text>
                    <Text fontWeight="bold" fontSize="sm">
                        {ficha.Processo?.campos.find((c) =>
                            Object.entries(c).find((i) => i[0] == "valor")
                        )?.valor &&
                            formatoValor(
                                ficha.Processo?.campos
                                    .find((c) =>
                                        Object.entries(c).find(
                                            (i) => i[0] == "valor"
                                        )
                                    )
                                    ?.valor.replace(",", ".")
                            )}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="xs">Valor Condominio:</Text>
                    <Text fontWeight="bold" fontSize="sm">
                        {ficha.imovel?.valorCondominio &&
                            formatoValor(ficha.imovel?.valorCondominio)}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="xs">Valor IPTU:</Text>
                    <Text fontWeight="bold" fontSize="sm">
                        {ficha.imovel?.valorIPTU &&
                            formatoValor(ficha.imovel?.valorIPTU)}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="xs">Valor Seguro:</Text>
                    <Text fontWeight="bold" fontSize="sm">
                        {ficha.imovel?.valorSeguro &&
                            formatoValor(ficha.imovel?.valorSeguro)}
                    </Text>
                </GridItem>
                <GridItem colSpan={4} borderWidth={1} px={2} py={1}>
                    <Text fontSize="xs">Observações:</Text>
                    <Box
                        fontWeight="bold"
                        fontSize="sm"
                        dangerouslySetInnerHTML={{
                            __html: nl2br(ficha?.Processo?.observacoes),
                        }}
                    ></Box>
                </GridItem>
            </Grid>
            <Grid gap={5}>
                {campos
                    .filter((i) =>
                        i.campos.find((e) => modelo?.campos[e.codigo]?.exibir)
                    )
                    .map((item) => (
                        <Box key={item.id}>
                            <Box>
                                <Heading size="sm" mb={3}>
                                    {item.nome}
                                </Heading>
                            </Box>
                            <>{renderTable(item.campos)}</>
                            {/* <Grid
                                gridTemplateColumns={{
                                    base: "repeat(5,1fr)",
                                    lg: "repeat(5,1fr)",
                                }}
                            >
                                {item.campos
                                    .filter(
                                        (i) =>
                                            modelo.campos[i.codigo] &&
                                            modelo?.campos[i.codigo]?.exibir
                                    )
                                    .map((campo) => (
                                        <GridItem
                                            key={campo.id}
                                            colSpan={{
                                                base:
                                                    campo.tipoCampo == "file"
                                                        ? 1
                                                        : campo.colSpan,
                                            }}
                                        >
                                            <Text
                                                fontWeight="bold"
                                                fontSize="xx-small"
                                            >
                                                {campo.nome}
                                            </Text>

                                            {campo.tipoCampo == "date" ? (
                                                <Text fontSize="xs">
                                                    {moment(
                                                        ficha.preenchimento[
                                                            campo.codigo
                                                        ]
                                                    ).format("DD/MM/YYYY")}
                                                </Text>
                                            ) : campo.tipoCampo == "file" ? (
                                                ficha.preenchimento[
                                                    campo.codigo
                                                ] ? (
                                                    <Flex flexDir="column">
                                                        <QRCode
                                                            size={75}
                                                            value={
                                                                ficha
                                                                    .preenchimento[
                                                                    campo.codigo
                                                                ]
                                                            }
                                                        />

                                                        <Text
                                                            fontSize="xs"
                                                            mt={2}
                                                        >
                                                            Leia o QRCode ou{" "}
                                                            <Link
                                                                href={
                                                                    ficha
                                                                        .preenchimento[
                                                                        campo
                                                                            .codigo
                                                                    ]
                                                                }
                                                            >
                                                                clique aqui
                                                            </Link>
                                                        </Text>
                                                    </Flex>
                                                ) : null
                                            ) : (
                                                <Text fontSize="xs">
                                                    {
                                                        ficha.preenchimento[
                                                            campo.codigo
                                                        ]
                                                    }
                                                </Text>
                                            )}
                                        </GridItem>
                                    ))}
                            </Grid> */}
                        </Box>
                    ))}
            </Grid>
            <Box colSpan={{ base: 1, lg: 5 }} py={2} bg="white" mt={4}>
                <Box
                    fontSize={"xs"}
                    dangerouslySetInnerHTML={{
                        __html: modelo.instrucoes,
                    }}
                />
            </Box>
            <Box>
                <Heading size="sm" mb={3}>
                    Anexos da Ficha
                </Heading>
                <Flex gap={4}>
                    {ficha?.Anexo.map((i) => (
                        <Flex key={i.id} flexDir="column" gap={2}>
                            <Text>{i.nome}</Text>
                            <QRCode size={75} value={i.anexo} />

                            <Text fontSize="xs">
                                Leia o QRCode
                                <br />
                                <Link href={i.anexo}>ou clique aqui</Link>
                            </Text>
                        </Flex>
                    ))}
                </Flex>
            </Box>
            {processo && (
                <Box>
                    <Heading size="sm" mb={3}>
                        Anexos do Processo
                    </Heading>
                    <Flex gap={4}>
                        {processo?.Anexo?.map((i) => (
                            <Flex key={i.id} flexDir="column" gap={2}>
                                <Text>{i.nome}</Text>
                                <QRCode size={75} value={i.anexo} />

                                <Text fontSize="xs">
                                    Leia o QRCode
                                    <br />
                                    <Link href={i.anexo}>ou clique aqui</Link>
                                </Text>
                            </Flex>
                        ))}
                    </Flex>
                </Box>
            )}
            <Box>
                <Heading size="sm" mb={3}>
                    Histórico da Ficha
                </Heading>
                <Table size="sm" gap={4} variant="striped">
                    <Thead>
                        <Tr>
                            <Th>Data</Th>
                            <Th>Usuário</Th>
                            <Th>Descrição</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {historicos.map((i) => (
                            <Tr key={i.id}>
                                <Td w={44}>
                                    {formatoData(i?.createdAt, "DATA_HORA")}
                                </Td>
                                <Td w={44}>{i?.usuario?.nome}</Td>
                                <Td>
                                    <Text
                                        dangerouslySetInnerHTML={{
                                            __html: i.descricao,
                                        }}
                                    ></Text>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            {historicosProcesso && (
                <Box>
                    <Heading size="sm" mb={3}>
                        Histórico do Processo
                    </Heading>
                    <Table size="sm" gap={4} variant="striped">
                        <Thead>
                            <Tr>
                                <Th>Data</Th>
                                <Th>Usuário</Th>
                                <Th>Descrição</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {historicosProcesso?.map((i) => (
                                <Tr key={i.id}>
                                    <Td w={44}>
                                        {formatoData(i?.createdAt, "DATA_HORA")}
                                    </Td>
                                    <Td w={44}>{i?.usuario?.nome}</Td>
                                    <Td>
                                        <Text
                                            dangerouslySetInnerHTML={{
                                                __html: i.descricao,
                                            }}
                                        ></Text>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            )}
        </Flex>
    );
};

export default FichaCadastral;

export const getServerSideProps = async (ctx) => {
    const { id } = ctx.query;
    let ficha = await prisma.fichaCadastral.findUnique({
        where: { id },
        include: {
            imobiliaria: true,
            modelo: true,
            preenchimento: {
                include: {
                    campo: true,
                },
            },
            responsavel: true,
            imovel: true,
            Processo: true,
            Anexo: true,
        },
    });
    let processo = null;
    let historicosProcesso = null;
    if (ficha?.processoId) {
        processo = await prisma.processo.findUnique({
            where: { id: ficha?.processoId },
            include: {
                Anexo: true,
            },
        });
        historicosProcesso = await prisma.historico.findMany({
            where: {
                tabela: "Processo",
                tabelaId: ficha?.processoId,
            },
            include: {
                usuario: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    const historicos = await prisma.historico.findMany({
        where: {
            tabela: "FichaCadastral",
            tabelaId: ficha.id,
        },
        include: {
            usuario: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const modelo = await prisma.modeloFichaCadastral.findUnique({
        where: {
            id: ficha?.modeloFichaCadastralId,
        },
    });
    const campos = await prisma.categoriaCampoFichaCadastral.findMany({
        where: {
            campos: {
                some: {
                    tipoFicha: ficha?.modelo.tipo,
                },
            },
        },
        orderBy: {
            ordem: "asc",
        },
        include: {
            campos: {
                orderBy: {
                    ordem: "asc",
                },
            },
        },
    });
    let newObj = {};
    let newArq = {};
    let analise = {};
    ficha.preenchimento.map((item) => {
        newObj[item.campoFichaCadastralCodigo] = item.valor;
        analise[item.campoFichaCadastralCodigo] = {
            aprovado: item.aprovado,
            motivoReprovacao: item.motivoReprovacao,
        };
    });
    ficha.preenchimento = newObj;
    ficha.analise = analise;
    return {
        props: {
            ficha: JSON.parse(JSON.stringify(ficha)),
            modelo: JSON.parse(JSON.stringify(modelo)),
            campos: JSON.parse(JSON.stringify(campos)),
            historicos: JSON.parse(JSON.stringify(historicos)),
            historicosProcesso: historicosProcesso
                ? JSON.parse(JSON.stringify(historicosProcesso))
                : null,
            processo: processo ? JSON.parse(JSON.stringify(processo)) : null,
        },
    };
};
