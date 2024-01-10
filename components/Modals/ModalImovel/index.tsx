import { FormInput } from "@/components/Form/FormInput";
import { FormInputCurrency } from "@/components/Form/FormInputCurrency";
import { useAuth } from "@/hooks/useAuth";
import { imo7ApiService } from "@/services/apiServiceUsage";
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
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

const schema = yup.object({});

const ModalBase = ({ chamadoId, callback }, ref) => {
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

    const buscar = useMutation(imo7ApiService("imovel").get, {
        onSuccess: (data) => {
            reset({
                ...data,
            });
            onOpen();
        },
    });
    const cadastrar = useMutation(imo7ApiService("imovel").create, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["imoveis"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
            if (callback) {
                callback(data.id);
            }
        },
    });
    const atualizar = useMutation(imo7ApiService("imovel").update, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["imoveis"]);
            toast({ title: "Atualizado com sucesso", status: "success" });
            onClose();
            if (callback) {
                callback(data.id);
            }
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
            reset({});
            if (id) {
                await buscar.mutateAsync(id);
            } else {
                onOpen();
            }
        },
    }));
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
                    ...watch(),
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

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Imóvel <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Flex
                            as="form"
                            id="formImovel"
                            onSubmit={handleSubmit(onSubmit)}
                            flexDir="column"
                            gap={6}
                        >
                            <Box>
                                <Heading size="sm">Dados do Imóvel</Heading>
                                <Grid
                                    gap={5}
                                    gridTemplateColumns={{
                                        lg: "repeat(3,1fr)",
                                    }}
                                >
                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            label="Código"
                                            placeholder="Código do imóveis"
                                            {...register("codigo")}
                                            error={errors.codigo?.message}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            rows={15}
                                            label="Tipo"
                                            placeholder="Digite o tipo"
                                            {...register("tipo")}
                                            error={errors.tipo?.message}
                                        />
                                    </GridItem>
                                </Grid>
                            </Box>
                            <Box>
                                <Heading size="sm" mb={2}>
                                    Valores
                                </Heading>
                                <Grid
                                    gap={5}
                                    gridTemplateColumns={{
                                        lg: "repeat(4,1fr)",
                                    }}
                                >
                                    <GridItem>
                                        <Controller
                                            name="valorVenda"
                                            control={control}
                                            render={({ field }) => (
                                                <FormInputCurrency
                                                    size="sm"
                                                    label="Valor Venda"
                                                    placeholder="R$"
                                                    error={
                                                        errors.valorVenda
                                                            ?.message
                                                    }
                                                    defaultValue={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Controller
                                            name="valorAluguel"
                                            control={control}
                                            render={({ field }) => (
                                                <FormInputCurrency
                                                    size="sm"
                                                    label="Valor Aluguel"
                                                    placeholder="R$"
                                                    error={
                                                        errors.valorAluguel
                                                            ?.message
                                                    }
                                                    defaultValue={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Controller
                                            name="valorCondominio"
                                            control={control}
                                            render={({ field }) => (
                                                <FormInputCurrency
                                                    size="sm"
                                                    label="Valor do Condominio"
                                                    placeholder="R$"
                                                    error={
                                                        errors.valorCondominio
                                                            ?.message
                                                    }
                                                    defaultValue={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Controller
                                            name="valorIPTU"
                                            control={control}
                                            render={({ field }) => (
                                                <FormInputCurrency
                                                    size="sm"
                                                    label="Valor IPTU "
                                                    placeholder="R$"
                                                    error={
                                                        errors.valorIPTU
                                                            ?.message
                                                    }
                                                    defaultValue={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Controller
                                            name="valorSeguro"
                                            control={control}
                                            render={({ field }) => (
                                                <FormInputCurrency
                                                    size="sm"
                                                    label="Valor Seguro Incêndio"
                                                    placeholder="R$"
                                                    error={
                                                        errors.valorSeguro
                                                            ?.message
                                                    }
                                                    defaultValue={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        />
                                    </GridItem>
                                </Grid>
                            </Box>
                            <Box>
                                <Heading size="sm" mb={2}>
                                    Endereço
                                </Heading>
                                <Grid
                                    gap={5}
                                    gridTemplateColumns={{
                                        lg: "repeat(4,1fr)",
                                    }}
                                >
                                    <GridItem
                                        as={Flex}
                                        gridGap={2}
                                        align="center"
                                        colStart={1}
                                    >
                                        <Controller
                                            control={control}
                                            name="cep"
                                            render={({ field }) => (
                                                <FormInput
                                                    {...field}
                                                    mask={"99999-999"}
                                                    label="CEP"
                                                    placeholder="CEP"
                                                    error={errors.cep?.message}
                                                    onChangeCapture={(e) =>
                                                        handleBuscarCep(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                        />

                                        {isLoading && <Spinner size="xs" />}
                                    </GridItem>
                                    <GridItem
                                        colStart={{ lg: 1 }}
                                        colSpan={{ lg: 3 }}
                                    >
                                        <FormInput
                                            size="sm"
                                            rows={15}
                                            label="Endereço"
                                            placeholder="Digite o endereço"
                                            {...register("endereco")}
                                            error={errors.endereco?.message}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            rows={15}
                                            label="Número"
                                            placeholder="Digite o numero"
                                            {...register("numero")}
                                            error={errors.numero?.message}
                                        />
                                    </GridItem>{" "}
                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            rows={15}
                                            label="Complemento"
                                            placeholder="Digite o complemento"
                                            {...register("complemento")}
                                            error={errors.complemento?.message}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            rows={15}
                                            label="Bairro"
                                            placeholder="Digite o bairro"
                                            {...register("bairro")}
                                            error={errors.bairro?.message}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            rows={15}
                                            label="Cidade"
                                            placeholder="Digite a cidade"
                                            {...register("cidade")}
                                            error={errors.cidade?.message}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            rows={15}
                                            label="UF"
                                            placeholder="Digite o estado"
                                            {...register("estado")}
                                            error={errors.estado?.message}
                                        />
                                    </GridItem>
                                </Grid>
                            </Box>
                        </Flex>
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
                            form="formImovel"
                        >
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalImovel = forwardRef(ModalBase);
