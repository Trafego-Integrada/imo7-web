import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";

import { FormInputCurrency } from "@/components/Form/FormInputCurrency";
import { includesAll } from "@/helpers/helpers";
import { listarModulos } from "@/services/models/modulo";
import {
    atualizarOrcamento,
    buscarOrcamento,
    cadastrarOrcamento,
} from "@/services/models/orcamento";
import {
    atualizarPessoa,
    buscarPessoa,
    cadastrarPessoa,
    listarPessoas,
} from "@/services/models/pessoa";
import {
    atualizarUsuario,
    buscarUsuario,
    cadastrarUsuario,
    listarUsuarios,
} from "@/services/models/usuario";
import { queryClient } from "@/services/queryClient";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Checkbox,
    Grid,
    GridItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Switch,
    Tab,
    Table,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
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
    solicitante: yup.object().required("Campo Obrigatório"),
    prestador: yup.object().required("Campo Obrigatório"),
    valor: yup.string().required("Campo Obrigatório"),
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

    const buscar = useMutation(buscarOrcamento, {
        onSuccess: (data) => {
            reset({
                ...data,
                dataVisita: data.dataVisita
                    ? moment(data.dataVisita).format("YYYY-MM-DD")
                    : null,
            });
            onOpen();
        },
    });
    const cadastrar = useMutation(cadastrarOrcamento, {
        onSuccess: () => {
            queryClient.invalidateQueries(["orcamentos"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
        },
    });
    const atualizar = useMutation(atualizarOrcamento, {
        onSuccess: () => {
            queryClient.invalidateQueries(["orcamentos"]);
            toast({ title: "Atualizado com sucesso", status: "success" });
            onClose();
        },
    });

    const onSubmit = async (data) => {
        try {
            if (data.id) {
                await atualizar.mutateAsync(data);
            } else {
                await cadastrar.mutateAsync({ ...data, chamadoId });
            }
        } catch (error) {
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
    const { data: prestadores } = useQuery(
        ["prestadores", { tipoCadastro: "prestador" }],
        listarPessoas
    );
    const { data: responsaveis } = useQuery(
        ["responsaveis", { admImobiliaria: true }],
        listarUsuarios
    );
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Pessoa <ModalCloseButton />
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
                            <GridItem colSpan={{ lg: 1 }}>
                                <Controller
                                    control={control}
                                    name="solicitante"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            size="sm"
                                            label="Responsavel"
                                            placeholder="..."
                                            options={responsaveis?.data?.data}
                                            getOptionLabel={(e) => e.nome}
                                            getOptionValue={(e) => e.id}
                                            error={errors.solicitante?.message}
                                            {...field}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem>
                                <Controller
                                    control={control}
                                    name="prestador"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            size="sm"
                                            label="Prestador"
                                            placeholder="..."
                                            options={prestadores?.data?.data}
                                            getOptionLabel={(e) =>
                                                e.razaoSocial
                                            }
                                            getOptionValue={(e) => e.id}
                                            error={errors.prestador?.message}
                                            {...field}
                                        />
                                    )}
                                />
                            </GridItem>

                            <GridItem>
                                <Controller
                                    name="valor"
                                    control={control}
                                    render={({ field }) => (
                                        <FormInputCurrency
                                            label="Valor "
                                            placeholder="R$"
                                            error={errors.valor?.message}
                                            defaultValue={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    type="datetime"
                                    size="sm"
                                    label="Data da Visita"
                                    placeholder="..."
                                    {...register("dataVisita")}
                                    error={errors.dataVisita?.message}
                                />
                            </GridItem>

                            <GridItem colSpan={{ lg: 4 }}>
                                <FormTextarea
                                    size="sm"
                                    label="Observações"
                                    placeholder="..."
                                    {...register("observacoes")}
                                    error={errors.observacoes?.message}
                                />
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
export const ModalOrcamento = forwardRef(ModalBase);
