import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Flex,
    Grid,
    GridItem,
    Heading,
    Text,
    useDisclosure,
    Button,
    Spinner,
    toast,
    useToast,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Box,
    Switch,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { show, store, update } from "@/services/models/imobiliaria";
import { Input } from "@/components/Forms/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { getAll as getAllContas, listarContas } from "@/services/models/conta";
import { Select } from "@/components/Forms/Select";
import { TabelaUsuarios } from "@/components/Tabelas/Usuarios";
import { FormInput } from "@/components/Form/FormInput";
import { FormTextarea } from "@/components/Form/FormTextarea";
import {
    atualizarCategoriaCampoFicha,
    buscarCategoriaCampoFicha,
    cadastrarCategoriaCampoFicha,
} from "@/services/models/categoriaCampoFicha";
import { queryClient } from "@/services/queryClient";
import { imo7ApiService } from "@/services/apiServiceUsage";

const schema = yup.object().shape({
    nome: yup.string().required("Campo obrigatório"),
});

const ModalBase = ({}, ref) => {
    const toast = useToast();
    const { usuario } = useAuth();
    const { data: contas } = useQuery(["contas"], listarContas);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const showData = useMutation(imo7ApiService("motivoReprovacao").get);
    const atualizar = useMutation(imo7ApiService("motivoReprovacao").update);
    const cadastrar = useMutation(imo7ApiService("motivoReprovacao").create);

    const onShow = async (id) => {
        await showData.mutateAsync(id, {
            onSuccess: (data) => {
                reset(data);
            },
        });
    };

    const onSubmit = async (data) => {
        if (data.id) {
            await atualizar.mutateAsync(data, {
                onSuccess: () => {
                    toast({
                        title: "Sucesso!",
                        description: "Motivo atualizado com sucesso!",
                        status: "success",
                    });
                    queryClient.invalidateQueries(["motivosReprovacao"]);
                },
            });
        } else {
            await cadastrar.mutateAsync(data, {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast({
                        title: "Sucesso!",
                        description: "Motivo cadastrado com sucesso!",
                        status: "success",
                    });
                    queryClient.invalidateQueries(["motivosReprovacao"]);
                },
            });
        }
    };

    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            reset({});
            if (id) {
                onShow(id);
            }
            reset();
            onOpen();
        },
    }));
    return (
        <Modal isOpen={isOpen} onClose={onClose} placement="right">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Motivo de Reprovação
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody
                    as="form"
                    id="motivo-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box>
                        <Grid gridTemplateColumns="repeat(1, 1fr)" gap={4}>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Nome"
                                    {...register("nome")}
                                    error={errors.nome?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <Switch
                                    {...register("ativo")}
                                    isChecked={watch("ativo")}
                                >
                                    Ativo
                                </Switch>
                            </GridItem>
                        </Grid>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button
                        type="submit"
                        form="motivo-form"
                        colorScheme="blue"
                        isLoading={isSubmitting}
                    >
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const ModalMotivoReprovacao = forwardRef(ModalBase);
