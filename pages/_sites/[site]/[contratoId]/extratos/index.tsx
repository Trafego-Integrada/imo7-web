import { useAuth } from "@/hooks/useAuth";
import { listarBoletos } from "@/services/models/boleto";
import { listarChamados } from "@/services/models/chamado";
import {
    Badge,
    Box,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    Tag,
    Text,
} from "@chakra-ui/react";

import { NextPage } from "next";
import { useRouter } from "next/router";
import { FiArrowRight } from "react-icons/fi";
import { useQuery } from "react-query";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import { FaGrinWink } from "react-icons/fa";
import { listarExtratos } from "@/services/models/extrato";
import { formatoData } from "@/helpers/helpers";
import Link from "next/link";

const Chamados: NextPage = () => {
    const router = useRouter();
    const { usuario, signOut } = useAuth();
    const { data: contratos } = useQuery(
        [
            "extratos",
            {
                contratoId: router.query.contratoId,
                proprietarioId: usuario?.id,
            },
        ],
        listarExtratos
    );
    return (
        <LayoutPainel>
            <Container maxW="container.lg">
                <Heading mb={8} size="md">
                    Extratos
                </Heading>
                <Grid gap={4}>
                    {contratos && contratos.data?.data?.length > 0 ? (
                        contratos.data?.data.map((item, key) => (
                            <GridItem
                                as={Flex}
                                key={item.id}
                                bg="white"
                                rounded="lg"
                                shadow="lg"
                                align="center"
                                justify="space-between"
                                p={4}
                                gridGap={4}
                            >
                                <Flex
                                    gridGap={4}
                                    justify="space-between"
                                    w="full"
                                >
                                    <Flex gridGap={4}>
                                        <Box>
                                            <Text
                                                fontSize="xs"
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                color="gray.800"
                                            >
                                                Nº Parcela
                                            </Text>
                                            <Text>{item.parcela}</Text>
                                        </Box>
                                        <Box>
                                            <Text
                                                fontSize="xs"
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                color="gray.800"
                                            >
                                                Data do Depósito
                                            </Text>
                                            <Text>
                                                {item.dataDeposito &&
                                                    formatoData(
                                                        item.dataDeposito
                                                    )}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Text
                                                fontSize="xs"
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                color="gray.800"
                                            >
                                                Período
                                            </Text>
                                            <Text>{item.periodo}</Text>
                                        </Box>
                                    </Flex>
                                    <Flex align="center">
                                        <Badge colorScheme="blue">
                                            {item.status}
                                        </Badge>
                                    </Flex>
                                </Flex>
                                <Link
                                    href={{
                                        pathname: "/extrato/[id]",
                                        query: {
                                            contratoId: item.contratoId,
                                            id: item.id,
                                            pdf: true,
                                        },
                                    }}
                                    target="_blank"
                                >
                                    <Button
                                        colorScheme="blue"
                                        size="sm"
                                        rightIcon={<Icon as={FiArrowRight} />}
                                    >
                                        Abrir
                                    </Button>
                                </Link>
                            </GridItem>
                        ))
                    ) : (
                        <>
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
                        </>
                    )}
                </Grid>
            </Container>
        </LayoutPainel>
    );
};

export default Chamados;
