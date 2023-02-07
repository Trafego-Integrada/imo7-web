import { GetServerSideProps, NextPage } from "next";
import {
    Box,
    Flex,
    Heading,
    Text,
    Grid,
    GridItem,
    Icon,
    Button,
    Container,
} from "@chakra-ui/react";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "react-query";
import { listarContratos } from "@/services/models/contrato";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/router";

const Dashbord: NextPage = () => {
    const router = useRouter();
    const { usuario, signOut } = useAuth();
    const { data: contratos } = useQuery(
        [
            "meusContratos",
            { proprietarioId: usuario?.id, inquilinoId: usuario?.id },
        ],
        listarContratos
    );
    return (
        <LayoutPainel>
            <Container maxW="container.lg">
                <Heading mb={8} size="md">
                    Selecione um contrato
                </Heading>
                <Grid gap={4}>
                    {contratos &&
                        contratos.data?.data?.length > 0 &&
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
                            >
                                <Flex gridGap={4}>
                                    <Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="gray.800"
                                            textTransform="uppercase"
                                        >
                                            Contrato
                                        </Text>
                                        <Text color="gray.500">
                                            {item.codigo}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            textTransform="uppercase"
                                            color="gray.800"
                                        >
                                            Endereço
                                        </Text>
                                        <Text color="gray.500">
                                            {item.imovel?.endereco},
                                            {item.imovel?.numero},
                                            {item.imovel?.bairro},
                                            {item.imovel?.cidade},
                                            {item.imovel?.estado}, CEP
                                            {item.imovel?.cep}
                                        </Text>
                                    </Box>
                                </Flex>
                                <Button
                                    colorScheme="blue"
                                    size="sm"
                                    rightIcon={<Icon as={FiArrowRight} />}
                                    onClick={() =>
                                        router.push({
                                            pathname: "/[contratoId]",
                                            query: {
                                                contratoId: item.id,
                                            },
                                        })
                                    }
                                >
                                    Escolher este
                                </Button>
                            </GridItem>
                        ))}
                </Grid>
            </Container>
        </LayoutPainel>
    );
};

export default Dashbord;

export const getServerSideProps: GetServerSideProps = withSSRAuth((ctx) => {
    return {
        props: {},
    };
});
