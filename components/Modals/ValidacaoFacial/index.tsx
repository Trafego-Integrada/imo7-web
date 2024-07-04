import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { listarCategoriaCampoFichas } from "@/services/models/categoriaCampoFicha";
import {
    atualizarFicha,
    buscarFicha,
    cadastrarFicha,
} from "@/services/models/fichaCadastral";
import { listarFichas } from "@/services/models/";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiDownload, FiEdit, FiEye, FiPlus } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

import React, { useState } from "react";
import { FormInput } from "../../Form/FormInput";
import { listarImoveis } from "@/services/models/imovel";
import { cadastrarValidacao } from "@/services/models/validacaofacial";
import { ModalImovel } from "../ModalImovel";
import { validateCPF } from "@/utils/validateCPF";

const schema = yup.object({
    nome: yup.string().default(null).nullable(),
    imovel: yup.string().default(null).nullable(),
    cpf: yup.string().default('').required('Campo obrigatório'),
});

const ModalBase = ({ }, ref) => {
    const [query, setQuery] = useState<string | null>(null)
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast()
    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: {
            isSubmitting,
            errors
        },
        control,
        watch
    } = useForm({
        resolver: yupResolver(schema)
    });

    const { data } = useQuery<{
        data: {
            data: {
                id: number,
                endereco: string,
                numero: string,
                bairro: string,
                cidade: string,
                estado: string,
            }[]
        }
    }>(['imoveis', { query }], listarImoveis)
    const modalImovel = useRef()

    const cadastrarValidacaoFacial = useMutation(cadastrarValidacao)

    const onSubmit = async ({ imovelId, cpf, nome }: any) => {
        try {
            if (!validateCPF(cpf)) {
                return toast({
                    title: 'Cpf inválido',
                    status: 'error'
                })
            }

            const result = await cadastrarValidacaoFacial.mutateAsync({
                imovelId,
                nome,
                cpf
            })

            await queryClient.invalidateQueries(['fichas'])

            navigator.clipboard.writeText(
                `${window.location.origin}/validacao-facial/${result?.data?.id}`
            );

            toast({
                title: "URL Copiada",
            });

            reset()
            onClose()
        } catch (error: any) {
            toast({
                title: "Houve um problema",
                description: error?.response?.data?.message,
                status: "warning",
            })
        }
    };

    const onCallbackImovel = async (imovelId) => {
        await queryClient.invalidateQueries(["imoveis"]);

        reset({ ...watch(), imovelId });
    };

    useImperativeHandle(ref, () => ({
        onOpen: () => {
            reset({});
            onOpen()
        },
    }));

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Cadastro Validação Facial</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormInput
                                label='Cpf'
                                {...register('cpf', {
                                    onChange: e => {
                                        if (!validateCPF(e.target.value)) {
                                            setError('cpf', {
                                                type: 'custom',
                                                message: 'Cpf inválido.'
                                            })
                                        } else {
                                            clearErrors()
                                        }
                                    }
                                })}
                                placeholder='999.999.999-99'
                                mask='999.999.999-99'
                                error={errors.cpf && errors.cpf.message}
                            />


                            <FormInput
                                label='Nome'
                                {...register('nome')}
                            />


                            <Controller
                                control={control}
                                name="imovelId"
                                render={({ field }) => (
                                    <FormMultiSelect
                                        size="sm"
                                        label="Imóvel"
                                        options={
                                            data?.data
                                                ?.data
                                        }
                                        isClearable
                                        formatOptionLabel={(
                                            i
                                        ) => (
                                            <Box>
                                                <Text>
                                                    <Text
                                                        fontSize="xs"
                                                        as="span"
                                                        fontWeight="bold"
                                                    >
                                                        Código:
                                                    </Text>{" "}
                                                    {
                                                        i.codigo
                                                    }
                                                    <Text
                                                        as="span"
                                                        fontSize="xs"
                                                    >{` - ${i.endereco}, ${i.bairro},${i.cidade}`}</Text>
                                                </Text>
                                            </Box>
                                        )}
                                        getOptionLabel={(
                                            i
                                        ) =>
                                            `Codigo: ${i.codigo} -  ${i.endereco}, ${i.bairro},${i.cidade}`
                                        }
                                        getOptionValue={(
                                            i
                                        ) => i.id}
                                        rightAddon={
                                            <Box p={0}>
                                                <Tooltip
                                                    label={
                                                        watch(
                                                            "imovelId"
                                                        )
                                                            ? "Editar imóvel"
                                                            : "Cadastrar Imóvel"
                                                    }
                                                >
                                                    <IconButton
                                                        rounded="none"
                                                        colorScheme="blue"
                                                        size="sm"
                                                        icon={
                                                            watch(
                                                                "imovelId"
                                                            ) ? (
                                                                <FiEdit />
                                                            ) : (
                                                                <FiPlus />
                                                            )
                                                        }
                                                        onClick={() =>
                                                            watch(
                                                                "imovelId"
                                                            )
                                                                ? modalImovel.current.onOpen(
                                                                    watch(
                                                                        "imovelId"
                                                                    )
                                                                )
                                                                : modalImovel.current.onOpen()
                                                        }
                                                    />
                                                </Tooltip>
                                            </Box>
                                        }
                                        onChange={(e) => {
                                            e?.target?.value && setQuery(e?.target?.value);
                                            field.onChange(
                                                e?.id
                                                    ? e.id
                                                    : null
                                            )
                                        }
                                        }
                                        value={
                                            field.value
                                                ? data?.data?.data.find(
                                                    (i) =>
                                                        i.id ==
                                                        field.value
                                                )
                                                : null
                                        }
                                        error={
                                            errors?.imovelId
                                                ?.message
                                        }
                                    />
                                )}
                            />

                            <Button colorScheme="blue" mt={4} isLoading={isSubmitting} type='submit'>
                                Cadastrar
                            </Button>
                        </form>
                    </ModalBody>
                    <ModalFooter gridGap={4}>

                    </ModalFooter>
                </ModalContent>
            </Modal >

            <ModalImovel ref={modalImovel} callback={data => onCallbackImovel(data)} />
        </>
    );
};

export const ModalCadastroValidacaoFacial = forwardRef(ModalBase);
