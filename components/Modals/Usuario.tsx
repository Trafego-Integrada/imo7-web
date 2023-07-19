import { FormInput } from "@/components/Form/FormInput";
import { includesAll } from "@/helpers/helpers";
import { listarModulos } from "@/services/models/modulo";
import {
    atualizarUsuario,
    buscarUsuario,
    cadastrarUsuario
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
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter, ModalOverlay,
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
    useToast
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

const schema = yup.object({
    nome: yup.string().required("Campo Obrigatório"),
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
        setValue,
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

    const { data: modulos } = useQuery(
        [
            "listarModulos",
            {
                cargoCodigo: imobiliariaId ? "imobiliaria" :'adm',
            },
        ],
        listarModulos
    );

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent minW="60%">
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs variant="solid-rounded" size="sm">
                            <TabList>
                                <Tab>Dados</Tab>
                                {watch('cargos')?.find(i =>  i=='imobiliaria' || i=='conta'|| i=='adm') &&<Tab>Permissões</Tab>}
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
                                            Contratos (Proprietário)
                                        </Tab>
                                        <Tab
                                            hidden={
                                                watch("contratosFiador")
                                                    .length > 0
                                                    ? false
                                                    : true
                                            }
                                        >
                                            Contratos (Fiador)
                                        </Tab>
                                    </>
                                )}
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Grid
                                        gap={4}
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
                                                size="sm"
                                                label="Nome"
                                                placeholder="..."
                                                {...register("nome")}
                                                error={errors.nome?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                size="sm"
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
                                        <GridItem>
                                            <FormInput
                                                size="sm"
                                                label="Whatsapp"
                                                placeholder="..."
                                                {...register("whatsapp")}
                                                error={errors.whatsapp?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <Switch
                                                size="sm"
                                                label="naoEnviarWhatsapp"
                                                placeholder="..."
                                                {...register("naoEnviarWhatsapp")}
                                                error={
                                                    errors.naoEnviarWhatsapp
                                                        ?.message
                                                }
                                            >Não enviar whatsapp</Switch>
                                        </GridItem>
                                        
                                        <GridItem>
                                            <Switch
                                                size="sm"
                                                label="Status"
                                                placeholder="..."
                                                {...register("status")}
                                                error={
                                                    errors.status
                                                        ?.message
                                                }
                                            >Ativo</Switch>
                                        </GridItem>
                                    </Grid>
                                    <Box  mt={4}>
                                        <Heading size="sm" mb={4} color="gray">Atualizar senha</Heading>
                                        <Grid gap={5}
                                        templateColumns={{
                                            sm: "repeat(1, 1fr)",
                                            md: "repeat(2, 1fr)",
                                            lg: "repeat(3, 1fr)",
                                        }}>
                                        <GridItem>
                                            <FormInput
                                                size="sm"
                                                type="password"
                                                label="Senha"
                                                placeholder="..."
                                                {...register("senha")}
                                                error={errors.senha?.message}
                                                autocomplete="new-password"
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                size="sm"
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
                                    </Box>
                                </TabPanel>
                                {watch('cargos')?.find(i => i=='imobiliaria' || i=='conta'|| i=='adm') &&<TabPanel>
                                    <Accordion allowMultiple>
                                        {modulos && modulos.data.length > 0 ? (
                                            modulos.data.map((item) => {
                                                if (!item.menuPai) {
                                                    return (
                                                        <AccordionItem border="none">
                                                            <h2>
                                                                <AccordionButton>
                                                                    <Box
                                                                        flex="1"
                                                                        textAlign="left"
                                                                    >
                                                                        <Checkbox
                                                                            isChecked={
                                                                                watch(
                                                                                    "modulos"
                                                                                ) &&
                                                                                watch(
                                                                                    "modulos"
                                                                                ).includes(
                                                                                    item.codigo
                                                                                )
                                                                            }
                                                                            isIndeterminate={
                                                                                watch(
                                                                                    "modulos"
                                                                                ) &&
                                                                                watch(
                                                                                    "modulos"
                                                                                ).includes(
                                                                                    item.codigo
                                                                                ) &&
                                                                                !includesAll(
                                                                                    watch(
                                                                                        "modulos"
                                                                                    ),
                                                                                    item.modulos?.map(
                                                                                        (
                                                                                            s
                                                                                        ) =>
                                                                                            s.codigo
                                                                                    )
                                                                                )
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                let newPerms =
                                                                                    watch(
                                                                                        "modulos"
                                                                                    ).filter(
                                                                                        (
                                                                                            p
                                                                                        ) =>
                                                                                            p !=
                                                                                            item.codigo
                                                                                    );
                                                                                if (
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                ) {
                                                                                    newPerms.push(
                                                                                        item.codigo
                                                                                    );
                                                                                }
                                                                                console.log(
                                                                                    newPerms,
                                                                                    "ok"
                                                                                );
                                                                                setValue(
                                                                                    "modulos",
                                                                                    newPerms
                                                                                );
                                                                            }}
                                                                        >
                                                                            {
                                                                                item.nome
                                                                            }
                                                                        </Checkbox>
                                                                    </Box>
                                                                    <AccordionIcon />
                                                                </AccordionButton>
                                                            </h2>
                                                            <AccordionPanel
                                                                pb={4}
                                                                px={0}
                                                            >
                                                                <Stack ml={8}>
                                                                    {item
                                                                        .permissoes
                                                                        .length >
                                                                    0 ? (
                                                                        item.permissoes.map(
                                                                            (
                                                                                perm
                                                                            ) => (
                                                                                <Checkbox
                                                                                    key={
                                                                                        perm.codigo
                                                                                    }
                                                                                    isChecked={
                                                                                        watch(
                                                                                            "permissoes"
                                                                                        ) &&
                                                                                        watch(
                                                                                            "permissoes"
                                                                                        ).includes(
                                                                                            perm.codigo
                                                                                        )
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        let newPerms =
                                                                                            watch(
                                                                                                "permissoes"
                                                                                            ).filter(
                                                                                                (
                                                                                                    p
                                                                                                ) =>
                                                                                                    p !=
                                                                                                    perm.codigo
                                                                                            );
                                                                                        if (
                                                                                            e
                                                                                                .target
                                                                                                .checked
                                                                                        ) {
                                                                                            newPerms.push(
                                                                                                perm.codigo
                                                                                            );
                                                                                        }
                                                                                        setValue(
                                                                                            "permissoes",
                                                                                            newPerms
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        perm.nome
                                                                                    }
                                                                                </Checkbox>
                                                                            )
                                                                        )
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </Stack>
                                                                {item.modulos
                                                                    .length >
                                                                0 ? (
                                                                    item.modulos.map(
                                                                        (
                                                                            sub
                                                                        ) => {
                                                                            return (
                                                                                <AccordionItem
                                                                                    key={
                                                                                        sub.codigo
                                                                                    }
                                                                                    border="none"
                                                                                >
                                                                                    <h2>
                                                                                        <AccordionButton>
                                                                                            <Box
                                                                                                flex="1"
                                                                                                textAlign="left"
                                                                                                pl={
                                                                                                    4
                                                                                                }
                                                                                            >
                                                                                                <Checkbox
                                                                                                    isChecked={
                                                                                                        watch(
                                                                                                            "modulos"
                                                                                                        ) &&
                                                                                                        watch(
                                                                                                            "modulos"
                                                                                                        ).includes(
                                                                                                            sub.codigo
                                                                                                        )
                                                                                                    }
                                                                                                    isIndeterminate={
                                                                                                        watch(
                                                                                                            "modulos"
                                                                                                        ) &&
                                                                                                        watch(
                                                                                                            "modulos"
                                                                                                        ).includes(
                                                                                                            sub.codigo
                                                                                                        ) &&
                                                                                                        !includesAll(
                                                                                                            watch(
                                                                                                                "modulos"
                                                                                                            ),
                                                                                                            sub.modulos?.map(
                                                                                                                (
                                                                                                                    s
                                                                                                                ) =>
                                                                                                                    s.codigo
                                                                                                            )
                                                                                                        )
                                                                                                    }
                                                                                                    onChange={(
                                                                                                        e
                                                                                                    ) => {
                                                                                                        let newPerms =
                                                                                                            watch(
                                                                                                                "modulos"
                                                                                                            ).filter(
                                                                                                                (
                                                                                                                    p
                                                                                                                ) =>
                                                                                                                    p !=
                                                                                                                    sub.codigo
                                                                                                            );
                                                                                                        if (
                                                                                                            e
                                                                                                                .target
                                                                                                                .checked
                                                                                                        ) {
                                                                                                            newPerms.push(
                                                                                                                sub.codigo
                                                                                                            );
                                                                                                        }
                                                                                                        setValue(
                                                                                                            "modulos",
                                                                                                            newPerms
                                                                                                        );
                                                                                                    }}
                                                                                                >
                                                                                                    {
                                                                                                        sub.nome
                                                                                                    }
                                                                                                </Checkbox>
                                                                                            </Box>
                                                                                            <AccordionIcon />
                                                                                        </AccordionButton>
                                                                                    </h2>
                                                                                    <AccordionPanel
                                                                                        pb={
                                                                                            4
                                                                                        }
                                                                                        px={
                                                                                            0
                                                                                        }
                                                                                    >
                                                                                        <Stack>
                                                                                            {sub
                                                                                                .permissoes
                                                                                                .length >
                                                                                            0 ? (
                                                                                                sub.permissoes.map(
                                                                                                    (
                                                                                                        perm2
                                                                                                    ) => (
                                                                                                        <Checkbox
                                                                                                            key={
                                                                                                                perm2.codigo
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                let newPerms =
                                                                                                                    watch(
                                                                                                                        "permissoes"
                                                                                                                    ).filter(
                                                                                                                        (
                                                                                                                            p
                                                                                                                        ) =>
                                                                                                                            p !=
                                                                                                                            perm2.codigo
                                                                                                                    );
                                                                                                                if (
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .checked
                                                                                                                ) {
                                                                                                                    newPerms.push(
                                                                                                                        perm2.codigo
                                                                                                                    );
                                                                                                                }
                                                                                                                setValue(
                                                                                                                    "permissoes",
                                                                                                                    newPerms
                                                                                                                );
                                                                                                            }}
                                                                                                        >
                                                                                                            {
                                                                                                                perm2.nome
                                                                                                            }
                                                                                                        </Checkbox>
                                                                                                    )
                                                                                                )
                                                                                            ) : (
                                                                                                <>

                                                                                                </>
                                                                                            )}
                                                                                        </Stack>
                                                                                        {sub
                                                                                            .modulos
                                                                                            .length >
                                                                                        0 ? (
                                                                                            sub.modulos.map(
                                                                                                (
                                                                                                    sub2
                                                                                                ) => {
                                                                                                    return (
                                                                                                        <AccordionItem
                                                                                                            key={
                                                                                                                sub2.codigo
                                                                                                            }
                                                                                                            border="none"
                                                                                                        >
                                                                                                            <h2>
                                                                                                                <AccordionButton>
                                                                                                                    <Box
                                                                                                                        flex="1"
                                                                                                                        textAlign="left"
                                                                                                                        pl={
                                                                                                                            8
                                                                                                                        }
                                                                                                                    >
                                                                                                                        <Checkbox
                                                                                                                            isChecked={
                                                                                                                                watch(
                                                                                                                                    "modulos"
                                                                                                                                ) &&
                                                                                                                                watch(
                                                                                                                                    "modulos"
                                                                                                                                ).includes(
                                                                                                                                    sub2.codigo
                                                                                                                                )
                                                                                                                            }
                                                                                                                            isIndeterminate={
                                                                                                                                watch(
                                                                                                                                    "modulos"
                                                                                                                                ) &&
                                                                                                                                watch(
                                                                                                                                    "modulos"
                                                                                                                                ).includes(
                                                                                                                                    sub2.codigo
                                                                                                                                ) &&
                                                                                                                                !includesAll(
                                                                                                                                    watch(
                                                                                                                                        "permissoes"
                                                                                                                                    ),
                                                                                                                                    sub2.permissoes.map(
                                                                                                                                        (
                                                                                                                                            s
                                                                                                                                        ) =>
                                                                                                                                            s.codigo
                                                                                                                                    )
                                                                                                                                )
                                                                                                                            }
                                                                                                                            onChange={(
                                                                                                                                e
                                                                                                                            ) => {
                                                                                                                                let newPerms =
                                                                                                                                    watch(
                                                                                                                                        "modulos"
                                                                                                                                    ).filter(
                                                                                                                                        (
                                                                                                                                            p
                                                                                                                                        ) =>
                                                                                                                                            p !=
                                                                                                                                            sub2.codigo
                                                                                                                                    );
                                                                                                                                if (
                                                                                                                                    e
                                                                                                                                        .target
                                                                                                                                        .checked
                                                                                                                                ) {
                                                                                                                                    newPerms.push(
                                                                                                                                        sub2.codigo
                                                                                                                                    );
                                                                                                                                }
                                                                                                                                setValue(
                                                                                                                                    "modulos",
                                                                                                                                    newPerms
                                                                                                                                );
                                                                                                                            }}
                                                                                                                        >
                                                                                                                            {
                                                                                                                                sub2.nome
                                                                                                                            }
                                                                                                                        </Checkbox>
                                                                                                                    </Box>
                                                                                                                    <AccordionIcon />
                                                                                                                </AccordionButton>
                                                                                                            </h2>
                                                                                                            <AccordionPanel
                                                                                                                pb={
                                                                                                                    4
                                                                                                                }
                                                                                                            >
                                                                                                                <Stack
                                                                                                                    pl={
                                                                                                                        12
                                                                                                                    }
                                                                                                                >
                                                                                                                    {sub2
                                                                                                                        .permissoes
                                                                                                                        .length >
                                                                                                                    0 ? (
                                                                                                                        sub2.permissoes.map(
                                                                                                                            (
                                                                                                                                perm2
                                                                                                                            ) => (
                                                                                                                                <Checkbox
                                                                                                                                    key={
                                                                                                                                        perm2.codigo
                                                                                                                                    }
                                                                                                                                    isChecked={
                                                                                                                                        watch(
                                                                                                                                            "permissoes"
                                                                                                                                        ) &&
                                                                                                                                        watch(
                                                                                                                                            "permissoes"
                                                                                                                                        ).includes(
                                                                                                                                            perm2.codigo
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                    onChange={(
                                                                                                                                        e
                                                                                                                                    ) => {
                                                                                                                                        let newPerms =
                                                                                                                                            watch(
                                                                                                                                                "permissoes"
                                                                                                                                            ).filter(
                                                                                                                                                (
                                                                                                                                                    p
                                                                                                                                                ) =>
                                                                                                                                                    p !=
                                                                                                                                                    perm2.codigo
                                                                                                                                            );
                                                                                                                                        if (
                                                                                                                                            e
                                                                                                                                                .target
                                                                                                                                                .checked
                                                                                                                                        ) {
                                                                                                                                            newPerms.push(
                                                                                                                                                perm2.codigo
                                                                                                                                            );
                                                                                                                                        }
                                                                                                                                        setValue(
                                                                                                                                            "permissoes",
                                                                                                                                            newPerms
                                                                                                                                        );
                                                                                                                                    }}
                                                                                                                                >
                                                                                                                                    {
                                                                                                                                        perm2.nome
                                                                                                                                    }
                                                                                                                                </Checkbox>
                                                                                                                            )
                                                                                                                        )
                                                                                                                    ) : (
                                                                                                                        <>

                                                                                                                        </>
                                                                                                                    )}
                                                                                                                </Stack>
                                                                                                            </AccordionPanel>
                                                                                                        </AccordionItem>
                                                                                                    );
                                                                                                }
                                                                                            )
                                                                                        ) : (
                                                                                            <>

                                                                                            </>
                                                                                        )}
                                                                                    </AccordionPanel>
                                                                                </AccordionItem>
                                                                            );
                                                                        }
                                                                    )
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </AccordionPanel>
                                                        </AccordionItem>
                                                    );
                                                }
                                            })
                                        ) : (
                                            <></>
                                        )}
                                    </Accordion>
                                </TabPanel>}
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
                                                                    item.imovel?
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
                                                                item.imovel?
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

                    <ModalFooter gap={4}>
                        <Button size="sm" variant="ghost" onClick={onClose}>
                            Fechar
                        </Button>
                        <Button size="sm"
                            colorScheme="blue"
                            type="submit"
                            isLoading={isSubmitting}
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
