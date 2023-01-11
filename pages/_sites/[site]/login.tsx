import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Icon,
    Image,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";

import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { withSSRGuest } from "@/utils/withSSRGuests";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdFingerprint } from "react-icons/md";
import { Input } from "@/components/Forms/Input";
import { FaFacebook, FaGoogle, FaSignInAlt } from "react-icons/fa";
import { CgPassword } from "react-icons/cg";
import BeatLoader from "react-spinners/BeatLoader";
import { NextPage } from "next";
import { Heading } from "@chakra-ui/layout";
import { NextChakraLink } from "@/components/NextChakraLink";
import prisma from "@/lib/prisma";

interface CredentialsProps {
    documento: string;
    password: string;
}

const schema = yup.object().shape({
    documento: yup.string().required("O CPF é obrigatório"),
    password: yup.string().required("A senha é obrigatória"),
});

const SignIn: NextPage = ({ imobiliaria }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [error, setError] = useState(null);
    const { signIn } = useContext(AuthContext);
    const onSubmit: SubmitHandler<CredentialsProps> = async (data) => {
        console.log(data);
        try {
            setError(null);
            await signIn(data);
        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <Stack bg="gray.50" w="100vw" h="100vh">
            <Grid templateColumns="repeat(3, 1fr)" w="full" h="full">
                <GridItem
                    colSpan={2}
                    display={{ base: "none", lg: "flex" }}
                    bg="blue.500"
                    bgImg={imobiliaria.bg ? imobiliaria.bg : null}
                    bgPos="center"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                ></GridItem>
                <GridItem colSpan={1}>
                    <VStack
                        as="form"
                        onSubmit={handleSubmit(onSubmit)}
                        w={{ base: "100vw", lg: "full" }}
                        h="full"
                        align="center"
                        justify="center"
                        gridGap={4}
                        p={4}
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
                        <Text>Faça seu login</Text>
                        {error && (
                            <Flex
                                color="red"
                                borderWidth={1}
                                borderColor="red"
                                w={96}
                                p={2}
                            >
                                <Text w="full" textAlign="center">
                                    {error}
                                </Text>
                            </Flex>
                        )}
                        <Input
                            w={96}
                            type="text"
                            leftIcon={<Icon as={MdFingerprint} w={6} h={6} />}
                            placeholder="Seu CPF"
                            {...register("documento")}
                            error={errors.documento?.message}
                        />
                        <Input
                            type="password"
                            w={96}
                            leftIcon={<Icon as={CgPassword} w={6} h={6} />}
                            placeholder="Sua senha"
                            {...register("password")}
                            error={errors.password?.message}
                        />
                        <Button
                            type="submit"
                            borderRadius={0}
                            colorScheme="blue"
                            rightIcon={<Icon as={FaSignInAlt} />}
                            isLoading={isSubmitting}
                            spinner={<BeatLoader size={8} color="white" />}
                        >
                            Entrar
                        </Button>
                        <NextChakraLink href="/recuperar-senha">
                            <Button variant="ghost" size="xs">
                                Esqueci minha senha
                            </Button>
                        </NextChakraLink>
                    </VStack>
                    <VStack></VStack>
                </GridItem>
            </Grid>
        </Stack>
    );
};

export default SignIn;

export const getServerSideProps = withSSRGuest<any>(async (ctx) => {
    const { site } = ctx.query;
    const imobiliaria = await prisma.imobiliaria.findFirst({
        where: {
            url: site,
        },
    });
    return {
        props: { imobiliaria: JSON.parse(JSON.stringify(imobiliaria)) },
    };
});
