import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { listarDepartamentos } from "@/services/models/departamento";
import { listarPessoas } from "@/services/models/pessoa";

import {
    atualizarTarefa,
    buscarTarefa,
    cadastrarTarefa,
} from "@/services/models/tarefa";
import { listarUsuarios } from "@/services/models/usuario";
import { queryClient } from "@/services/queryClient";
import {
    Button,
    Grid,
    GridItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

const schema = yup.object({
    titulo: yup.string().required("Campo Obrigatório"),
});

const ModalBase = ({ chamadoId }, ref) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const buscar = useMutation(buscarTarefa, {
        onSuccess: (data) => {
            reset({
                ...data,
                dataVencimento: data.dataVencimento
                    ? moment(data.dataVencimento).format("YYYY-MM-DD HH:mm")
                    : null,
                dataEntrega: data.dataEntrega
                    ? moment(data.dataEntrega).format("YYYY-MM-DD HH:mm")
                    : null,
            });
            onOpen();
        },
    });
    const cadastrar = useMutation(cadastrarTarefa, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tarefas"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
        },
    });
    const atualizar = useMutation(atualizarTarefa, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tarefas"]);
            toast({ title: "Atualizado com sucesso", status: "success" });
            onClose();
        },
    });

    const onSubmit = async (data) => {
        console.log(data);
        try {
            if (data.id) {
                await atualizar.mutateAsync(data);
            } else {
                await cadastrar.mutateAsync({ ...data, chamadoId });
            }
        } catch (error) {
            console.log(error);
            toast({ title: "Ocorreu um erro", status: "error" });
        }
    };

    useImperativeHandle(ref, () => ({
        onOpen: async (id = null) => {
            if (id) {
                await buscar.mutateAsync(id);
            } else {
                reset({});
                onOpen();
            }
        },
    }));
    const { data: responsaveis } = useQuery(
        ["responsaveis", { admImobiliaria: true }],
        listarUsuarios
    );
    const { data: departamentos } = useQuery(
        ["departamentos", {}],
        listarDepartamentos
    );
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Tarefa <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Grid
                            gap={5}
                            templateColumns={{
                                sm: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(4, 1fr)",
                            }}
                            as="form"
                            id="formPessoa"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <GridItem colSpan={{ lg: 4 }}>
                                <FormInput
                                    size="sm"
                                    label="Titulo"
                                    placeholder="..."
                                    {...register("titulo")}
                                    error={errors.titulo?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Tipo de Serviço"
                                    placeholder="..."
                                    {...register("tipoServico")}
                                    error={errors.tipoServico?.message}
                                />
                            </GridItem>

                            <GridItem>
                                <Controller
                                    control={control}
                                    name="responsaveis"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            size="sm"
                                            label="Responsáveis"
                                            placeholder="..."
                                            isMulti
                                            options={responsaveis?.data?.data}
                                            getOptionLabel={(e) => e.nome}
                                            getOptionValue={(e) => e.id}
                                            error={errors.responsaveis?.message}
                                            {...field}
                                        />
                                    )}
                                />
                            </GridItem>

                            <GridItem>
                                <Controller
                                    control={control}
                                    name="membros"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            size="sm"
                                            label="Membros"
                                            placeholder="..."
                                            isMulti
                                            options={responsaveis?.data?.data}
                                            getOptionLabel={(e) => e.nome}
                                            getOptionValue={(e) => e.id}
                                            error={errors.responsaveis?.message}
                                            {...field}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem>
                                <Controller
                                    control={control}
                                    name="departamento"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            size="sm"
                                            label="Departamento"
                                            placeholder="..."
                                            options={departamentos?.data?.data}
                                            getOptionLabel={(e) => e.titulo}
                                            getOptionValue={(e) => e.id}
                                            error={errors.departamento?.message}
                                            {...field}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem colSpan={{ lg: 4 }}>
                                <FormTextarea
                                    size="sm"
                                    label="Descrição"
                                    placeholder="..."
                                    {...register("descricao")}
                                    error={errors.descricao?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Prioridade"
                                    placeholder="..."
                                    {...register("prioridade")}
                                    error={errors.prioridade?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    type="datetime-local"
                                    size="sm"
                                    label="Vencimento"
                                    placeholder="..."
                                    {...register("dataVencimento")}
                                    error={errors.dataVencimento?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    type="datetime-local"
                                    size="sm"
                                    label="Data da Entrega"
                                    placeholder="..."
                                    {...register("dataEntrega")}
                                    error={errors.dataEntrega?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormSelect
                                    size="sm"
                                    label="Status"
                                    placeholder="..."
                                    {...register("status")}
                                    error={errors.status?.message}
                                >
                                    <option value="aberta">Aberta</option>
                                    <option value="finalizada">
                                        Finalizada
                                    </option>
                                </FormSelect>
                            </GridItem>
                        </Grid>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Fechar
                        </Button>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            type="submit"
                            isLoading={isSubmitting}
                            form="formPessoa"
                        >
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalTarefa = forwardRef(ModalBase);
