import { FormInput } from "@/components/Form/FormInput";
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
import {
    atualizarFicha,
    buscarFicha,
    cadastrarFicha,
} from "@/services/models/fichaCadastral";
import { listarFichas } from "@/services/models/modeloFicha";
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
    const buscar = useMutation(buscarFicha);
    const cadastrar = useMutation(cadastrarFicha);
    const atualizar = useMutation(atualizarFicha);
    const onSubmit = async (data) => {
        try {
            if (data.id) {
                await cadastrar.mutateAsync(data);
                onClose();
                toast({ title: "Ficha Cadastrada", status: "success" });
                queryClient.invalidateQueries(["fichas"]);
            } else {
                await cadastrar.mutateAsync(data);
                onClose();
                toast({ title: "Ficha Cadastrada", status: "success" });
                queryClient.invalidateQueries(["fichas"]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const { data: modelos } = useQuery(["modelosFichas"], listarFichas);

    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            reset({});
            if (id) {
                onOpen();
            } else {
                onOpen();
            }
        },
    }));
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Ficha Cadastral</ModalHeader>
                <ModalBody
                    id="formFichaCadastral"
                    as="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box bg="white" p={4} rounded="lg">
                        <Grid gridTemplateColumns="repeat(1, 1fr)" gap={4}>
                            <GridItem>
                                <Controller
                                    control={control}
                                    name="contrato"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            {...field}
                                            label="Ficha Cadastral"
                                            options={modelos?.data}
                                            placeholder="Selecione..."
                                            error={errors.contrato?.message}
                                            getOptionLabel={(e) =>
                                                `${e.tipo} - ${e.nome}`
                                            }
                                            getOptionValue={(e) => e.id}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="Descrição"
                                    placeholder="Descrição"
                                    error={errors.descricao?.message}
                                    {...register("descricao")}
                                    descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="Nome / Razão Social"
                                    placeholder="nome"
                                    error={errors.nome?.message}
                                    {...register("nome")}
                                    descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="CPF/CNPJ"
                                    placeholder="CPF/CNPJ"
                                    error={errors.documento?.message}
                                    {...register("documento")}
                                    descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="E-mail"
                                    placeholder="e-mail"
                                    error={errors.email?.message}
                                    {...register("email")}
                                    descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label="Telefone / Celular"
                                    placeholder="Telefone"
                                    error={errors.telefone?.message}
                                    {...register("telefone")}
                                    descricao="Utilize este campo para te auxiliar a identificar a ficha"
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
                        form="formFichaCadastral"
                    >
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const ModalFichaCadastral = forwardRef(ModalBase);
