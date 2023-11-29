import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import {
    Box,
    Button,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    useToast,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import { useMutation } from "react-query";
import { atualizarUsuario, buscarUsuario } from "@/services/models/usuario";
import { FormInput } from "@/components/Form/FormInput";
import { useAuth } from "@/hooks/useAuth";
const schema = yup.object().shape({
    nome: yup.string().required("O CPF é obrigatório"),
    email: yup.string().required("O CPF é obrigatório"),
    senha: yup.string(),
    confirmarSenha: yup
        .string()
        .oneOf([yup.ref("senha"), null], "A senha deve ser a mesma"),
});
const Page = () => {
    const toast = useToast();
    const { usuario } = useAuth();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [error, setError] = useState(null);
    const buscar = useMutation(buscarUsuario, {
        onSuccess: (data) => {
            reset({ ...data });
        },
    });
    const update = useMutation(atualizarUsuario);
    const onSubmit = async (data) => {
        console.log(data);
        try {
            setError(null);
            await update.mutateAsync(data);
            toast({
                title: "Dados atualizados",
                status: "success",
                containerStyle: {
                    zIndex: 999999,
                },
                position: "bottom-right",
            });
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        buscar.mutate(usuario.id);
    }, [usuario]);
    return (
        <LayoutPainel>
            <Container as="form" onSubmit={handleSubmit(onSubmit)}>
                <Box bg="white" p={4}>
                    <Heading size="sm">Informações Pessoais</Heading>
                    <Divider mb={4} />
                    <Grid
                        gap={4}
                        gridTemplateColumns={{
                            base: "repeat(1,1fr)",
                            lg: "repeat(2,1fr)",
                        }}
                    >
                        <GridItem>
                            <FormInput
                                label="Nome"
                                {...register("nome")}
                                error={errors.nome?.message}
                            />
                        </GridItem>
                        <GridItem>
                            <FormInput
                                label="E-mail"
                                {...register("email")}
                                error={errors.email?.message}
                            />
                        </GridItem>
                        <GridItem>
                            <FormInput
                                label="CPF"
                                {...register("documento")}
                                error={errors.documento?.message}
                                disabled
                            />
                        </GridItem>
                        <GridItem>
                            <FormInput
                                label="Telefone"
                                {...register("telefone")}
                                error={errors.telefone?.message}
                            />
                        </GridItem>
                        <GridItem>
                            <FormInput
                                label="Celular"
                                {...register("celular")}
                                error={errors.celular?.message}
                            />
                        </GridItem>
                        <GridItem>
                            <FormInput
                                label="Profissão"
                                {...register("profissao")}
                                error={errors.profissao?.message}
                            />
                        </GridItem>
                    </Grid>
                </Box>
                <Box mt={2} bg="white" p={4}>
                    <Heading size="sm">Atualizar Senha</Heading>
                    <Divider mb={4} />
                    <Grid
                        gap={4}
                        gridTemplateColumns={{
                            base: "repeat(1,1fr)",
                            lg: "repeat(2,1fr)",
                        }}
                    >
                        <GridItem>
                            <FormInput
                                label="Senha"
                                {...register("senha")}
                                error={errors.senha?.message}
                            />
                        </GridItem>
                        <GridItem>
                            <FormInput
                                label="Confirmar Senha"
                                {...register("confirmarSenha")}
                                error={errors.confirmarSenha?.message}
                            />
                        </GridItem>
                    </Grid>
                </Box>
                <Flex mt={4}>
                    <Button
                        colorScheme="blue"
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        Salvar
                    </Button>
                </Flex>
            </Container>
        </LayoutPainel>
    );
};
export default Page;
