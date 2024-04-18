import {
    Alert,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Icon,
    Image,
    Input,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";

import { FormInput } from "@/components/Form/FormInput";
import { NextChakraLink } from "@/components/NextChakraLink";
import { AuthContext } from "@/contexts/AuthContext";
import prisma from "@/lib/prisma";
import { api } from "@/services/apiClient";
import { withSSRGuest } from "@/utils/withSSRGuests";
import { Heading } from "@chakra-ui/layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useContext, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CgPassword } from "react-icons/cg";
import { FaPrint, FaSignInAlt } from "react-icons/fa";
import { FiArrowLeft, FiMail, FiPaperclip, FiPhone } from "react-icons/fi";
import { MdFingerprint } from "react-icons/md";
import BeatLoader from "react-spinners/BeatLoader";
import * as yup from "yup";
import { BiBarcode, BiPrinter } from "react-icons/bi";
import { useMutation } from "react-query";
import { buscarBoletoRapido } from "@/services/models/boleto";
import { formatoData, formatoValor } from "@/helpers/helpers";
import { useRouter } from "next/router";
interface CredentialsProps {
    documento: string;
    password: string;
}

const schema = yup.object().shape({
    documento: yup.string().required("O CPF é obrigatório"),
});

const SignIn: NextPage = ({ imobiliaria }) => {
    const router = useRouter();
    const [boletos, setBoletos] = useState(null);
    const {
        watch,
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onTouched",
    });

    const buscar = useMutation(buscarBoletoRapido, {
        onSuccess: (data) => setBoletos(data),
    });
    const onSubmit: SubmitHandler<CredentialsProps> = async (data) => {
        //console.log(data);
        try {
            await buscar.mutateAsync(data);
        } catch (error) {}
    };
    useEffect(() => {
        setFocus("documento");
    }, []);

    return (
        <Box bg="gray.100" w="100vw" h="100vh">
            <Container maxW="container.lg" as={Flex} h="full" align="center">
                <Grid
                    gap={4}
                    gridTemplateColumns={{
                        base: "repeat(1,1fr)",
                        lg: "repeat(3,1fr)",
                    }}
                >
                    <GridItem>
                        <VStack
                            bg="white"
                            as="form"
                            onSubmit={handleSubmit(onSubmit)}
                            h="full"
                            align="center"
                            justify="center"
                            gridGap={4}
                            p={4}
                            rounded="2xl"
                            shadow
                        >
                            <Box px={8} py={4}>
                                {imobiliaria.logo ? (
                                    <Image
                                        h={40}
                                        objectFit="contain"
                                        src={imobiliaria.logo}
                                        alt={imobiliaria.nomeFantasia}
                                    />
                                ) : (
                                    <Heading
                                        size="lg"
                                        display="flex"
                                        color="blue.500"
                                    >
                                        {imobiliaria.nomeFantasia}
                                    </Heading>
                                )}
                            </Box>
                            <Text>
                                Para acessar sua segunda via, informe seu CPF
                            </Text>

                            <FormInput
                                w={96}
                                type="text"
                                leftElement={
                                    <Icon as={MdFingerprint} w={6} h={6} />
                                }
                                placeholder="Seu CPF"
                                {...register("documento")}
                                error={errors.documento?.message}
                            />
                            <Button
                                type="submit"
                                borderRadius={0}
                                colorScheme="blue"
                                rightIcon={<Icon as={FaSignInAlt} />}
                                isLoading={isSubmitting}
                                spinner={<BeatLoader size={8} color="white" />}
                            >
                                Buscar boleto
                            </Button>
                        </VStack>
                    </GridItem>
                    <GridItem colSpan={{ lg: 2 }} as={Flex} align="center">
                        {boletos && boletos.length > 0 ? (
                            boletos.map((boleto) => (
                                <Box key={boleto.id}>
                                    <Box>
                                        <Heading color="gray.600" mb={6}>
                                            <Text as="span" fontWeight="normal">
                                                Fatura de
                                            </Text>{" "}
                                            {Intl.DateTimeFormat("pt-BR", {
                                                month: "long",
                                                year: "numeric",
                                            }).format(
                                                new Date(boleto.data_vencimen)
                                            )}
                                        </Heading>
                                        <Heading size="2xl" mb={2}>
                                            {formatoValor(boleto.valor_doc2)}
                                        </Heading>
                                        <Text>
                                            Vence em
                                            {formatoData(boleto.data_vencimen)}
                                        </Text>
                                    </Box>
                                    <Box bg="white" p={4} mb={4}>
                                        <Text fontWeight="bold">
                                            Pague com codigo de barras
                                        </Text>
                                        <Text>{boleto.linha_digitavel}</Text>
                                    </Box>
                                    <Grid
                                        gridTemplateColumns="repeat(3,1fr)"
                                        gap={4}
                                    >
                                        <NextChakraLink
                                            href={{
                                                pathname: "/boleto/[id]",
                                                query: {
                                                    id: boleto.id,
                                                },
                                            }}
                                            target="_blank"
                                        >
                                            <GridItem
                                                bg="white"
                                                as={Flex}
                                                flexDir="column"
                                                gap={1}
                                                justify="center"
                                                h={36}
                                                p={2}
                                                rounded="lg"
                                            >
                                                <Icon
                                                    as={FaPrint}
                                                    fontSize="2xl"
                                                />
                                                <Heading
                                                    size="sm"
                                                    color="gray.700"
                                                >
                                                    Imprimir
                                                </Heading>
                                                <Text
                                                    fontSize="xs"
                                                    color="gray"
                                                >
                                                    Acesse o boleto para
                                                    impressão
                                                </Text>
                                            </GridItem>
                                        </NextChakraLink>
                                        <NextChakraLink
                                            href={{
                                                pathname: "/boleto/[id]",
                                                query: {
                                                    id: boleto.id,
                                                    pdf: true,
                                                },
                                            }}
                                            target="_blank"
                                        >
                                            <GridItem
                                                bg="white"
                                                as={Flex}
                                                flexDir="column"
                                                gap={1}
                                                justify="center"
                                                h={36}
                                                p={2}
                                                rounded="lg"
                                            >
                                                <Icon
                                                    as={FaPrint}
                                                    fontSize="2xl"
                                                />
                                                <Heading
                                                    size="sm"
                                                    color="gray.700"
                                                >
                                                    Download
                                                </Heading>
                                                <Text
                                                    fontSize="xs"
                                                    color="gray"
                                                >
                                                    Baixe o boletos em PDF
                                                </Text>
                                            </GridItem>
                                        </NextChakraLink>
                                    </Grid>
                                </Box>
                            ))
                        ) : boletos && boletos.length === 0 ? (
                            <Alert>
                                <AlertIcon />
                                <AlertTitle>
                                    Não há boletos cadastrados
                                </AlertTitle>
                            </Alert>
                        ) : (
                            <></>
                        )}
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    );
};

export default SignIn;

export const getServerSideProps = async (ctx) => {
    const { site } = ctx.query;
    const imobiliaria = await prisma.imobiliaria.findFirst({
        where: {
            url: site,
        },
    });
    return {
        props: { imobiliaria: JSON.parse(JSON.stringify(imobiliaria)) },
    };
};
