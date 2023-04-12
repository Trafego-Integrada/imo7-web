import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { includesAll } from "@/helpers/helpers";
import {
    atualizarDepartamento,
    buscarDepartamento,
    cadastrarDepartamento,
} from "@/services/models/departamento";
import { listarModulos } from "@/services/models/modulo";
import {
    atualizarPessoa,
    buscarPessoa,
    cadastrarPessoa,
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
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { Assuntos } from "./Assuntos";

const schema = yup.object({
    titulo: yup.string().required("Campo Obrigatório"),
});

const ModalBase = ({}, ref) => {
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
    const buscar = useMutation(buscarDepartamento, {
        onSuccess: (data) => {
            reset(data);
            onOpen();
        },
    });
    const cadastrar = useMutation(cadastrarDepartamento, {
        onSuccess: () => {
            queryClient.invalidateQueries(["departamentos"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
        },
    });
    const atualizar = useMutation(atualizarDepartamento, {
        onSuccess: () => {
            queryClient.invalidateQueries(["departamentos"]);
            toast({ title: "Atualizado com sucesso", status: "success" });
            onClose();
        },
    });

    const onSubmit = async (data) => {
        try {
            if (data.id) {
                await atualizar.mutateAsync(data);
            } else {
                await cadastrar.mutateAsync(data);
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
    const { data: responsaveis } = useQuery(
        ["responsaveis", { admImobiliaria: true }],
        listarUsuarios
    );
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Departamento <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Tabs size="sm" variant="solid-rounded">
                            <TabList>
                                <Tab>Departamento</Tab>
                                <Tab>Assuntos</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Grid
                                        gap={5}
                                        templateColumns={{
                                            sm: "repeat(1, 1fr)",
                                            md: "repeat(2, 1fr)",
                                            lg: "repeat(2, 1fr)",
                                        }}
                                        as="form"
                                        id="formDepartamento"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <GridItem colSpan={{ lg: 2 }}>
                                            <FormInput
                                                size="sm"
                                                label="Título"
                                                placeholder="..."
                                                {...register("titulo")}
                                                error={errors.titulo?.message}
                                            />
                                        </GridItem>
                                        <GridItem colSpan={{ lg: 2 }}>
                                            <Controller
                                                control={control}
                                                name="integrantes"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        size="sm"
                                                        label="Integrantes"
                                                        placeholder="..."
                                                        isMulti
                                                        options={
                                                            responsaveis?.data
                                                                ?.data
                                                        }
                                                        getOptionLabel={(e) =>
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                        error={
                                                            errors.responsaveis
                                                                ?.message
                                                        }
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </GridItem>
                                        <GridItem colSpan={{ lg: 2 }}>
                                            <Switch {...register("ativo")}>
                                                Ativo
                                            </Switch>
                                        </GridItem>
                                    </Grid>
                                </TabPanel>
                                <TabPanel>
                                    <Assuntos departamentoId={watch("id")} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
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
                            form="formDepartamento"
                        >
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalDepartamento = forwardRef(ModalBase);
