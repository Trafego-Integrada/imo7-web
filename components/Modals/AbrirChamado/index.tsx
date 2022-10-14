import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { Input } from "@/components/Forms/Input";
import { Select } from "@/components/Forms/Select";
import { listarAssuntos } from "@/services/models/assunto";
import {
    cadastrarChamado,
    iniciarConversaChamado,
} from "@/services/models/chamado";
import {
    listarContratos,
    listarParticipantesContratos,
} from "@/services/models/contrato";
import { listarDepartamentos } from "@/services/models/departamento";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
const schema = yup.object({
    participantes: yup.array().required("Campo Obrigatório"),
    departamento: yup.string().required("Campo Obrigatório"),
    assunto: yup.string().required("Campo Obrigatório"),
    titulo: yup.string().required("Campo Obrigatório"),
    mensagem: yup.string().required("Campo Obrigatório"),
});
const ModalBase = ({}, ref) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast();
    const router = useRouter();
    const {
        register,
        control,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const cadastrar = useMutation(cadastrarChamado);
    const onSubmit = async (data) => {
        try {
            const response = await cadastrar.mutateAsync({
                ...data,
                contratoId: data.contrato?.id,
            });
            onClose();
            toast({ title: "Chamado aberto", status: "success" });
            queryClient.invalidateQueries(["chamados"]);
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
    const { data: contratos } = useQuery(["contratos"], listarContratos);
    const { data: participantes } = useQuery(
        [
            "participantesContrato",
            {
                contratoId: watch("contrato")?.id,
            },
        ],
        listarParticipantesContratos
    );
    useImperativeHandle(ref, () => ({
        onOpen: () => {
            reset({});
            onOpen();
        },
    }));
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Adicionar Conversa</ModalHeader>
                <ModalBody
                    id="formAbrirChamado"
                    as="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box bg="white" p={4} rounded="lg">
                        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
                            <GridItem colSpan={2}>
                                <Controller
                                    control={control}
                                    name="contrato"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            {...field}
                                            options={contratos?.data?.data}
                                            placeholder="Contrato"
                                            error={errors.contrato?.message}
                                            getOptionLabel={(e) =>
                                                `${e.codigo} - ${e.imovel?.endereco}`
                                            }
                                            getOptionValue={(e) => e.id}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem colSpan={2}>
                                <Controller
                                    control={control}
                                    name="participantes"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            {...field}
                                            isMulti
                                            options={
                                                participantes && participantes
                                            }
                                            getOptionLabel={(e) =>
                                                e.nome +
                                                (e.contratosInquilino.length
                                                    ? " (Inquilino)"
                                                    : e.contratosProprietario
                                                          .length
                                                    ? " (Proproprietário)"
                                                    : e.contratosFiador.length
                                                    ? " (Fiador)"
                                                    : "?")
                                            }
                                            getOptionValue={(e) => e.id}
                                            placeholder="Selecione os participantes"
                                            error={
                                                errors.participantes?.message
                                            }
                                        />
                                    )}
                                />
                            </GridItem>
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
                                    isDisabled={
                                        watch("departamento") ? false : true
                                    }
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
                        <Flex justify="right" mt={4}></Flex>
                    </Box>
                </ModalBody>
                <ModalFooter gridGap={4}>
                    <Button onClick={() => onClose()}>Desistir</Button>
                    <Button
                        colorScheme="blue"
                        variant="solid"
                        isLoading={isSubmitting}
                        type="submit"
                        form="formAbrirChamado"
                    >
                        Abrir Chamado
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const ModalAbrirChamado = forwardRef(ModalBase);
