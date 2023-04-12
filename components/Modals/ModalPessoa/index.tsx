import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { includesAll } from "@/helpers/helpers";
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
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

const schema = yup.object({
    razaoSocial: yup.string().required("Campo Obrigatório"),
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

    const buscar = useMutation(buscarPessoa, {
        onSuccess: (data) => {
            reset(data);
            onOpen();
        },
    });
    const cadastrar = useMutation(cadastrarPessoa, {
        onSuccess: () => {
            queryClient.invalidateQueries(["pessoas"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
        },
    });
    const atualizar = useMutation(atualizarPessoa, {
        onSuccess: () => {
            queryClient.invalidateQueries(["pessoas"]);
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
                                lg: "repeat(5, 1fr)",
                            }}
                            as="form"
                            id="formPessoa"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <GridItem>
                                <FormSelect
                                    size="sm"
                                    label="Tipo de Cadastro"
                                    placeholder="..."
                                    {...register("tipoCadastro")}
                                    error={errors.tipoCadastro?.message}
                                >
                                    <option value="prestador">
                                        Prestador de Serviço
                                    </option>
                                </FormSelect>
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormInput
                                    size="sm"
                                    label="Nome / Razão Social"
                                    placeholder="..."
                                    {...register("razaoSocial")}
                                    error={errors.razaoSocial?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormSelect
                                    size="sm"
                                    label="Tipo de Pessoa"
                                    placeholder="..."
                                    {...register("tipoPessoa")}
                                    error={errors.tipoPessoa?.message}
                                >
                                    <option value="fisica">
                                        Pessoa Física
                                    </option>
                                    <option value="juridica">
                                        Pessoa Juridica
                                    </option>
                                </FormSelect>
                            </GridItem>

                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Categoria"
                                    placeholder="..."
                                    {...register("categoria")}
                                    error={errors.categoria?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="documento"
                                    placeholder="..."
                                    {...register("documento")}
                                    error={errors.documento?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Telefone"
                                    placeholder="..."
                                    {...register("telefone")}
                                    error={errors.telefone?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Celular"
                                    placeholder="..."
                                    {...register("celular")}
                                    error={errors.celular?.message}
                                />
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormInput
                                    size="sm"
                                    label="E-mail"
                                    placeholder="..."
                                    {...register("email")}
                                    error={errors.email?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="CEP"
                                    placeholder="..."
                                    {...register("cep")}
                                    error={errors.cep?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Estado"
                                    placeholder="..."
                                    {...register("estado")}
                                    error={errors.estado?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Cidade"
                                    placeholder="..."
                                    {...register("cidade")}
                                    error={errors.cidade?.message}
                                />
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormInput
                                    size="sm"
                                    label="Bairro"
                                    placeholder="..."
                                    {...register("bairro")}
                                    error={errors.bairro?.message}
                                />
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormInput
                                    size="sm"
                                    label="Rua"
                                    placeholder="..."
                                    {...register("endereco")}
                                    error={errors.endereco?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Número"
                                    placeholder="..."
                                    {...register("numero")}
                                    error={errors.numero?.message}
                                />
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormInput
                                    size="sm"
                                    label="Complemento"
                                    placeholder="..."
                                    {...register("complemento")}
                                    error={errors.complemento?.message}
                                />
                            </GridItem>
                            <GridItem colSpan={{ lg: 3 }}>
                                <FormInput
                                    size="sm"
                                    label="Observações"
                                    placeholder="..."
                                    {...register("observacoes")}
                                    error={errors.observacoes?.message}
                                />
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormInput
                                    size="sm"
                                    label="Tags"
                                    placeholder="..."
                                    {...register("tags")}
                                    error={errors.tags?.message}
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
export const ModalPessoa = forwardRef(ModalBase);
