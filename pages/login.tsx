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

interface CredentialsProps {
    documento: string;
    password: string;
}

const schema = yup.object().shape({
    documento: yup.string().required("O CPF é obrigatório"),
    password: yup.string().required("A senha é obrigatória"),
});

const SignIn: NextPage = () => {
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
        <Stack
            bg="gray.50"
            w="100vw"
            h="100vh"
            background="url(/img/IMAGEM-TOPO-CELULAR.png),radial-gradient(274.41% 274.41% at 50% 50%, #012659 0%, rgba(0, 0, 0, 0.00) 100%),#03132B"
            bgRepeat="no-repeat"
            bgPos="right"
            bgSize="cover"
        >
            <Flex
                flexDir="column"
                gap={12}
                align="center"
                justify="center"
                w="full"
                h="full"
            >
                <GridItem as={Flex} w="full" align="center" justify="center">
                    <Flex
                        as="form"
                        onSubmit={handleSubmit(onSubmit)}
                        align="center"
                        justify="center"
                        flexDir="column"
                        gap={12}
                        p={8}
                        rounded="2xl"
                        bg="rgb(3, 19, 43,.8)"
                    >
                        <Flex
                            flexDir="column"
                            justify="center"
                            align="center"
                            gap={2}
                        >
                            <Box px={8} py={4}>
                                <Image
                                    src="/img/logo-imo7-escuro.svg"
                                    alt="Imo7"
                                />
                            </Box>
                            <Text color="white">Faça seu login</Text>
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
                        </Flex>
                        <Flex flexDir="column" gap={4}>
                            <Input
                                w={{ lg: 96 }}
                                size="sm"
                                type="text"
                                leftIcon={
                                    <Icon as={MdFingerprint} w={6} h={6} />
                                }
                                placeholder="Seu CPF"
                                {...register("documento")}
                                error={errors.documento?.message}
                                color="white"
                            />
                            <Input
                                type="password"
                                w={{ lg: 96 }}
                                size="sm"
                                leftIcon={<Icon as={CgPassword} w={6} h={6} />}
                                placeholder="Sua senha"
                                {...register("password")}
                                error={errors.password?.message}
                                color="white"
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
                        </Flex>
                        <NextChakraLink href="/recuperar-senha">
                            <Button variant="ghost" size="xs" color="gray">
                                Esqueci minha senha
                            </Button>
                        </NextChakraLink>
                    </Flex>
                </GridItem>
            </Flex>
        </Stack>
    );
};

export default SignIn;

export const getServerSideProps = withSSRGuest<any>(async (ctx) => {
    return {
        props: {},
    };
});
