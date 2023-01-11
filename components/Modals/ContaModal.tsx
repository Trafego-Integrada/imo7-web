import {
    useDisclosure,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Grid,
    GridItem,
    toast,
    useToast,
    Heading,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Box,
    Tab,
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    Td,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import {
    buscarConta,
    cadastrarConta,
    atualizarConta,
} from "@/services/models/conta";
import { Input } from "@/Forms/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

const schema = yup.object().shape({
    codigo: yup.string().required("O Código é obrigatório"),
    nome: yup.string().required("O Nome é obrigatório"),
});

const ModalBase = ({}, ref) => {
    const toast = useToast();
    const { usuario } = useAuth();
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

    const showData = useMutation(buscarConta);
    const atualizar = useMutation(atualizarConta);
    const cadastrar = useMutation(cadastrarConta);

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

    const onSubmit = async (data) => {
        if (data.id) {
            await atualizar.mutateAsync(data, {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast({
                        title: "Sucesso!",
                        description: "Conta atualizada com sucesso!",
                        status: "success",
                    });
                },
            });
        } else {
            await cadastrar.mutateAsync(data, {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast({
                        title: "Sucesso!",
                        description: "Conta cadastrada com sucesso!",
                        status: "success",
                    });
                },
            });
        }
    };

    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            if (id) {
                onShow(id);
            }
            reset();
            onOpen();
        },
    }));
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Conta
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Tabs>
                        <TabList>
                            <Tab>Dados</Tab>
                            {watch("id") && (
                                <>
                                    <Tab>Usuários</Tab>
                                    <Tab>Imobiliárias</Tab>
                                </>
                            )}
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Box
                                    as="form"
                                    id="conta-form"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <Grid
                                        gridTemplateColumns="repeat(3, 1fr)"
                                        gap={4}
                                    >
                                        <GridItem colSpan={1}>
                                            <Input
                                                size="sm"
                                                label="Código"
                                                {...register("codigo")}
                                                error={errors.codigo?.message}
                                            />
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <Input
                                                size="sm"
                                                label="Nome"
                                                {...register("nome")}
                                                error={errors.nome?.message}
                                            />
                                        </GridItem>
                                    </Grid>
                                    {!watch("id") && (
                                        <>
                                            <Heading size="md" mt={4} mb={2}>
                                                Administrador
                                            </Heading>
                                            <Grid
                                                gridTemplateColumns="repeat(1, 1fr)"
                                                gap={4}
                                            >
                                                <GridItem colSpan={1}>
                                                    <Input
                                                        size="sm"
                                                        label="Nome"
                                                        {...register(
                                                            "usuario.nome"
                                                        )}
                                                        error={
                                                            errors.usuario?.nome
                                                                ?.message
                                                        }
                                                    />
                                                </GridItem>
                                                <GridItem colSpan={1}>
                                                    <Input
                                                        size="sm"
                                                        label="CPF"
                                                        {...register(
                                                            "usuario.documento"
                                                        )}
                                                        error={
                                                            errors.usuario
                                                                ?.documento
                                                                ?.message
                                                        }
                                                    />
                                                </GridItem>
                                                <GridItem colSpan={1}>
                                                    <Input
                                                        size="sm"
                                                        label="E-mail"
                                                        {...register(
                                                            "usuario.email"
                                                        )}
                                                        error={
                                                            errors.usuario
                                                                ?.email?.message
                                                        }
                                                    />
                                                </GridItem>
                                            </Grid>
                                        </>
                                    )}
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>Nome</Th>
                                            <Th>CPF</Th>
                                            <Th>E-mail</Th>
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {watch("usuarios") &&
                                        watch("usuarios").length > 0 ? (
                                            watch("usuarios").map((item) => (
                                                <Tr key={item.id}>
                                                    <Td>{item.nome}</Td>
                                                    <Td>{item.documento}</Td>
                                                    <Td>{item.email}</Td>
                                                </Tr>
                                            ))
                                        ) : (
                                            <Tr>
                                                <Td
                                                    colSpan={4}
                                                    textAlign="center"
                                                    color="gray"
                                                >
                                                    Não há usuários cadastrados
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </TabPanel>
                            <TabPanel>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>Razão Social</Th>
                                            <Th>CNPJ</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {watch("imobiliarias") &&
                                        watch("imobiliarias").length > 0 ? (
                                            watch("imobiliarias").map(
                                                (item) => (
                                                    <Tr key={item.id}>
                                                        <Td>
                                                            {item.razaoSocial}
                                                        </Td>
                                                        <Td>{item.cnpj}</Td>
                                                        <Td></Td>
                                                    </Tr>
                                                )
                                            )
                                        ) : (
                                            <Tr>
                                                <Td
                                                    colSpan={4}
                                                    textAlign="center"
                                                    color="gray"
                                                >
                                                    Não há imobiliárias
                                                    cadastradas
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button
                        type="submit"
                        form="conta-form"
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

export const ContaModal = forwardRef(ModalBase);
