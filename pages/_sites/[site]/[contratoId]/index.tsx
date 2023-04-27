import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import { NextChakraLink } from "@/components/NextChakraLink";
import { formatoValor } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import prisma from "@/lib/prisma";
import { listarChamados } from "@/services/models/chamado";
import { withSSRAuth } from "@/utils/withSSRAuth";
import {
    Badge,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCopy, FaEye, FaGrinWink, FaPrint } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { IoHelpBuoy } from "react-icons/io5";
import { useQuery } from "react-query";

const Dashbord: NextPage = ({ boletos, extratos }) => {
    const { usuario } = useAuth();
    const router = useRouter();
    const { data: chamados } = useQuery(
        ["chamados", { contratoId: router.query?.contratoId }],
        listarChamados
    );
    console.log(
        boletos.filter((e) => {
            console.log(
                e.contrato.inquilinos.includes((i) => {
                    console.log("a", i);
                    return true;
                })
            );
            return true;
        }),
        usuario
    );
    return (
        <LayoutPainel>
            <Grid gridTemplateColumns="repeat(3,1fr)" gap={4}>
                {extratos.filter((e) => e.usuarioId == usuario.id).length >
                    0 && (
                    <>
                        {extratos?.length ? (
                            <GridItem bg="white" rounded="2xl">
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    p={4}
                                >
                                    <Heading size="sm" color="gray.600">
                                        Ultimo extrato
                                    </Heading>
                                </Flex>
                                <Flex
                                    px={4}
                                    justify="space-between"
                                    align="center"
                                >
                                    <Text fontSize="md" lineHeight="none">
                                        Data do Depósito{" "}
                                        <Text as="span" fontWeight="bold">
                                            {extratos[0].dataDeposito &&
                                                moment(
                                                    extratos[0].dataDeposito
                                                ).format("DD [de] MMMM ")}
                                        </Text>
                                    </Text>
                                </Flex>
                                <Text
                                    py={4}
                                    textAlign="center"
                                    fontSize="2xl"
                                    fontWeight="bold"
                                >
                                    {/* {formatoValor(extratos[0].valor_doc2)} */}
                                </Text>

                                <Grid
                                    gridTemplateColumns="repeat(2,1fr)"
                                    mt={4}
                                    borderTopWidth={1}
                                    borderTopColor="gray.100"
                                    h={14}
                                    fontSize="sm"
                                >
                                    <GridItem>
                                        <Link
                                            href={{
                                                pathname: "/extrato/[id]",
                                                query: {
                                                    id: extratos[0].id,
                                                    pdf: true,
                                                },
                                            }}
                                            target="_blank"
                                            passHref
                                        >
                                            <Flex
                                                align="center"
                                                gridGap={4}
                                                justify="center"
                                                color="blue.500"
                                                h="full"
                                            >
                                                <Icon
                                                    as={FaPrint}
                                                    fontSize="xl"
                                                />
                                                <Box textAlign="center">
                                                    <Link
                                                        href={`/boleto/${extratos[0].id}`}
                                                        target="_blank"
                                                        passHref
                                                    >
                                                        <Text
                                                            fontWeight="bold"
                                                            lineHeight="none"
                                                        >
                                                            Imprimir
                                                        </Text>
                                                    </Link>
                                                    <Text>
                                                        2ª via do extrato
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        </Link>
                                    </GridItem>
                                    <GridItem>
                                        <Link
                                            href={{
                                                pathname: "/extrato/[id]",
                                                query: {
                                                    id: extratos[0].id,
                                                },
                                            }}
                                            borderLeftWidth={1}
                                            borderLeftColor="gray.100"
                                            passHref
                                            target="_blank"
                                        >
                                            <Flex
                                                align="center"
                                                gridGap={4}
                                                justify="center"
                                                color="blue.500"
                                                h="full"
                                            >
                                                <Icon
                                                    as={FaEye}
                                                    fontSize="xl"
                                                />
                                                <Box textAlign="center">
                                                    <Text
                                                        fontWeight="bold"
                                                        lineHeight="none"
                                                    >
                                                        Visualizar
                                                    </Text>
                                                    <Text>Extrato</Text>
                                                </Box>
                                            </Flex>
                                        </Link>
                                    </GridItem>
                                </Grid>
                            </GridItem>
                        ) : (
                            <GridItem
                                bg="white"
                                rounded="2xl"
                                align="center"
                                justify="center"
                                as={Flex}
                            >
                                <Flex
                                    h="full"
                                    flexDirection="column"
                                    align="center"
                                    justify="center"
                                    gridGap={4}
                                >
                                    <Icon
                                        as={FaGrinWink}
                                        fontSize="6xl"
                                        color="gray.400"
                                    />
                                    <Text color="gray.400" fontWeight="bold">
                                        Não há extratos para este contrato
                                    </Text>
                                </Flex>
                            </GridItem>
                        )}
                    </>
                )}
                {boletos.filter((e) =>
                    e.contrato.inquilinos.filter((i) => i.id == usuario.id)
                        .length > 0
                        ? true
                        : false
                ).length > 0 && (
                    <>
                        {" "}
                        {boletos?.length ? (
                            <GridItem bg="white" rounded="2xl">
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    p={4}
                                >
                                    <Heading size="sm" color="gray.600">
                                        Ultima fatura
                                    </Heading>
                                </Flex>
                                <Flex
                                    px={4}
                                    justify="space-between"
                                    align="center"
                                >
                                    <Text fontSize="md" lineHeight="none">
                                        Vence dia{" "}
                                        <Text as="span" fontWeight="bold">
                                            {boletos[0].data_vencimen &&
                                                moment(
                                                    boletos[0].data_vencimen
                                                ).format("DD [de] MMMM ")}
                                        </Text>
                                    </Text>
                                </Flex>
                                <Text
                                    py={4}
                                    textAlign="center"
                                    fontSize="2xl"
                                    fontWeight="bold"
                                >
                                    {formatoValor(boletos[0].valor_doc2)}
                                </Text>

                                <Box px={4}>
                                    <Text
                                        color="gray.500"
                                        letterSpacing="normal"
                                        fontSize="xs"
                                        textAlign="center"
                                    >
                                        Utilize o código de barras a seguir para
                                        pagar sua fatura
                                    </Text>
                                    <Flex
                                        mt={2}
                                        w="full"
                                        bg="gray.100"
                                        py={2}
                                        px={4}
                                        rounded="lg"
                                        align="center"
                                        justify="space-between"
                                        fontSize="sm"
                                    >
                                        <Text
                                            letterSpacing="normal"
                                            textAlign="center"
                                            w="full"
                                            fontWeight="semibold"
                                            color="gray.600"
                                        >
                                            {boletos[0].barcode}
                                        </Text>
                                        <Button color="gray.500">
                                            <Icon as={FaCopy} />
                                        </Button>
                                    </Flex>
                                </Box>
                                <Grid
                                    gridTemplateColumns="repeat(2,1fr)"
                                    mt={4}
                                    borderTopWidth={1}
                                    borderTopColor="gray.100"
                                    h={14}
                                    fontSize="sm"
                                >
                                    <GridItem>
                                        <Link
                                            href={`https://www.imo7.com.br/api/boleto/${boletos[0].id}/pdf`}
                                            target="_blank"
                                            passHref
                                        >
                                            <Flex
                                                align="center"
                                                gridGap={4}
                                                justify="center"
                                                color="blue.500"
                                                h="full"
                                            >
                                                <Icon
                                                    as={FaPrint}
                                                    fontSize="xl"
                                                />
                                                <Box textAlign="center">
                                                    <Link
                                                        href={`/boleto/${boletos[0].id}`}
                                                        target="_blank"
                                                        passHref
                                                    >
                                                        <Text
                                                            fontWeight="bold"
                                                            lineHeight="none"
                                                        >
                                                            Imprimir
                                                        </Text>
                                                    </Link>
                                                    <Text>
                                                        2ª via da fatura
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        </Link>
                                    </GridItem>
                                    <GridItem>
                                        <Link
                                            href="/"
                                            borderLeftWidth={1}
                                            borderLeftColor="gray.100"
                                            passHref
                                        >
                                            <Flex
                                                align="center"
                                                gridGap={4}
                                                justify="center"
                                                color="blue.500"
                                                h="full"
                                            >
                                                <Icon
                                                    as={FaEye}
                                                    fontSize="xl"
                                                />
                                                <Box textAlign="center">
                                                    <Text
                                                        fontWeight="bold"
                                                        lineHeight="none"
                                                    >
                                                        Visualizar
                                                    </Text>
                                                    <Text>Fatura</Text>
                                                </Box>
                                            </Flex>
                                        </Link>
                                    </GridItem>
                                </Grid>
                            </GridItem>
                        ) : (
                            <GridItem
                                bg="white"
                                rounded="2xl"
                                align="center"
                                justify="center"
                                as={Flex}
                            >
                                <Flex
                                    h="full"
                                    flexDirection="column"
                                    align="center"
                                    justify="center"
                                    gridGap={4}
                                >
                                    <Icon
                                        as={FaGrinWink}
                                        fontSize="6xl"
                                        color="gray.400"
                                    />
                                    <Text color="gray.400" fontWeight="bold">
                                        Não há boletos em aberto para este
                                        contrato
                                    </Text>
                                </Flex>
                            </GridItem>
                        )}
                    </>
                )}

                <GridItem
                    as={Flex}
                    flexDirection="column"
                    justify="space-between"
                    bg="white"
                    rounded="2xl"
                    maxH={72}
                >
                    <Flex h="auto" p={4}>
                        <Heading size="sm" color="gray.600">
                            Chamados em aberto
                        </Heading>
                    </Flex>
                    {chamados?.data?.data ? (
                        <Grid gap={2} overflow="auto" px={2}>
                            {chamados?.data?.data?.map((item) => (
                                <GridItem
                                    as={Flex}
                                    justify="space-between"
                                    key={item.id}
                                    p={1}
                                    px={4}
                                    bg="gray.100"
                                    rounded="lg"
                                >
                                    <Box>
                                        <Text fontSize="xs">Título</Text>
                                        <Text fontSize="xs" fontWeight="bold">
                                            {item.titulo}
                                        </Text>
                                    </Box>
                                    <IconButton
                                        icon={<Icon as={FiEye} />}
                                        onClick={() =>
                                            router.push({
                                                pathname: `/[contratoId]/chamados/[id]`,
                                                query: {
                                                    id: item.id,
                                                    contratoId: item.contratoId,
                                                },
                                            })
                                        }
                                    />
                                </GridItem>
                            ))}
                        </Grid>
                    ) : (
                        <Flex
                            h="full"
                            flexDirection="column"
                            align="center"
                            justify="center"
                            gridGap={4}
                        >
                            <Icon
                                as={FaGrinWink}
                                fontSize="6xl"
                                color="gray.400"
                            />
                            <Text color="gray.400" fontWeight="bold">
                                Não há chamados em aberto
                            </Text>
                        </Flex>
                    )}

                    <Flex
                        h={14}
                        mt={4}
                        borderTopWidth={1}
                        borderTopColor="gray.100"
                        fontSize="sm"
                        align="center"
                        justify="center"
                    >
                        <NextChakraLink
                            w="full"
                            href={`/${router.query.contratoId}/chamados/novo`}
                        >
                            <Flex
                                align="center"
                                gridGap={4}
                                justify="center"
                                color="blue.500"
                            >
                                <Icon as={IoHelpBuoy} fontSize="xl" />
                                <Box textAlign="center">
                                    <Text fontWeight="bold" lineHeight="none">
                                        Preciso de ajuda
                                    </Text>
                                </Box>
                            </Flex>
                        </NextChakraLink>
                    </Flex>
                </GridItem>
                <GridItem bg="white" rounded="2xl"></GridItem>
            </Grid>
        </LayoutPainel>
    );
};

export default Dashbord;

export const getServerSideProps = withSSRAuth(async (ctx) => {
    try {
        const { contratoId, site } = ctx.query;
        const contrato = await prisma.contrato.findMany({
            where: {
                id: Number(contratoId),
            },
            include: {
                proprietarios: true,
                inquilinos: true,
            },
        });
        const boletos = await prisma.boleto.findMany({
            where: {
                contratoId: Number(contratoId),
                imobiliaria: {
                    url: site,
                },
            },
            include: {
                contrato: {
                    include: {
                        inquilinos: true,
                    },
                },
            },
        });
        const extratos = await prisma.extrato.findMany({
            where: {
                contratoId: Number(contratoId),
                imobiliaria: {
                    url: site,
                },
            },
        });
        return {
            props: {
                boletos: JSON.parse(JSON.stringify(boletos)),
                extratos: JSON.parse(JSON.stringify(extratos)),
                contrato: JSON.parse(JSON.stringify(contrato)),
            },
        };
    } catch (error) {
        return {
            props: {},
        };
    }
});
