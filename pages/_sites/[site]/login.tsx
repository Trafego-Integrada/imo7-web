import {
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
    useToast,
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
import { FaSignInAlt } from "react-icons/fa";
import { FiArrowLeft, FiMail, FiPaperclip, FiPhone } from "react-icons/fi";
import { MdFingerprint } from "react-icons/md";
import BeatLoader from "react-spinners/BeatLoader";
import * as yup from "yup";
import { BiBarcode } from "react-icons/bi";
interface CredentialsProps {
    documento: string;
    password: string;
}

const schema = yup.object().shape({
    documento: yup.string().required("O CPF é obrigatório"),
    password: yup.string().required("A senha é obrigatória"),
});

const SignIn: NextPage = ({ imobiliaria }) => {
    const toast = useToast();
    const inputSenha = useRef(null);
    const [usuario, setUsuario] = useState(null);
    const [usuarioExiste, setUsuarioExiste] = useState(false);
    const [atualizarCadastro, setAtualizarCadastro] = useState(false);
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
    const [error, setError] = useState(null);
    const { signIn } = useContext(AuthContext);
    const verificar = async () => {
        try {
            const { data } = await api.get("auth/sessions", {
                params: {
                    documento: watch("documento"),
                },
            });
            setUsuario(data);
            setTimeout(() => {
                console.log("ok");
                setFocus("password");
            }, 100);
        } catch (error) {
            toast({
                title: "Erro ao fazer login",
                description: error.response.data?.message,
                status: "error",
                duration: 9000,
            });
        }
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
    useEffect(() => {
        setFocus("documento");
    }, []);

    return (
        <Box
            bg="gray.100"
            bgImage={imobiliaria?.bg ? imobiliaria?.bg : ""}
            backgroundPosition="center"
            bgSize="cover"
            bgRepeat="no-repeat"
            w="100vw"
            h="100vh"
        >
            <Container maxW="container.lg" as={Flex} h="full" align="center">
                <Grid templateColumns={{ lg: "repeat(3, 1fr)" }} gap={4}>
                    <GridItem colSpan={{ lg: 1 }}>
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
                            {usuario && usuario.atualizar ? (
                                <Box>
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
                                </Box>
                            ) : (
                                <Text>Para entrar, informe seu CPF</Text>
                            )}
                            {error && (
                                <Flex
                                    color="red"
                                    borderWidth={1}
                                    borderColor="red"
                                    p={2}
                                >
                                    <Text w="full" textAlign="center">
                                        {error}
                                    </Text>
                                </Flex>
                            )}
                            <FormInput
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
                                        leftElement={
                                            <Icon
                                                as={FiPaperclip}
                                                w={6}
                                                h={6}
                                            />
                                        }
                                        placeholder="Informeu o número do seu contrato"
                                        {...register("contrato")}
                                        error={errors.contrato?.message}
                                    />
                                    <FormInput
                                        leftElement={
                                            <Icon as={FiMail} w={6} h={6} />
                                        }
                                        placeholder="Informeu um e-mail válido"
                                        {...register("email")}
                                        error={errors.email?.message}
                                    />
                                    <FormInput
                                        mask="(99) 9 9999-9999"
                                        leftElement={
                                            <Icon as={FiPhone} w={6} h={6} />
                                        }
                                        placeholder="Informeu seu celular"
                                        {...register("celular")}
                                        error={errors.celular?.message}
                                    />
                                    <FormInput
                                        type="password"
                                        leftElement={
                                            <Icon as={CgPassword} w={6} h={6} />
                                        }
                                        placeholder="Crie uma senha"
                                        {...register("password")}
                                        error={errors.password?.message}
                                    />
                                    <FormInput
                                        type="password"
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
                                    spinner={
                                        <BeatLoader size={8} color="white" />
                                    }
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
                                            <BeatLoader
                                                size={8}
                                                color="white"
                                            />
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
                                            <BeatLoader
                                                size={8}
                                                color="white"
                                            />
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
                                            <BeatLoader
                                                size={8}
                                                color="white"
                                            />
                                        }
                                        onClick={() => setUsuario(null)}
                                    >
                                        Voltar
                                    </Button>
                                </>
                            )}
                            <NextChakraLink
                                href="/recuperar-senha"
                                fontSize="sm"
                            >
                                Esqueci minha senha
                            </NextChakraLink>
                        </VStack>
                    </GridItem>
                    <GridItem
                        colSpan={{ lg: 2 }}
                        bgImg={imobiliaria.bg ? imobiliaria.bg : null}
                        bgPos="center"
                        alignItems="center"
                        justifyContent="center"
                        bgSize="cover"
                        p={4}
                    >
                        <Heading color="blue.700" size="md" mb={6}>
                            Veja também estas opções
                        </Heading>
                        <Grid
                            gridTemplateColumns={{
                                base: "repeat(2,1fr)",
                                lg: "repeat(3,1fr)",
                            }}
                            gap={4}
                        >
                            <NextChakraLink
                                href={{ pathname: "/boletoRapido" }}
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
                                    <Icon as={BiBarcode} fontSize="2xl" />
                                    <Heading size="sm" color="gray.700">
                                        2ª Via Rápida
                                    </Heading>
                                    <Text fontSize="xs" color="gray">
                                        Acesse a 2ª via do seu boleto
                                        rapidamente com CPF/CNPJ
                                    </Text>
                                </GridItem>
                            </NextChakraLink>
                        </Grid>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
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
