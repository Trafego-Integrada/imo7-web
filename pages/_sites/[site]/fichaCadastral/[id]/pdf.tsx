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
    Tr,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import QRCode from "react-qr-code";
import "react-quill/dist/quill.snow.css";
const FichaCadastral = ({ ficha, campos, modelo }) => {
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
    return (
        <Box minH="100vh" p={4}>
            <Flex align="center" py={4} gap={6}>
                <Box>
                    <Image w={150} src={ficha?.imobiliaria?.logo} />
                </Box>
                <Box>
                    <Text>
                        <Text as="span" fontWeight="bold">
                            {ficha?.imobiliaria?.razaoSocial}
                        </Text>{" "}
                        • CNPJ: {ficha?.imobiliaria?.cnpj}
                    </Text>
                    <Text fontSize="sm">
                        {ficha?.imobiliaria?.endereco},
                        {ficha?.imobiliaria?.bairro},
                        {ficha?.imobiliaria?.cidade}/
                        {ficha?.imobiliaria?.estado} - CEP:{" "}
                        {ficha?.imobiliaria?.cep}
                    </Text>
                    <Text fontSize="sm">
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
            <Box mb={4}>
                {ficha.imovel ? (
                    <Box bg="white">
                        <Text>
                            <Text as="span" fontWeight="bold">
                                Ficha referente ao imóvel:
                            </Text>{" "}
                            {ficha.imovel?.codigo} - {ficha.imovel?.endereco},{" "}
                            {ficha.imovel?.bairro}, {ficha.imovel?.cidade}/
                            {ficha.imovel?.estado}
                        </Text>
                    </Box>
                ) : ficha.codigoImovel ? (
                    <Box bg="white">
                        <Text>
                            <Text as="span" fontWeight="bold">
                                Ficha referente ao imóvel:
                            </Text>{" "}
                            {ficha.codigoImovel} - {ficha.enderecoImovel} nº{" "}
                            {ficha.numeroImovel}{" "}
                            {ficha.complementoImovel &&
                                `(${ficha.complementoImovel})`}
                            , {ficha.bairroImovel}, {ficha.cidadeImovel}/
                            {ficha.estadoImovel}
                        </Text>
                    </Box>
                ) : (
                    ""
                )}
                <Text>
                    <Text as="span" fontWeight="bold">
                        Responsável:
                    </Text>{" "}
                    {ficha.responsavel?.nome}
                </Text>
            </Box>
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
        </Box>
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
        },
    };
};
