import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { includesAll } from "@/helpers/helpers";
import {
    atualizarAssunto,
    buscarAssunto,
    cadastrarAssunto,
} from "@/services/models/assunto";
import {
    atualizarCategoriaPessoa,
    buscarCategoriaPessoa,
    cadastrarCategoriaPessoa,
} from "@/services/models/categoriaPessoa";
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
    atualizarTagTarefa,
    buscarTagTarefa,
    cadastrarTagTarefa,
} from "@/services/models/tagTarefa";
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

const schema = yup.object({
    nome: yup.string().required("Campo Obrigatório"),
});

const ModalBase = ({ departamentoId }, ref) => {
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
    const buscar = useMutation(buscarTagTarefa, {
        onSuccess: (data) => {
            reset(data);
            onOpen();
        },
    });
    const cadastrar = useMutation(cadastrarTagTarefa, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tagsTarefa"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
        },
    });
    const atualizar = useMutation(atualizarTagTarefa, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tagsTarefa"]);
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Tag de Tarefa <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Grid
                            gap={5}
                            templateColumns={{
                                sm: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(2, 1fr)",
                            }}
                            as="form"
                            id="formTagTarefa"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormInput
                                    size="sm"
                                    label="Nome"
                                    placeholder="..."
                                    {...register("nome")}
                                    error={errors.nome?.message}
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
                            form="formTagTarefa"
                        >
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalTagTarefa = forwardRef(ModalBase);
