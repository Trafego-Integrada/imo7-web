import {
    atualizarUsuario,
    buscarUsuario,
    cadastrarUsuario,
} from "@/services/models/usuario";
import {
    Button,
    Grid,
    GridItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
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
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { FormInput } from "../Form/FormInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { queryClient } from "@/services/queryClient";

const schema = yup.object({
    nome: yup.string().required("Campo Obrigatório"),
    email: yup.string().required("Campo Obrigatório"),
    documento: yup.string().required("Campo Obrigatório"),
    senha: yup.string(),
    confirmarSenha: yup
        .string()
        .oneOf([yup.ref("senha")], "A senha deve ser a mesma"),
});

const ModalBase = ({ contaId, imobiliariaId }, ref) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const buscar = useMutation(buscarUsuario, {
        onSuccess: (data) => {
            reset(data);
            onOpen();
        },
    });
    const cadastrar = useMutation(cadastrarUsuario, {
        onSuccess: () => {
            queryClient.invalidateQueries(["usuarios"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
        },
    });
    const atualizar = useMutation(atualizarUsuario, {
        onSuccess: () => {
            queryClient.invalidateQueries(["usuarios"]);
            toast({ title: "Atualizado com sucesso", status: "success" });
            onClose();
        },
    });

    const onSubmit = async (data) => {
        try {
            if (data.id) {
                await atualizar.mutateAsync(data);
            } else {
                await cadastrar.mutateAsync({
                    ...data,
                    contaId,
                    imobiliariaId,
                });
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
                <ModalContent minW="60%">
                    <ModalHeader>Usuário</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs variant="unstyled">
                            <TabList>
                                <Tab>Dados</Tab>
                                {watch("id") && (
                                    <>
                                        <Tab
                                            hidden={
                                                watch("contratosInquilino")
                                                    .length > 0
                                                    ? false
                                                    : true
                                            }
                                        >
                                            Contratos (Inquilino)
                                        </Tab>
                                        <Tab
                                            hidden={
                                                watch("contratosProprietario")
                                                    .length > 0
                                                    ? false
                                                    : true
                                            }
                                        >
                                            Contratos (Inquilino)
                                        </Tab>
                                        <Tab
                                            hidden={
                                                watch("contratosFiador")
                                                    .length > 0
                                                    ? false
                                                    : true
                                            }
                                        >
                                            Contratos (Inquilino)
                                        </Tab>
                                    </>
                                )}
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Grid
                                        gap={5}
                                        templateColumns={{
                                            sm: "repeat(1, 1fr)",
                                            md: "repeat(2, 1fr)",
                                            lg: "repeat(3, 1fr)",
                                        }}
                                        as="form"
                                        id="formUsuario"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <GridItem>
                                            <FormInput
                                                label="Nome"
                                                placeholder="..."
                                                {...register("nome")}
                                                error={errors.nome?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="CPF"
                                                placeholder="..."
                                                {...register("documento")}
                                                error={
                                                    errors.documento?.message
                                                }
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="Email"
                                                placeholder="..."
                                                {...register("email")}
                                                error={errors.email?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="celular"
                                                placeholder="..."
                                                {...register("celular")}
                                                error={errors.celular?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                type="password"
                                                label="Senha"
                                                placeholder="..."
                                                {...register("senha")}
                                                error={errors.senha?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                type="password"
                                                label="Confirmar senha"
                                                placeholder="..."
                                                {...register("confirmarSenha")}
                                                error={
                                                    errors.confirmarSenha
                                                        ?.message
                                                }
                                            />
                                        </GridItem>
                                    </Grid>
                                </TabPanel>
                                <TabPanel>
                                    <Table size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th>Nº</Th>
                                                <Th>Inquilinos</Th>
                                                <Th>Endereco</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {watch("contratosInquilino") &&
                                                watch("contratosInquilino")
                                                    .length &&
                                                watch("contratosInquilino").map(
                                                    (item) => (
                                                        <Tr key={item.id}>
                                                            <Td>
                                                                {item.codigo}
                                                            </Td>
                                                            <Td>
                                                                {item.proprietarios.map(
                                                                    (item) => (
                                                                        <Text
                                                                            key={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            {
                                                                                item.nome
                                                                            }
                                                                        </Text>
                                                                    )
                                                                )}
                                                            </Td>
                                                            <Td>
                                                                {
                                                                    item.imovel
                                                                        .endereco
                                                                }
                                                            </Td>
                                                        </Tr>
                                                    )
                                                )}
                                        </Tbody>
                                    </Table>
                                </TabPanel>
                                <TabPanel>
                                    <Table size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th>Nº</Th>
                                                <Th>Inquilinos</Th>
                                                <Th>Endereco</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {watch("contratosProprietario") &&
                                                watch("contratosProprietario")
                                                    .length &&
                                                watch(
                                                    "contratosProprietario"
                                                ).map((item) => (
                                                    <Tr key={item.id}>
                                                        <Td>{item.codigo}</Td>
                                                        <Td>
                                                            {item.inquilinos.map(
                                                                (item) => (
                                                                    <Text
                                                                        key={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        {
                                                                            item.nome
                                                                        }
                                                                    </Text>
                                                                )
                                                            )}
                                                        </Td>
                                                        <Td>
                                                            {
                                                                item.imovel
                                                                    .endereco
                                                            }
                                                        </Td>
                                                    </Tr>
                                                ))}
                                        </Tbody>
                                    </Table>
                                </TabPanel>
                                <TabPanel>
                                    <Table size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th>Nº</Th>
                                                <Th>Inquilinos</Th>
                                                <Th>Endereco</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {watch("contratosFiador") &&
                                                watch("contratosFiador")
                                                    .length &&
                                                watch("contratosFiador").map(
                                                    (item) => (
                                                        <Tr key={item.id}>
                                                            <Td>
                                                                {item.codigo}
                                                            </Td>
                                                            <Td>
                                                                {item.inquilinos.map(
                                                                    (item) => (
                                                                        <Text
                                                                            key={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            {
                                                                                item.nome
                                                                            }
                                                                        </Text>
                                                                    )
                                                                )}
                                                            </Td>
                                                            <Td>
                                                                {
                                                                    item.imovel
                                                                        .endereco
                                                                }
                                                            </Td>
                                                        </Tr>
                                                    )
                                                )}
                                        </Tbody>
                                    </Table>
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
                            form="formUsuario"
                        >
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const Usuario = forwardRef(ModalBase);
