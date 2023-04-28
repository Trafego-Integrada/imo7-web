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

import { FormInput } from "@/components/Form/FormInput";
import { NextChakraLink } from "@/components/NextChakraLink";
import { AuthContext } from "@/contexts/AuthContext";
import prisma from "@/lib/prisma";
import { api } from "@/services/apiClient";
import { withSSRGuest } from "@/utils/withSSRGuests";
import { Heading } from "@chakra-ui/layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CgPassword } from "react-icons/cg";
import { FaSignInAlt } from "react-icons/fa";
import { FiArrowLeft, FiMail, FiPaperclip, FiPhone } from "react-icons/fi";
import { MdFingerprint } from "react-icons/md";
import BeatLoader from "react-spinners/BeatLoader";
import * as yup from "yup";
interface CredentialsProps {
    documento: string;
    password: string;
}

const schema = yup.object().shape({
    documento: yup.string().required("O CPF é obrigatório"),
    password: yup.string().required("A senha é obrigatória"),
});

const SignIn: NextPage = ({ imobiliaria }) => {
    const [usuario, setUsuario] = useState(null);
    const [usuarioExiste, setUsuarioExiste] = useState(false);
    const [atualizarCadastro, setAtualizarCadastro] = useState(false);
    const {
        watch,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [error, setError] = useState(null);
    const { signIn } = useContext(AuthContext);
    const verificar = async () => {
        const { data } = await api.get("auth/sessions", {
            params: {
                documento: watch("documento"),
            },
        });
        setUsuario(data);
        console.log(data);
    };
    const atualizar = async () => {
        try {
            setError(null);
            const { data } = await api.post("auth/update", watch());
            setUsuario(data);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };
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
                    bgSize="cover"
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
                        {usuario && usuario.atualizar ? (
                            <>
                                <Text textAlign="center" fontWeight="bold">
                                    Seja bem vindo(a),
                                    <br /> {usuario.nome}!
                                </Text>
                                <Text
                                    fontSize="sm"
                                    color="gray"
                                    textAlign="center"
                                >
                                    É seu primeiro login, crie uma senha e
                                    atualize seus dados cadastrais
                                </Text>
                            </>
                        ) : (
                            <Text>Faça seu login</Text>
                        )}
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
                        <FormInput
                            w={96}
                            type="text"
                            leftElement={
                                <Icon as={MdFingerprint} w={6} h={6} />
                            }
                            placeholder="Seu CPF"
                            {...register("documento")}
                            error={errors.documento?.message}
                            isDisabled={usuario ? true : false}
                        />
                        {usuario && !usuario?.atualizar ? (
                            <FormInput
                                type="password"
                                w={96}
                                leftElement={
                                    <Icon as={CgPassword} w={6} h={6} />
                                }
                                placeholder="Digite a senha"
                                {...register("password")}
                                error={errors.password?.message}
                            />
                        ) : usuario && usuario.atualizar ? (
                            <>
                                <FormInput
                                    w={96}
                                    leftElement={
                                        <Icon as={FiPaperclip} w={6} h={6} />
                                    }
                                    placeholder="Informeu o número do seu contrato"
                                    {...register("contrato")}
                                    error={errors.contrato?.message}
                                />
                                <FormInput
                                    w={96}
                                    leftElement={
                                        <Icon as={FiMail} w={6} h={6} />
                                    }
                                    placeholder="Informeu um e-mail válido"
                                    {...register("email")}
                                    error={errors.email?.message}
                                />
                                <FormInput
                                    mask="(99) 9 9999-9999"
                                    w={96}
                                    leftElement={
                                        <Icon as={FiPhone} w={6} h={6} />
                                    }
                                    placeholder="Informeu seu celular"
                                    {...register("celular")}
                                    error={errors.celular?.message}
                                />
                                <FormInput
                                    type="password"
                                    w={96}
                                    leftElement={
                                        <Icon as={CgPassword} w={6} h={6} />
                                    }
                                    placeholder="Crie uma senha"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                <FormInput
                                    type="password"
                                    w={96}
                                    leftElement={
                                        <Icon as={CgPassword} w={6} h={6} />
                                    }
                                    placeholder="Repita a senha"
                                    {...register("confirmPassword")}
                                    error={errors.confirmPassword?.message}
                                />
                            </>
                        ) : (
                            <></>
                        )}
                        {!usuario ? (
                            <Button
                                type="submit"
                                borderRadius={0}
                                colorScheme="blue"
                                rightIcon={<Icon as={FaSignInAlt} />}
                                spinner={<BeatLoader size={8} color="white" />}
                                onClick={(e) => {
                                    e.preventDefault();
                                    verificar();
                                }}
                            >
                                Continuar
                            </Button>
                        ) : usuario && usuario.atualizar ? (
                            <>
                                <Button
                                    type="submit"
                                    borderRadius={0}
                                    colorScheme="blue"
                                    rightIcon={<Icon as={FaSignInAlt} />}
                                    spinner={
                                        <BeatLoader size={8} color="white" />
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        atualizar();
                                    }}
                                >
                                    Atualizar
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="submit"
                                    borderRadius={0}
                                    colorScheme="blue"
                                    rightIcon={<Icon as={FaSignInAlt} />}
                                    isLoading={isSubmitting}
                                    spinner={
                                        <BeatLoader size={8} color="white" />
                                    }
                                >
                                    Entrar
                                </Button>
                                <Button
                                    variant="ghost"
                                    borderRadius={0}
                                    colorScheme="blue"
                                    leftIcon={<Icon as={FiArrowLeft} />}
                                    spinner={
                                        <BeatLoader size={8} color="white" />
                                    }
                                    onClick={() => setUsuario(null)}
                                >
                                    Voltar
                                </Button>
                            </>
                        )}
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
