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
import { AuthContext } from "../../contexts/AuthContext";
import { withSSRGuest } from "../../utils/withSSRGuests";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdFingerprint } from "react-icons/md";
import { Input } from "../../components/Forms/Input";
import { FaFacebook, FaGoogle, FaSignInAlt } from "react-icons/fa";
import { CgPassword } from "react-icons/cg";
import BeatLoader from "react-spinners/BeatLoader";
import { NextPage } from "next";
import { Heading } from "@chakra-ui/layout";

interface CredentialsProps {
    document: string;
    password: string;
}

const schema = yup.object().shape({
    document: yup.string().required("O CPF é obrigatório"),
    password: yup.string().required("A senha é obrigatória"),
});

const SignIn: NextPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [error, setError] = useState(null);
    const { signIn } = useContext(AuthContext);
    const onSubmit: SubmitHandler<CredentialsProps> = async (data) => {
        try {
            setError(null);
            await signIn(data);
        } catch (error) {
            setError(error.message);
        }
    };
    console.log(error);
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
                        w={{ base: "100vw", lg: "full" }}
                        h="full"
                        align="center"
                        justify="center"
                        gridGap={4}
                        p={4}
                    >
                        <Box
                            display={{ base: "block", lg: "none" }}
                            px={8}
                            py={4}
                        >
                            <Heading size="4xl" display="flex" color="blue.500">
                                Imo7
                            </Heading>
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
                            leftIcon={<Icon as={MdFingerprint} w={6} h={6} />}
                            placeholder="Seu CPF"
                            {...register("document")}
                            error={errors.document?.message}
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
                        <Text>ou</Text>
                        <Button w={72} borderRadius={0} colorScheme="blue">
                            Emitir 2ª via rápída
                        </Button>
                    </VStack>
                    <VStack></VStack>
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
