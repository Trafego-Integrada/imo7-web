import { formatoData, formatoValor } from '@/helpers/helpers'
import prisma from '@/lib/prisma'
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
} from '@chakra-ui/react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import QRCode from 'react-qr-code'
import 'react-quill/dist/quill.snow.css'
const FichaCadastral = ({
    ficha,
    campos,
    modelo,
    historicos,
    historicosProcesso,
    processo,
}) => {
    function breakText(text) {
        return text?.split('\n').map((item, index, array) => (
            <React.Fragment key={index}>
                {item}
                {index !== array.length - 1 && <br />}
            </React.Fragment>
        ))
    }

    const renderTable = (items) => {
        const rows = []
        let currentRow = []
        let currentRowColSpan = 0

        items
            ?.filter(
                (i) =>
                    modelo.campos[i.codigo] && modelo?.campos[i.codigo]?.exibir,
            )
            ?.forEach((campo) => {
                const colSpan =
                    campo.tipoCampo === 'file'
                        ? 1
                        : campo.colSpan
                            ? campo.colSpan
                            : 1

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
                            <Text fontWeight="bold" fontSize="md">
                                {campo.nome}
                            </Text>
                            {campo.tipoCampo === 'date' ? (
                                <Text fontSize="md">
                                    {moment(
                                        ficha.preenchimento[campo.codigo],
                                    ).format('DD/MM/YYYY')}
                                </Text>
                            ) : campo.tipoCampo === 'image' ? (
                                ficha.preenchimento[campo.codigo] ? (
                                    <Flex wrap="wrap" gap={2}>
                                        {JSON.parse(
                                            ficha.preenchimento[campo.codigo],
                                        ).map((item) => (
                                            <Flex
                                                key={item.id}
                                                flexDirection="column"
                                            >
                                                <Image
                                                    w={32}
                                                    h={44}
                                                    src={item}
                                                    objectFit="cover"
                                                    objectPosition="center"
                                                />
                                                <Text fontSize="md" mt={2}>
                                                    ou{' '}
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
                                        ))}
                                    </Flex>
                                ) : null
                            ) : campo?.tipoCampo === 'qrcode' ? (
                                ficha?.preenchimento?.[campo.codigo] ? (
                                    <Flex flexDirection="column">
                                        <QRCode
                                            size={75}
                                            value={
                                                ficha?.preenchimento[
                                                campo?.codigo
                                                ]
                                            }
                                        />
                                        <Text fontSize="md" mt={2}>
                                            Leia o QRCode ou{' '}
                                            <Link
                                                href={
                                                    ficha?.preenchimento[
                                                    campo?.codigo
                                                    ]
                                                }
                                            >
                                                clique aqui
                                            </Link>
                                        </Text>
                                    </Flex>
                                ) : null
                            ) : campo?.tipoCampo === 'files' ||
                                campo?.tipoCampo == 'file' ? (
                                ficha?.preenchimento[campo?.codigo] ? (
                                    <Flex wrap="wrap" gap={2}>
                                        {JSON.parse(
                                            ficha?.preenchimento[campo?.codigo],
                                        )?.map((i) => (
                                            <Flex
                                                key={i.id}
                                                flexDirection="column"
                                            >
                                                <QRCode size={75} value={i} />
                                                <Text
                                                    fontSize="md"
                                                    mt={2}
                                                >
                                                    Leia o QRCode ou
                                                    <br />
                                                    <Link href={i}>
                                                        clique aqui
                                                    </Link>
                                                </Text>
                                            </Flex>
                                        ))}
                                    </Flex>
                                ) : null
                            ) : (
                                <Text fontSize="md">
                                    {ficha?.preenchimento[campo.codigo]}
                                </Text>
                            )}
                        </Td>,
                    )
                    currentRowColSpan += colSpan
                } else {
                    rows.push(<Tr key={currentRow.length}>{currentRow}</Tr>)
                    currentRow = [
                        <Td
                            key={campo?.id}
                            colSpan={colSpan}
                            p={2}
                            borderColor="black"
                        >
                            <Text fontWeight="bold" fontSize="md">
                                {campo?.nome}
                            </Text>
                            {campo?.tipoCampo === 'date' ? (
                                <Text fontSize="md">
                                    {moment(
                                        ficha?.preenchimento[campo?.codigo],
                                    ).format('DD/MM/YYYY')}
                                </Text>
                            ) : campo?.tipoCampo === 'file' ? (
                                ficha?.preenchimento?.[campo?.codigo] ? (
                                    <Flex flexDirection="column">
                                        <QRCode
                                            size={75}
                                            value={
                                                ficha?.preenchimento[
                                                campo?.codigo
                                                ]
                                            }
                                        />
                                        <Text fontSize="md" mt={2}>
                                            Leia o QRCode ou{' '}
                                            <Link
                                                href={
                                                    ficha?.preenchimento[
                                                    campo?.codigo
                                                    ]
                                                }
                                            >
                                                clique aqui
                                            </Link>
                                        </Text>
                                    </Flex>
                                ) : null
                            ) : campo?.tipoCampo === 'files' ? (
                                ficha?.preenchimento?.[campo?.codigo] ? (
                                    <Flex wrap="wrap" gap={2}>
                                        {JSON.parse(
                                            ficha?.preenchimento?.[campo?.codigo],
                                        ).map((i) => (
                                            <Flex
                                                key={i.id}
                                                flexDirection="column"
                                            >
                                                <QRCode size={75} value={i} />
                                                <Text
                                                    fontSize="md"
                                                    mt={2}
                                                >
                                                    Leia o QRCode ou
                                                    <br />
                                                    <Link href={i}>
                                                        clique aqui
                                                    </Link>
                                                </Text>
                                            </Flex>
                                        ))}
                                    </Flex>
                                ) : null
                            ) : (
                                <Text fontSize="md">
                                    {ficha?.preenchimento[campo?.codigo]}
                                </Text>
                            )}
                        </Td>,
                    ]
                    currentRowColSpan = colSpan
                }
            })

        if (currentRow.length > 0) {
            rows.push(<Tr key={currentRow.length}>{currentRow}</Tr>)
        }

        return (
            <Table variant="simple" borderWidth={1} borderColor="black">
                <Tbody>{rows}</Tbody>
            </Table>
        )
    }
    return (
        <Flex minH="100vh" flexDir="column" gap={4}>
            <Flex align="center" py={0} gap={6}>
                <Box>
                    <Image h={70} src={ficha?.imobiliaria?.logo} />
                </Box>
                <Box>
                    <Text fontSize="md">
                        <Text as="span" fontWeight="bold">
                            {ficha?.imobiliaria?.razaoSocial}
                        </Text>{' '}
                        • CNPJ: {ficha?.imobiliaria?.cnpj}
                    </Text>
                    <Text fontSize="md">
                        {ficha?.imobiliaria?.endereco}, nº{' '}
                        {ficha?.imobiliaria?.numero},
                        {ficha?.imobiliaria?.bairro},
                        {ficha?.imobiliaria?.cidade}/
                        {ficha?.imobiliaria?.estado} - CEP:{' '}
                        {ficha?.imobiliaria?.cep}
                    </Text>
                    <Text fontSize="md">
                        <Text as="span" fontWeight="bold">
                            Fixo:
                        </Text>{' '}
                        {ficha?.imobiliaria?.telefone} •{' '}
                        <Text as="span" fontWeight="bold">
                            E-mail:
                        </Text>{' '}
                        {ficha?.imobiliaria?.email} •{' '}
                        <Text as="span" fontWeight="bold">
                            Site:
                        </Text>{' '}
                        {ficha?.imobiliaria?.site}
                    </Text>
                </Box>
            </Flex>
            <Box py={4}>
                <Heading size="md" textAlign="center">
                    {modelo.nome}
                </Heading>
                <Text textAlign="center" fontSize="md" color="gray">
                    {modelo.descricao}
                </Text>
                {ficha.status == 'aprovada' && (
                    <Alert status="success" my={2}>
                        <AlertIcon />
                        <AlertTitle>Ficha Aprovada</AlertTitle>
                    </Alert>
                )}
                {ficha.status == 'reprovada' && (
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
                    <Text fontSize="md">Nº Processo:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {' '}
                        {ficha?.Processo?.codigo}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Responsável:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {ficha?.responsavel?.nome}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Tipo Garantia:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {ficha?.Processo?.tipoGarantia}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Início do contrato:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {formatoData(ficha?.Processo?.inicioContrato)}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Prazo do contrato:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {ficha?.Processo?.prazoContrato}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Comissão:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {ficha?.Processo?.comissao}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Condições Gerais:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {ficha?.Processo?.condicoesGerais}
                    </Text>
                </GridItem>
                <GridItem colSpan={4} borderWidth={1} px={2} py={1}>
                    {ficha?.imovel ? (
                        <Box bg="white">
                            <Text fontSize="md">Imóvel:</Text>
                            <Text fontWeight="bold" fontSize="md">
                                {ficha?.imovel?.codigo} -{' '}
                                {ficha?.imovel?.endereco}, nº
                                {ficha?.imovel?.numero},
                                {ficha?.imovel?.complemento &&
                                    ` ${ficha?.imovel?.complemento},`}{' '}
                                {ficha?.imovel?.bairro}, {ficha?.imovel?.cidade}/
                                {ficha?.imovel?.estado}, CEP: {ficha?.imovel?.cep}
                            </Text>
                        </Box>
                    ) : ficha?.codigoImovel ? (
                        <Box bg="white">
                            <Text fontSize="md">Imóvel:</Text>
                            <Text fontWeight="bold" fontSize="md">
                                {ficha?.codigoImovel} - {ficha?.enderecoImovel}{' '}
                                nº {ficha?.numeroImovel}{' '}
                                {ficha?.complementoImovel &&
                                    `(${ficha.complementoImovel})`}
                                , {ficha?.bairroImovel}, {ficha?.cidadeImovel}/
                                {ficha?.estadoImovel}
                            </Text>
                        </Box>
                    ) : (
                        ''
                    )}
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Valor Negociado:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {ficha?.Processo?.campos.find((c) =>
                            Object.entries(c).find((i) => i[0] == 'valor'),
                        )?.valor &&
                            formatoValor(
                                ficha?.Processo?.campos
                                    .find((c) =>
                                        Object.entries(c).find(
                                            (i) => i[0] == 'valor',
                                        ),
                                    )
                                    ?.valor.replace(',', '.'),
                            )}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Valor Condominio:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {ficha?.imovel?.valorCondominio &&
                            formatoValor(ficha?.imovel?.valorCondominio)}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Valor IPTU:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {ficha?.imovel?.valorIPTU &&
                            formatoValor(ficha?.imovel?.valorIPTU)}
                    </Text>
                </GridItem>
                <GridItem borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Valor Seguro Incêndio:</Text>
                    <Text fontWeight="bold" fontSize="md">
                        {ficha?.imovel?.valorSeguro &&
                            formatoValor(ficha?.imovel?.valorSeguro)}
                    </Text>
                </GridItem>
                <GridItem colSpan={4} borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Observações do Processo: </Text>
                    <Box
                        fontWeight="bold"
                        fontSize="md"
                        style={{ whiteSpace: 'pre-line' }}
                    >
                        {breakText(ficha?.Processo?.observacoes)}
                    </Box>
                </GridItem>
                <GridItem colSpan={4} borderWidth={1} px={2} py={1}>
                    <Text fontSize="md">Observações da Ficha: </Text>
                    <Box
                        fontWeight="bold"
                        fontSize="md"
                        style={{ whiteSpace: 'pre-line' }}
                    >
                        {breakText(ficha?.observacoes)}
                    </Box>
                </GridItem>
            </Grid>
            <Grid gap={5}>
                {campos
                    ?.filter((i) =>
                        i.campos.find((e) => modelo?.campos[e.codigo]?.exibir),
                    )
                    ?.map((item) => (
                        <Box key={item.id}>
                            <Box>
                                <Heading size="sm" mb={3}>
                                    {item.nome}
                                </Heading>
                            </Box>
                            <>
                                {renderTable(
                                    item.campos.filter((i) => {
                                        if (
                                            (modelo.campos[i.codigo] &&
                                                modelo?.campos[i.codigo]
                                                    ?.exibir &&
                                                !i.dependencia) ||
                                            (modelo.campos[i.codigo] &&
                                                modelo?.campos[i.codigo]
                                                    ?.exibir &&
                                                ((i.dependencia?.codigo &&
                                                    !i.dependenciaValor &&
                                                    ficha.preenchimento[
                                                    i.dependencia?.codigo
                                                    ]) ||
                                                    (i.dependencia?.codigo &&
                                                        i.dependenciaValor &&
                                                        JSON.parse(
                                                            i.dependenciaValor,
                                                        ).includes(
                                                            ficha.preenchimento[
                                                            i.dependencia
                                                                ?.codigo
                                                            ],
                                                        ))))
                                        ) {
                                            return true
                                        } else {
                                            return false
                                        }
                                    }),
                                )}
                            </>
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
                                                fontSize="md"
                                            >
                                                {campo.nome}
                                            </Text>

                                            {campo.tipoCampo == "date" ? (
                                                <Text fontSize="md">
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
                                                            fontSize="md"
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
                                                <Text fontSize="md">
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
                    fontSize={'xs'}
                    dangerouslySetInnerHTML={{
                        __html: modelo?.instrucoes,
                    }}
                />
            </Box>
            <Box>
                <Heading size="sm" mb={3}>
                    Anexos da Ficha
                </Heading>
                <Flex gap={4}>
                    {ficha?.Anexo?.map((i) => (
                        <Flex key={i.id} flexDir="column" gap={2}>
                            <Text>{i.nome}</Text>
                            <QRCode size={75} value={i.anexo} />

                            <Text fontSize="md">
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

                                <Text fontSize="md">
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
                        {historicos?.map((i) => (
                            <Tr key={i.id}>
                                <Td w={44}>
                                    {formatoData(i?.createdAt, 'DATA_HORA')}
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
                                        {formatoData(i?.createdAt, 'DATA_HORA')}
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
    )
}

export default FichaCadastral

export const getServerSideProps = async (ctx) => {
    const { id } = ctx.query
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
            Anexo: {
                where: {
                    deletedAt: null,
                },
            },
        },
    })
    let processo = null
    let historicosProcesso = null
    if (ficha?.processoId) {
        processo = await prisma.processo.findUnique({
            where: { id: ficha?.processoId },
            include: {
                Anexo: true,
            },
        })
        historicosProcesso = await prisma.historico.findMany({
            where: {
                tabela: 'Processo',
                tabelaId: ficha?.processoId,
            },
            include: {
                usuario: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    const historicos = await prisma.historico.findMany({
        where: {
            tabela: 'FichaCadastral',
            tabelaId: ficha.id,
        },
        include: {
            usuario: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    const modelo = await prisma.modeloFichaCadastral.findUnique({
        where: {
            id: ficha?.modeloFichaCadastralId,
        },
    })
    const campos = await prisma.categoriaCampoFichaCadastral.findMany({
        where: {
            campos: {
                some: {
                    tipoFicha: ficha?.modelo.tipo,
                    deletedAt: null,
                },
            },
        },
        orderBy: {
            ordem: 'asc',
        },
        include: {
            campos: {
                orderBy: {
                    ordem: 'asc',
                },
                include: {
                    dependencia: true,
                },
            },
        },
    })
    let newObj = {}
    let newArq = {}
    let analise = {}
    ficha.preenchimento.map((item) => {
        newObj[item.campoFichaCadastralCodigo] = item.valor
        analise[item.campoFichaCadastralCodigo] = {
            aprovado: item.aprovado,
            motivoReprovacao: item.motivoReprovacao,
        }
    })
    ficha.preenchimento = newObj
    ficha.analise = analise
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
    }
}
