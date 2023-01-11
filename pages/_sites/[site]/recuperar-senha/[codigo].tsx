import {
    Alert,
    AlertIcon,
    Button,
    Container,
    Flex,
    GridItem,
    Heading,
    Icon,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { withSSRGuest } from "@/utils/withSSRGuests";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/Forms/Input";
import { CgPassword } from "react-icons/cg";
import { NextPage } from "next";
import { Site } from "@/components/Layouts/Site";
import { BiRefresh } from "react-icons/bi";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { NextChakraLink } from "@/components/NextChakraLink";
interface CredentialsProps {
    email: string;
    password: string;
}

const schema = yup.object().shape({
    password: yup
        .string()
        .required("A senha é obrigatória")
        .min(8, "Deve ter no mínimo 8 digitos"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "As senhas devem ser iguais")
        .required("A senha é obrigatória"),
});

const SignIn: NextPage = () => {
    const router = useRouter();
    const [sucesso, setSucesso] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [error, setError] = useState(null);
    const { redefinirSenha } = useAuth();
    const onSubmit: SubmitHandler<CredentialsProps> = async (data) => {
        try {
            setError(null);
            const res = await redefinirSenha({
                ...data,
                codigo: router.query.codigo,
            });
            console.log(res);
            if (res.status == 200) {
                setSucesso(true);
            }
        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <Stack bg="gray.50" w="100vw" h="100vh">
            <Grid templateColumns="repeat(2, 1fr)" w="full" h="full">
                <GridItem
                    display={{ base: "none", lg: "flex" }}
                    bg="blue.500"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                >
                    <Heading size="4xl" display="flex" color="white">
                        Imo7
                    </Heading>
                </GridItem>
                <GridItem w="full">
                    <VStack
                        as="form"
                        onSubmit={handleSubmit(onSubmit)}
                        h="full"
                        align="center"
                        justify="center"
                        gridGap={4}
                        p={4}
                    >
                        <Text fontSize="xl" mb={8}>
                            Redefinir senha
                        </Text>
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
                        {!sucesso ? (
                            <>
                                <Input
                                    type="password"
                                    w={96}
                                    leftIcon={
                                        <Icon as={CgPassword} w={6} h={6} />
                                    }
                                    placeholder="Nova senha"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                <Input
                                    type="password"
                                    w={96}
                                    leftIcon={
                                        <Icon as={CgPassword} w={6} h={6} />
                                    }
                                    placeholder="Confirmar senha"
                                    {...register("confirmPassword")}
                                    error={errors.confirmPassword?.message}
                                />
                                <Button
                                    type="submit"
                                    borderRadius={0}
                                    colorScheme="blue"
                                    rightIcon={<Icon as={BiRefresh} />}
                                    isLoading={isSubmitting}
                                >
                                    Redefinir senha
                                </Button>
                            </>
                        ) : (
                            <>
                                <Alert
                                    status="success"
                                    variant="top-accent"
                                    flexDir="column"
                                    textAlign="center"
                                >
                                    <AlertIcon />
                                    Senha atualizada com sucesso, você já pode
                                    acessar sua conta
                                </Alert>
                                <NextChakraLink href="/entrar">
                                    <Button colorScheme="blue" rounded="none">
                                        Fazer login
                                    </Button>
                                </NextChakraLink>
                            </>
                        )}
                    </VStack>
                </GridItem>
            </Grid>
        </Stack>
    );
};

export default SignIn;

export const getServerSideProps = withSSRGuest<any>(async (ctx) => {
    return {
        props: {},
    };
});
