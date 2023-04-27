import { useAuth } from "@/hooks/useAuth";
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
import Link from "next/link";
const Chamados: NextPage = () => {
    const router = useRouter();
    const { usuario, signOut } = useAuth();
    const { data: contratos } = useQuery(
        ["chamados", { contratoId: router.query.contratoId }],
        listarChamados
    );
    return (
        <LayoutPainel>
            <Container maxW="container.lg">
                <Flex justify="space-between">
                    <Heading mb={8} size="md">
                        Chamados
                    </Heading>
                    <Link
                        passHref
                        href={{
                            pathname: "/[contratoId]/chamados/novo",
                            query: { contratoId: router.query.contratoId },
                        }}
                    >
                        <Button>Abrir chamado</Button>
                    </Link>
                </Flex>
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
                                                Nº Chamado
                                            </Text>
                                            <Text># {item.id}</Text>
                                        </Box>
                                        <Box>
                                            <Text
                                                fontSize="xs"
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                color="gray.800"
                                            >
                                                Titulo
                                            </Text>
                                            <Text>{item.titulo}</Text>
                                        </Box>
                                    </Flex>
                                    <Flex
                                        align="center"
                                        justify="center"
                                        minW={24}
                                        textAlign="center"
                                    >
                                        <Badge
                                            colorScheme={
                                                item.status == "ABERTO"
                                                    ? "blue"
                                                    : item.status ==
                                                      "FINALIZADO"
                                                    ? "gray"
                                                    : "gray"
                                            }
                                            textAlign="center"
                                        >
                                            {item.status}
                                        </Badge>
                                    </Flex>
                                </Flex>

                                <Button
                                    colorScheme="blue"
                                    size="sm"
                                    rightIcon={<Icon as={FiArrowRight} />}
                                    onClick={() =>
                                        router.push({
                                            pathname:
                                                "/[contratoId]/chamados/[id]",
                                            query: {
                                                contratoId:
                                                    router.query.contratoId,
                                                id: item.id,
                                            },
                                        })
                                    }
                                >
                                    Abrir
                                </Button>
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
                                    Não há chamados para este contrato
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
