import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import {
    atualizarReguaCobranca,
    buscarReguaCobranca,
    cadastrarReguaCobranca,
} from "@/services/models/reguaCobranca";

import {
    atualizarTagTarefa,
    buscarTagTarefa,
    cadastrarTagTarefa,
} from "@/services/models/tagTarefa";
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
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

const schema = yup.object({
    tipoEnvio: yup.string().required("Campo Obrigatório"),
    formaEnvio: yup.string().required("Campo Obrigatório"),
    assunto: yup.string().required("Campo Obrigatório"),
    conteudo: yup.string().required("Campo Obrigatório"),
});

const ModalBase = ({ tipo = "boleto" }, ref) => {
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
    const buscar = useMutation(buscarReguaCobranca, {
        onSuccess: (data) => {
            reset(data);
            onOpen();
        },
    });
    const cadastrar = useMutation(cadastrarReguaCobranca, {
        onSuccess: () => {
            queryClient.invalidateQueries(["reguasCobranca"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
        },
    });
    const atualizar = useMutation(atualizarReguaCobranca, {
        onSuccess: () => {
            queryClient.invalidateQueries(["reguasCobranca"]);
            toast({ title: "Atualizado com sucesso", status: "success" });
            onClose();
        },
    });

    const onSubmit = async (data) => {
        try {
            if (data.id) {
                await atualizar.mutateAsync({ ...data, tipo });
            } else {
                await cadastrar.mutateAsync({ ...data, tipo });
            }
        } catch (error) {
            toast({
                title: "Ocorreu um erro",
                description: error.response?.data?.message,
                status: "error",
            });
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

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Regua de Cobrança <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Grid
                            gap={5}
                            templateColumns={{
                                sm: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                            }}
                            as="form"
                            id="formRegua"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <GridItem>
                                <FormSelect
                                    size="sm"
                                    label="Forma de Envio"
                                    placeholder="Selecione a forma de envio"
                                    {...register("formaEnvio")}
                                    error={errors.formaEnvio?.message}
                                >
                                    <option value="email">E-mail</option>
                                    <option value="whatsapp">Whatsapp</option>
                                </FormSelect>
                            </GridItem>
                            <GridItem>
                                <FormSelect
                                    size="sm"
                                    label="Tipo de Envio"
                                    placeholder="Selecione a forma de envio"
                                    {...register("tipoEnvio")}
                                    error={errors.tipoEnvio?.message}
                                >
                                    <option value="antesVencimento">
                                        Antes do Vencimento
                                    </option>
                                    <option value="diaVencimento">
                                        Dia do Vencimento
                                    </option>
                                </FormSelect>
                            </GridItem>
                            {watch("tipoEnvio") == "antesVencimento" && (
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Dias antes do vencimento"
                                        placeholder="Informe os dias antes do vencimento"
                                        {...register("dias")}
                                        error={errors.dias?.message}
                                    />
                                </GridItem>
                            )}

                            <GridItem colSpan={{ lg: 3 }}>
                                <FormInput
                                    size="sm"
                                    label="Assunto"
                                    placeholder="..."
                                    {...register("assunto")}
                                    error={errors.assunto?.message}
                                />
                            </GridItem>
                            <GridItem colSpan={{ lg: 3 }}>
                                <FormTextarea
                                    size="sm"
                                    label="Conteudo"
                                    placeholder="..."
                                    {...register("conteudo")}
                                    error={errors.conteudo?.message}
                                />
                            </GridItem>
                        </Grid>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            Fechar
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="blue"
                            mr={3}
                            type="submit"
                            isLoading={isSubmitting}
                            form="formRegua"
                        >
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalReguaCobranca = forwardRef(ModalBase);
