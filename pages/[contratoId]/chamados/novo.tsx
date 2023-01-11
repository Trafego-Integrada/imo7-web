import { FormTextarea } from "@/components/Form/FormTextarea";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/textarea";
import { NextPage } from "next";
import { Input } from "@/components/Forms/Input";
import { Select } from "@/components/Forms/Select";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { cadastrarChamado } from "@/services/models/chamado";
import { listarDepartamentos } from "@/services/models/departamento";
import { listarAssuntos } from "@/services/models/assunto";
import { watch } from "fs";
import { useRouter } from "next/router";
const schema = yup.object({
    departamento: yup.string().required("Campo Obrigatório"),
    assunto: yup.string().required("Campo Obrigatório"),
    titulo: yup.string().required("Campo Obrigatório"),
    mensagem: yup.string().required("Campo Obrigatório"),
});

const AbrirChamado: NextPage = () => {
    const router = useRouter();
    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const cadastrar = useMutation(cadastrarChamado);
    const onSubmit = async (data) => {
        try {
            const response = await cadastrar.mutateAsync({
                ...data,
                contratoId: router.query.contratoId,
            });
            router.replace({
                pathname: `/[contratoId]/chamados/[id]`,
                query: {
                    contratoId: router.query?.contratoId,
                    id: response.id,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };
    const { data: departamentos } = useQuery(
        ["departamentos"],
        listarDepartamentos
    );
    const { data: assuntos } = useQuery(
        ["assuntos", { departamentoId: watch("departamento")?.id }],
        listarAssuntos
    );
    return (
        <LayoutPainel>
            <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                bg="white"
                p={4}
                rounded="lg"
            >
                <Flex flexDirection="column" align="center">
                    <Heading size="lg" textAlign="center" color="gray.600">
                        Abertura de chamado
                    </Heading>
                    <Text
                        my={2}
                        maxW={"2xl"}
                        textAlign="center"
                        color="gray.500"
                        fontSize="xs"
                        lineHeight="none"
                    >
                        Aqui, você poderá abrir um chamado à imobiliria, para
                        resolução de problemas, dúvidas entre outros assuntos
                        relacionados ao seu contrato.
                    </Text>
                </Flex>
                <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                        <Select
                            placeholder="Departamento"
                            error={errors.departamento?.message}
                            {...register("departamento")}
                        >
                            {departamentos?.data?.data?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.titulo}
                                </option>
                            ))}
                        </Select>
                    </GridItem>
                    <GridItem>
                        <Select
                            placeholder="Assunto"
                            error={errors.assunto?.message}
                            {...register("assunto")}
                            isDisabled={watch("departamento") ? false : true}
                        >
                            {assuntos?.data?.data?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.titulo}
                                </option>
                            ))}
                        </Select>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <Input
                            placeholder="Titulo"
                            error={errors.titulo?.message}
                            {...register("titulo")}
                        />
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormTextarea
                            placeholder="Mensagem"
                            error={errors.mensagem?.message}
                            {...register("mensagem")}
                        />
                    </GridItem>
                </Grid>
                <Flex justify="right" mt={4}>
                    <Button
                        colorScheme="blue"
                        variant="solid"
                        isLoading={isSubmitting}
                        type="submit"
                    >
                        Enviar mensagem
                    </Button>
                </Flex>
            </Box>
        </LayoutPainel>
    );
};

export default AbrirChamado;
