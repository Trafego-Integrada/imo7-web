import { GetServerSideProps, NextPage } from "next";
import {
    Box,
    Flex,
    Heading,
    Text,
    Grid,
    GridItem,
    Badge,
    Icon,
    Button,
} from "@chakra-ui/react";
import { NextChakraLink } from "@/components/NextChakraLink";
import { FaCopy, FaEye, FaGrinWink, FaPrint } from "react-icons/fa";
import { IoHelpBuoy } from "react-icons/io5";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { useAuth } from "@/hooks/useAuth";

const Dashbord: NextPage = () => {
    return (
        <LayoutPainel>
            <Grid gridTemplateColumns="repeat(3,1fr)" gap={4}>
                <GridItem bg="white" rounded="2xl">
                    <Flex justify="space-between" align="center" p={4}>
                        <Heading size="sm" color="gray.600">
                            Ultima fatura
                        </Heading>
                        <Badge
                            colorScheme="blue"
                            variant="solid"
                            display="flex"
                            alignItems="center"
                            px={4}
                        >
                            Aguardando
                        </Badge>
                    </Flex>
                    <Flex px={4} justify="space-between" align="center">
                        <Text fontSize="md" lineHeight="none">
                            Vence dia
                            <Text as="span" fontWeight="bold">
                                10 de agosto
                            </Text>
                        </Text>
                    </Flex>
                    <Text
                        py={4}
                        textAlign="center"
                        fontSize="2xl"
                        fontWeight="bold"
                    >
                        R$ 800,00
                    </Text>

                    <Box px={4}>
                        <Text
                            color="gray.500"
                            letterSpacing="normal"
                            fontSize="xs"
                            textAlign="center"
                        >
                            Utilize o código de barras a seguir para pagar sua
                            fatura{" "}
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
                                84660000001-8 30000296202-9
                                <br />
                                10910566000-4 00208391628-4
                            </Text>
                            <Button color="gray.500">
                                <Icon as={FaCopy} />
                            </Button>
                        </Flex>
                    </Box>
                    <Flex
                        mt={4}
                        borderTopWidth={1}
                        borderTopColor="gray.100"
                        h={12}
                        fontSize="sm"
                        align="center"
                    >
                        <NextChakraLink w="full" href="/">
                            <Flex
                                align="center"
                                gridGap={4}
                                justify="center"
                                color="blue.500"
                            >
                                <Icon as={FaPrint} fontSize="xl" />
                                <Box textAlign="center">
                                    <Text fontWeight="bold" lineHeight="none">
                                        Imprimir
                                    </Text>
                                    <Text>2ª via da fatura</Text>
                                </Box>
                            </Flex>
                        </NextChakraLink>
                        <NextChakraLink
                            w="full"
                            href="/"
                            borderLeftWidth={1}
                            borderLeftColor="gray.100"
                        >
                            <Flex
                                align="center"
                                gridGap={4}
                                justify="center"
                                color="blue.500"
                            >
                                <Icon as={FaEye} fontSize="xl" />
                                <Box textAlign="center">
                                    <Text fontWeight="bold" lineHeight="none">
                                        Visualizar
                                    </Text>
                                    <Text>Fatura</Text>
                                </Box>
                            </Flex>
                        </NextChakraLink>
                    </Flex>
                </GridItem>
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
                            Chamados
                        </Heading>
                    </Flex>
                    <Flex
                        h="full"
                        flexDirection="column"
                        align="center"
                        justify="center"
                        gridGap={4}
                    >
                        <Icon as={FaGrinWink} fontSize="6xl" color="gray.400" />
                        <Text color="gray.400" fontWeight="bold">
                            Não há chamados em aberto
                        </Text>
                    </Flex>
                    <Flex
                        h={20}
                        mt={4}
                        borderTopWidth={1}
                        borderTopColor="gray.100"
                        fontSize="sm"
                        align="center"
                    >
                        <NextChakraLink w="full" href="/painel/chamados/novo">
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

export const getServerSideProps: GetServerSideProps = withSSRAuth((ctx) => {
    return {
        props: {},
    };
});
