import {
    Alert,
    Box,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
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
import { Site } from "@/components/Layouts/Site";
import { NextChakraLink } from "@/components/NextChakraLink";
import { useAuth } from "@/hooks/useAuth";
interface CredentialsProps {
    email: string;
    password: string;
}

const schema = yup.object().shape({
    documento: yup.string().required("O CPF é obrigatório"),
});

const SignIn: NextPage = () => {
    const [enviado, setEnviado] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [error, setError] = useState(null);
    const { recuperarSenha } = useAuth();
    const onSubmit: SubmitHandler<CredentialsProps> = async (data) => {
        try {
            setError(null);
            const response = await recuperarSenha(data);
            //console.log(response);
            setEnviado(true);
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
                            Recuperar senha
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
                        {enviado && (
                            <Alert>
                                Confira sua caixa de entrada, e siga os passos.
                            </Alert>
                        )}
                        <Input
                            w={96}
                            leftIcon={<Icon as={MdFingerprint} w={6} h={6} />}
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
                            Recuperar senha
                        </Button>
                        <NextChakraLink href="/login">
                            <Button variant="ghost" size="xs">
                                Voltar para login
                            </Button>
                        </NextChakraLink>
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
