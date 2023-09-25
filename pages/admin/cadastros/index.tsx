import {
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    GridItem,
    Heading,
    List,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useToast,
} from "@chakra-ui/react";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "react-query";
import { show, update } from "@/services/models/imobiliaria";
import { useEffect, useState } from "react";
import { FichasCadastrais } from "@/components/Pages/Admin/Configuracoes/FichasCadastrais";
import Link from "next/link";

const Configuracoes = () => {
    return (
        <>
            <Layout title="Configurações">
                <Box p={4}>
                    <Grid
                        gridTemplateColumns={{
                            base: "repeat(1,1fr)",
                            lg: "repeat(4,1fr)",
                        }}
                    >
                        <GridItem bg="white" p={4}>
                            <Heading size="md">Ficha Cadastral</Heading>
                            <Text color="gray" fontSize="sm">
                                Gerêncie os cadastros referente as fichas
                                cadastrais
                            </Text>
                            <Flex flexDir="column" gap={2} mt={4}>
                                <Link href="/admin/cadastros/fichas/categoriasCampo">
                                    <Button
                                        w="full"
                                        variant="outline"
                                        colorScheme="blue"
                                    >
                                        Categorias de Campos
                                    </Button>
                                </Link>
                                <Link href="/admin/cadastros/fichas/campos">
                                    <Button
                                        w="full"
                                        variant="outline"
                                        colorScheme="blue"
                                    >
                                        {" "}
                                        Campos
                                    </Button>
                                </Link>
                                <Link href="/admin/cadastros/fichas/motivosReprovacao">
                                    <Button
                                        w="full"
                                        variant="outline"
                                        colorScheme="blue"
                                    >
                                        {" "}
                                        Motivos de Reprovação
                                    </Button>
                                </Link>
                            </Flex>
                        </GridItem>
                    </Grid>
                </Box>
            </Layout>
        </>
    );
};
export default Configuracoes;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
