import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { listarAssuntos } from "@/services/models/assunto";
import { atualizarChamado } from "@/services/models/chamado";
import { listarContratos } from "@/services/models/contrato";
import { listarDepartamentos } from "@/services/models/departamento";
import { listarUsuarios } from "@/services/models/usuario";
import { queryClient } from "@/services/queryClient";
import { Box, Flex, Grid, GridItem, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useRouter } from "next/router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { Historico } from "./Historico";
const schema = yup.object({
    responsavel: yup.object().required("Campo Obrigatório"),
    participantes: yup.array().required("Campo Obrigatório"),
    departamento: yup.object().required("Campo Obrigatório"),
    assunto: yup.object().required("Campo Obrigatório"),
});
export const LinhaDoTempo = ({ chamado }) => {
    const form = useRef();
    const historicos = [{}, {}, {}];
    const toast = useToast();
    const router = useRouter();
    const {
        register,
        control,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            ...chamado,
            departamento: chamado?.assunto?.departamento,
        },
    });

    const atualizar = useMutation(atualizarChamado);
    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await atualizar.mutateAsync({
                ...data,
            });
            toast({ title: "Chamado atualizado", status: "success" });
            queryClient.invalidateQueries(["chamados"]);
        } catch (error) {
            //console.log(error);
        }
    });
    const { data: responsaveis } = useQuery(
        ["responsaveis", { admImobiliaria: true, status: true }],
        listarUsuarios
    );
    const { data: departamentos } = useQuery(
        ["departamentos"],
        listarDepartamentos
    );
    const { data: assuntos } = useQuery(
        ["assuntos", { departamentoId: watch("departamento")?.id }],
        listarAssuntos
    );
    const { data: contratos } = useQuery(["contratos"], listarContratos);
    const submitForm = () => {
        //Currently not calling the submit on the form
        form.current.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
        );
    };
    return (
        <Box>
            <Grid gridTemplateColumns={{ lg: "repeat(4,1fr)" }} gap={4}>
                <GridItem ref={form} as="form" onSubmit={onSubmit}>
                    <Flex
                        flexDir="column"
                        justifyContent="space-between"
                        h="full"
                        gap={6}
                    >
                        <Grid gap={4}>
                            <GridItem>
                                <Controller
                                    control={control}
                                    name="departamento"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            label="Departamento"
                                            size="sm"
                                            {...field}
                                            options={departamentos?.data?.data}
                                            getOptionLabel={(e) => e.titulo}
                                            getOptionValue={(e) => e.id}
                                            placeholder="Selecione o departamento"
                                            error={
                                                errors.participantes?.message
                                            }
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem>
                                <Controller
                                    control={control}
                                    name="assunto"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            label="Assunto"
                                            size="sm"
                                            {...field}
                                            options={assuntos?.data?.data}
                                            getOptionLabel={(e) => e.titulo}
                                            getOptionValue={(e) => e.id}
                                            placeholder="Selecione o assunto"
                                            error={errors.assunto?.message}
                                            isDisabled={
                                                watch("departamento")
                                                    ? false
                                                    : true
                                            }
                                            onBlur={submitForm}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem>
                                <Controller
                                    control={control}
                                    name="participantes"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            label="Participantes"
                                            size="sm"
                                            {...field}
                                            isMulti
                                            options={responsaveis?.data?.data}
                                            getOptionLabel={(e) => e.nome}
                                            getOptionValue={(e) => e.id}
                                            placeholder="Selecione os participantes"
                                            error={
                                                errors.participantes?.message
                                            }
                                            onBlur={submitForm}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem>
                                <Controller
                                    control={control}
                                    name="responsavel"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            label="Responsável"
                                            size="sm"
                                            {...field}
                                            options={responsaveis?.data?.data}
                                            getOptionLabel={(e) => e.nome}
                                            getOptionValue={(e) => e.id}
                                            placeholder="Selecione os participantes"
                                            error={errors.responsavel?.message}
                                            onBlur={submitForm}
                                        />
                                    )}
                                />
                            </GridItem>

                            <FormSelect
                                size="sm"
                                label="Status"
                                placeholder="Status"
                                {...register("status")}
                                onBlur={submitForm}
                            >
                                <option value="ABERTO">Aberto</option>
                                <option value="EM_ATENDIMENTO">
                                    Em Atendimento
                                </option>
                                <option value="FINALIZADO">Finalizado</option>

                                <option value="ARQUIVADO">Arquivado</option>
                            </FormSelect>
                        </Grid>
                        <Box>
                            <Text fontSize="xs" mb={2} color="gray">
                                Chamado aberto por:
                            </Text>
                            <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="gray.600"
                            >
                                {chamado?.criador?.nome} <br />
                                {moment(chamado?.createdAt).format(
                                    "DD/MM/YYYY HH:mm"
                                )}
                            </Text>
                        </Box>
                    </Flex>
                </GridItem>
                <GridItem colSpan={{ lg: 3 }}>
                    <Historico chamadoId={watch("id")} />
                </GridItem>
            </Grid>
        </Box>
    );
};
