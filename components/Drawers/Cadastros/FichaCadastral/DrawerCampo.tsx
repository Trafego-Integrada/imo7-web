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
    Checkbox,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { show, store, update } from "@/services/models/imobiliaria";
import { Input } from "@/components/Forms/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { FormInput } from "@/components/Form/FormInput";
import { FormTextarea } from "@/components/Form/FormTextarea";
import {
    atualizarCategoriaCampoFicha,
    buscarCategoriaCampoFicha,
    cadastrarCategoriaCampoFicha,
    listarCategoriaCampoFichas,
} from "@/services/models/categoriaCampoFicha";
import { queryClient } from "@/services/queryClient";
import {
    atualizarCampoFicha,
    buscarCampoFicha,
    cadastrarCampoFicha,
} from "@/services/models/campoFicha";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { listarCampos } from "@/services/models/campo";
import { FormAutocomplete } from "@/components/Form/FormAutocomplete";

const schema = yup.object().shape({
    nome: yup.string().required("Campo obrigatório"),
    ordem: yup.string().required("Campo obrigatório"),
});

const DrawerBase = ({}, ref) => {
    const toast = useToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const showData = useMutation(buscarCampoFicha);
    const atualizar = useMutation(atualizarCampoFicha);
    const cadastrar = useMutation(cadastrarCampoFicha);

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
                        description: "Campo cadastrado com sucesso!",
                        status: "success",
                    });
                    queryClient.invalidateQueries(["campos"]);
                },
            });
        } else {
            await cadastrar.mutateAsync(data, {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast({
                        title: "Sucesso!",
                        description: "Campo cadastrado com sucesso!",
                        status: "success",
                    });
                    queryClient.invalidateQueries(["campos"]);
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
    const { data: categorias } = useQuery(
        ["listaCategorias", {}],
        listarCategoriaCampoFichas
    );
    const { data: campos } = useQuery(["listaCampos", {}], listarCampos);
    return (
        <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="lg">
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
                                <FormSelect
                                    size="sm"
                                    label="Tipo de Ficha"
                                    {...register("tipoFicha")}
                                    error={errors.tipoFicha?.message}
                                >
                                    <option value="inquilino">Inquilino</option>
                                    <option value="proprietario">
                                        Proprietário
                                    </option>
                                    <option value="fiador">Fiador</option>
                                    <option value="imovel">Imóvel</option>
                                </FormSelect>
                            </GridItem>
                            <GridItem>
                                <Controller
                                    control={control}
                                    name="categoria"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            {...field}
                                            size="sm"
                                            label="Categoria"
                                            placeholder="Selecione..."
                                            options={categorias?.data}
                                            getOptionLabel={(e) => e.nome}
                                            getOptionValue={(e) => e.id}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem>
                                <FormSelect
                                    size="sm"
                                    label="Tipo de Campo"
                                    {...register("tipoCampo")}
                                    error={errors.tipoCampo?.message}
                                >
                                    <option value="number">Number</option>
                                    <option value="text">Text</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="select">Select</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="file">Arquivo</option>
                                    <option value="datetime-local">
                                        Data e Hora
                                    </option>
                                    <option value="date">Data</option>
                                    <option value="time">Hora</option>
                                </FormSelect>
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Codigo"
                                    {...register("codigo")}
                                    error={errors.codigo?.message}
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
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="ColSpan"
                                    {...register("colSpan")}
                                    error={errors.colSpan?.message}
                                />
                            </GridItem>
                            {(watch("tipoCampo") == "select" ||
                                watch("tipoCampo") == "radio") && (
                                <>
                                    <GridItem>
                                        <Controller
                                            control={control}
                                            name="opcoes"
                                            render={({ field }) => (
                                                <FormAutocomplete
                                                    label="Opções"
                                                    {...field}
                                                    multiple
                                                    items={[]}
                                                />
                                            )}
                                        />
                                    </GridItem>
                                </>
                            )}
                            {watch("tipoCampo") == "text" && (
                                <>
                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            label="Mascara"
                                            {...register("mask")}
                                            error={errors.mask?.message}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Checkbox
                                            size="sm"
                                            isChecked={watch("cep")}
                                            {...register("cep")}
                                            isInvalid={errors.cep?.message}
                                        >
                                            Campo de CEP
                                        </Checkbox>
                                    </GridItem>
                                    {watch("cep") && (
                                        <GridItem>
                                            <Controller
                                                control={control}
                                                name="camposEndereco.endereco"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        size="sm"
                                                        label="Campo Endereço"
                                                        placeholder="Selecione..."
                                                        options={campos?.data}
                                                        getOptionLabel={(e) =>
                                                            e.codigo +
                                                            " - " +
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                    />
                                                )}
                                            />
                                            <Controller
                                                control={control}
                                                name="camposEndereco.bairro"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        size="sm"
                                                        label="Campo Bairro"
                                                        placeholder="Selecione..."
                                                        options={campos?.data}
                                                        getOptionLabel={(e) =>
                                                            e.codigo +
                                                            " - " +
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                    />
                                                )}
                                            />
                                            <Controller
                                                control={control}
                                                name="camposEndereco.cidade"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        size="sm"
                                                        label="Campo Cidade"
                                                        placeholder="Selecione..."
                                                        options={campos?.data}
                                                        getOptionLabel={(e) =>
                                                            e.codigo +
                                                            " - " +
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                    />
                                                )}
                                            />
                                            <Controller
                                                control={control}
                                                name="camposEndereco.estado"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        size="sm"
                                                        label="Campo Estado"
                                                        placeholder="Selecione..."
                                                        options={campos?.data}
                                                        getOptionLabel={(e) =>
                                                            e.codigo +
                                                            " - " +
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                    />
                                                )}
                                            />
                                        </GridItem>
                                    )}
                                </>
                            )}
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

export const DrawerCampo = forwardRef(DrawerBase);
