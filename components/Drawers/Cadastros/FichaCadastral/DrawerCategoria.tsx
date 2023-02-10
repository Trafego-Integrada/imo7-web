import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
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

const schema = yup.object().shape({
    nome: yup.string().required("Campo obrigatório"),
    ordem: yup.string().required("Campo obrigatório"),
});

const DrawerBase = ({}, ref) => {
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

    const showData = useMutation(buscarCategoriaCampoFicha);
    const atualizar = useMutation(atualizarCategoriaCampoFicha);
    const cadastrar = useMutation(cadastrarCategoriaCampoFicha);

    const onShow = async (id) => {
        await showData.mutateAsync(id, {
            onSuccess: (data) => {
                reset(data);
            },
        });
    };

    const { mutateAsync: buscarCep, isLoading } = useMutation(
        async (cep) => {
            const { data } = await axios.get(
                "https://viacep.com.br/ws/" + cep + "/json/"
            );
            return data;
        },
        {
            onSuccess: (data) => {
                reset({
                    ...watch,
                    endereco: data.logradouro,
                    bairro: data.bairro,
                    estado: data.uf,
                    cidade: data.localidade,
                });
            },
        }
    );

    const handleBuscarCep = (cep) => {
        if (cep.length === 9) {
            buscarCep(cep);
        }
    };

    const onSubmit = async (data) => {
        if (data.id) {
            await atualizar.mutateAsync(data, {
                onSuccess: () => {
                    toast({
                        title: "Sucesso!",
                        description: "Categoria atualizada com sucesso!",
                        status: "success",
                    });
                    queryClient.invalidateQueries(["categoriasCampo"]);
                },
            });
        } else {
            await cadastrar.mutateAsync(data, {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast({
                        title: "Sucesso!",
                        description: "Categoria cadastrada com sucesso!",
                        status: "success",
                    });
                    queryClient.invalidateQueries(["categoriasCampo"]);
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
        <Drawer isOpen={isOpen} onClose={onClose} placement="right">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>
                    Categorias de Campos
                    <DrawerCloseButton />
                </DrawerHeader>
                <DrawerBody
                    as="form"
                    id="categoria-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box>
                        <Grid gridTemplateColumns="repeat(1, 1fr)" gap={4}>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Ordem de Exibição"
                                    {...register("ordem")}
                                    error={errors.ordem?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Nome"
                                    {...register("nome")}
                                    error={errors.nome?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormTextarea
                                    size="sm"
                                    label="Descrição"
                                    {...register("descricao")}
                                    error={errors.descricao?.message}
                                />
                            </GridItem>
                        </Grid>
                    </Box>
                </DrawerBody>
                <DrawerFooter>
                    <Button
                        type="submit"
                        form="categoria-form"
                        colorScheme="blue"
                        isLoading={isSubmitting}
                    >
                        Salvar
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export const DrawerCategoria = forwardRef(DrawerBase);
