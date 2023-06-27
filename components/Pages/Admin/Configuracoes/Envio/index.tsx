import { Excluir } from "@/components/AlertDialogs/Excluir";
import { FormInput } from "@/components/Form/FormInput";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { ModalReguaCobranca } from "@/components/Modals/ModalReguaCobranca";
import {
    formaEnvioReguaCobranca,
    tipoEnvioReguaCobranca,
    tipoReguaCobranca,
} from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import { show, update } from "@/services/models/imobiliaria";
import {
    excluirReguaCobranca,
    listarReguasCobranca,
} from "@/services/models/reguaCobranca";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    GridItem,
    Heading,
    Table,
    Text,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    useToast,
    TableContainer,
    Icon,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";

export const Envio = () => {
    const modalRegua = useRef();
    const modalExcluir = useRef();
    const { usuario } = useAuth();
    const toast = useToast();

    const {
        setValue,
        watch,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        // resolver: yupResolver(schema),
    });

    const buscar = useMutation(show, {
        onSuccess: (data) => {
            reset({ ...data });
        },
    });

    const atualizar = useMutation(update);
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.entries(data).map((i) => formData.append(i[0], i[1]));

            await atualizar.mutateAsync({ id: data.id, data: formData });
            toast({
                title: "Dados atualizados",
                status: "success",
                containerStyle: {
                    zIndex: 999999,
                },
                position: "bottom-right",
            });
        } catch (error) {
            toast({
                title: "Tivemos um problema",
                description: "Tente novamente mais tarde",
                status: "error",

                position: "bottom-right",
            });
        }
    };

    useEffect(() => {
        buscar.mutate(usuario.imobiliariaId);
    }, [usuario]);

    const { data: reguas } = useQuery(
        ["reguasCobranca", {}],
        listarReguasCobranca,
        { refetchOnReconnect: false, refetchOnWindowFocus: false }
    );
    const excluir = useMutation(excluirReguaCobranca);

    const onDelete = async (id) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: "Regua excluida",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["reguasCobranca"]);
            },
        });
    };

    return (
        <Box>
            <Box as="form" id="formEnvio" onSubmit={handleSubmit(onSubmit)}>
                <Flex flexDir="column" gap={4}>
                    <Box bg="white" p={4}>
                        <Flex align="center" justify="space-between" mb={4}>
                            <Box>
                                <Heading size="md">Ativação</Heading>
                                <Text fontSize="sm" color="gray">
                                    Ative ou desative o envio de e-mails e
                                    whatsapp
                                </Text>
                            </Box>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                size="sm"
                                id="formEnvio"
                                colorScheme="blue"
                            >
                                Salvar
                            </Button>
                        </Flex>
                        <Grid
                            gridTemplateColumns={{
                                base: "repeat(1,1fr)",
                                lg: "repeat(1,1fr)",
                            }}
                        >
                            <GridItem>
                                <Checkbox
                                    size="sm"
                                    placeholder="Digite o e-mail do remetente"
                                    isChecked={watch("enviarEmail")}
                                    {...register("enviarEmail")}
                                >
                                    Enviar e-mail
                                </Checkbox>
                            </GridItem>
                            <GridItem as={Grid}>
                                <Checkbox
                                    size="sm"
                                    placeholder="Digite o e-mail do remetente"
                                    isChecked={watch("enviarWhatsapp")}
                                    {...register("enviarWhatsapp")}
                                >
                                    Enviar whatsapp
                                </Checkbox>
                            </GridItem>
                        </Grid>
                    </Box>
                    <Box bg="white" p={4}>
                        <Flex align="center" justify="space-between" mb={4}>
                            <Box>
                                <Heading size="md">Boletos</Heading>
                                <Text fontSize="sm" color="gray">
                                    Configure o envio de boletos
                                </Text>
                            </Box>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                size="sm"
                                id="formEnvio"
                                colorScheme="blue"
                            >
                                Salvar
                            </Button>
                        </Flex>
                        <Grid
                            gridTemplateColumns={{
                                base: "repeat(1,1fr)",
                                lg: "repeat(1,1fr)",
                            }}
                            gap={4}
                        >
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Remetente
                                    </Text>
                                    <Text color="gray" fontSize="xs">
                                        Opcional. Caso deixe em branco será
                                        utilizado o padrão do SMTP
                                    </Text>
                                </Box>
                                <FormInput
                                    size="sm"
                                    placeholder="Digite o e-mail do remetente"
                                    {...register("emailEnvioExtrato")}
                                />
                            </GridItem>
                            <GridItem>
                                <Flex
                                    align="center"
                                    justify="space-between"
                                    mb={2}
                                >
                                    <Box>
                                        <Heading size="sm" color="gray.700">
                                            Regua de Cobrança
                                        </Heading>
                                        <Text fontSize="xs" color="gray">
                                            Você poderá configurar até 3 por
                                            forma de envio, para envios para
                                            boletos
                                        </Text>
                                    </Box>
                                    <Button
                                        size="xs"
                                        leftIcon={<Icon as={FiPlus} />}
                                        onClick={() =>
                                            modalRegua.current.onOpen()
                                        }
                                    >
                                        Adicionar regua
                                    </Button>
                                </Flex>
                                <Box>
                                    <TableContainer>
                                        <Table size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th w={24}>Tipo</Th>
                                                    <Th w={44}>
                                                        Tipo de Envio
                                                    </Th>
                                                    <Th w={24}>
                                                        Forma de Envio
                                                    </Th>
                                                    <Th>Assunto</Th>
                                                    <Th w={24}></Th>
                                                </Tr>
                                            </Thead>
                                            {reguas?.data?.data?.length > 0 ? (
                                                reguas?.data?.data?.map(
                                                    (regua) => (
                                                        <Tr key={regua.id}>
                                                            <Td>
                                                                {tipoReguaCobranca(
                                                                    regua.tipo
                                                                )}
                                                            </Td>
                                                            <Td>
                                                                {tipoEnvioReguaCobranca(
                                                                    regua.tipoEnvio
                                                                )}
                                                            </Td>
                                                            <Td>
                                                                {formaEnvioReguaCobranca(
                                                                    regua.formaEnvio
                                                                )}
                                                            </Td>
                                                            <Td>
                                                                {regua.assunto}
                                                            </Td>
                                                            <Td>
                                                                <IconButton
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    icon={
                                                                        <FiEdit />
                                                                    }
                                                                    onClick={() =>
                                                                        modalRegua.current.onOpen(
                                                                            regua.id
                                                                        )
                                                                    }
                                                                />
                                                                <Tooltip label="Excluir Ficha">
                                                                    <IconButton
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        icon={
                                                                            <Icon
                                                                                as={
                                                                                    FiTrash
                                                                                }
                                                                            />
                                                                        }
                                                                        colorScheme="red"
                                                                        onClick={() => {
                                                                            modalExcluir.current.onOpen(
                                                                                regua.id
                                                                            );
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            </Td>
                                                        </Tr>
                                                    )
                                                )
                                            ) : (
                                                <Tr>
                                                    <Td
                                                        colSpan="4"
                                                        textAlign="center"
                                                        color="gray"
                                                    >
                                                        Nenhuma regua cadastrada
                                                    </Td>
                                                </Tr>
                                            )}
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </GridItem>
                        </Grid>
                    </Box>
                    <Box bg="white" p={4}>
                        <Flex align="center" justify="space-between" mb={4}>
                            <Box>
                                <Heading size="md">Extratos</Heading>
                                <Text fontSize="sm" color="gray">
                                    Configure o envio de extratos
                                </Text>
                            </Box>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                size="sm"
                                id="formEnvio"
                                colorScheme="blue"
                            >
                                Salvar
                            </Button>
                        </Flex>
                        <Grid
                            gridTemplateColumns={{
                                base: "repeat(1,1fr)",
                                lg: "repeat(1,1fr)",
                            }}
                            gap={4}
                        >
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Remetente
                                    </Text>
                                    <Text color="gray" fontSize="xs">
                                        Opcional. Caso deixe em branco será
                                        utilizado o padrão do SMTP
                                    </Text>
                                </Box>
                                <FormInput
                                    size="sm"
                                    placeholder="Digite o e-mail do remetente"
                                    {...register("emailEnvioExtrato")}
                                />
                            </GridItem>{" "}
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Assunto
                                    </Text>
                                </Box>
                                <FormInput
                                    size="sm"
                                    placeholder="Digite o assunto do e-mail"
                                    {...register("emailAssuntoExtrato")}
                                />
                            </GridItem>{" "}
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Mensagem
                                    </Text>
                                </Box>
                                <FormTextarea
                                    size="sm"
                                    placeholder="Digite a menasgem do e-mail"
                                    {...register("emailMensagemExtrato")}
                                />
                            </GridItem>
                        </Grid>
                    </Box>
                    <Box bg="white" p={4}>
                        <Flex align="center" justify="space-between" mb={4}>
                            <Box>
                                <Heading size="md">SMTP</Heading>
                                <Text fontSize="sm" color="gray">
                                    Configure o SMTP para envio de e-mails
                                </Text>
                            </Box>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                size="sm"
                                id="formEnvio"
                                colorScheme="blue"
                            >
                                Salvar
                            </Button>
                        </Flex>
                        <Grid
                            gridTemplateColumns={{
                                base: "repeat(1,1fr)",
                                lg: "repeat(1,1fr)",
                            }}
                            gap={4}
                        >
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Host
                                    </Text>
                                </Box>
                                <FormInput
                                    size="sm"
                                    placeholder="Digite o IP ou Dominio do SMTP"
                                    {...register("smtpHost")}
                                />
                            </GridItem>
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Porta
                                    </Text>
                                </Box>
                                <FormInput
                                    size="sm"
                                    placeholder="Digite a porta do SMTP"
                                    {...register("smtpPort")}
                                />
                            </GridItem>
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Usuário
                                    </Text>
                                </Box>
                                <FormInput
                                    size="sm"
                                    placeholder="Digite o usuário do SMTP"
                                    {...register("smtpUser")}
                                />
                            </GridItem>
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Senha
                                    </Text>
                                </Box>
                                <FormInput
                                    size="sm"
                                    placeholder="Digite a senha do SMTP"
                                    {...register("smtpPass")}
                                />
                            </GridItem>
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        SSL
                                    </Text>
                                </Box>
                                <Checkbox
                                    {...register("smtpSecure")}
                                    isChecked={watch("smtpSecure")}
                                />
                            </GridItem>
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        E-mail remetente
                                    </Text>
                                </Box>
                                <FormInput
                                    size="sm"
                                    placeholder="Digite o e-mail do Remetente"
                                    {...register("smtpFrom")}
                                />
                            </GridItem>
                            <GridItem
                                as={Grid}
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(2,1fr)",
                                }}
                            >
                                <Box>
                                    <Text
                                        fontWeight="semibold"
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Enviar replica para
                                    </Text>
                                </Box>
                                <FormInput
                                    size="sm"
                                    placeholder="Digite o email que deseja colocar como copia"
                                    {...register("smtpReplyTo")}
                                />
                            </GridItem>
                        </Grid>
                    </Box>
                </Flex>
            </Box>
            <ModalReguaCobranca ref={modalRegua} tipo="boleto" />
            <Excluir ref={modalExcluir} onDelete={onDelete} />
        </Box>
    );
};
