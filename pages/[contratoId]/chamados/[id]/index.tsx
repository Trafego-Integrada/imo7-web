import {
    Avatar,
    Icon,
    IconButton,
    Image,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tooltip,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { NextPage } from "next";
import { Input } from "@/../components/Forms/Input";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import {
    FiArrowLeft,
    FiCheck,
    FiPlus,
    FiSend,
    FiSettings,
} from "react-icons/fi";
import { setupApiClient } from "@/services/api";
import { formatoData } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    anexarArquivoChamado,
    atualizarChamado,
    enviarMensagemChamado,
    listarConversas,
    listarIntecoesChamados,
} from "@/services/models/chamado";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { queryClient } from "@/services/queryClient";
import { FormInput } from "@/components/Form/FormInput";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { NextChakraLink } from "@/components/NextChakraLink";
const schema = yup.object({
    mensagem: yup.string().required("Campo Obrigatório"),
});
const Chamado: NextPage = ({ chamado }) => {
    const router = useRouter();
    const { usuario } = useAuth();
    const {
        register,
        control,
        watch,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const enviar = useMutation(enviarMensagemChamado);
    const onSubmit = async (data) => {
        try {
            await enviar.mutateAsync({
                ...data,
                chamadoId: chamado.id,
            });
            queryClient.invalidateQueries("interacoes");
            reset({ mensagem: "" });
        } catch (error) {
            console.log(error);
        }
    };

    const { data: conversas } = useQuery(
        ["conversas", { chamadoId: chamado.id, usuarioId: usuario.id }],
        listarConversas,
        {
            refetchInterval: 10000,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );

    const { mutateAsync: atualizar, isLoading: atualizando } =
        useMutation(atualizarChamado);

    const atualizarStatus = async (status) => {
        try {
            await atualizar({ id: chamado.id, status: "FINALIZADO" });
            router.reload();
        } catch (error) {}
    };
    function Conversa({ data }) {
        const [files, setFiles] = useState();
        const {
            register,
            reset,
            handleSubmit,
            formState: { errors, isSubmitting },
        } = useForm({ resolver: yupResolver(schema) });

        const enviar = useMutation(enviarMensagemChamado);
        const onSubmit = async (form) => {
            try {
                await enviar.mutateAsync({
                    ...form,
                    chamadoId: chamado.id,
                    conversaId: data.id,
                });
                queryClient.invalidateQueries("interacoes");
                reset({ mensagem: "" });
            } catch (error) {
                console.log(error);
            }
        };
        const { data: interacoes } = useQuery(
            ["interacoes", { chamadoId: chamado.id, conversaId: data.id }],
            listarIntecoesChamados,
            {
                onSuccess: () => {
                    const el = document.getElementById("mensagens" + data.id);
                    if (el) {
                        el.scrollTop = el.scrollHeight;
                    }
                },
                refetchInterval: 10000,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
            }
        );
        const upload = useMutation(anexarArquivoChamado);
        const onUpload = async (event) => {
            const formData = new FormData();
            formData.append("chamadoId", chamado.id);
            formData.append("conversaId", data.id);
            formData.append("anexos", event.target.files[0]);
            await upload.mutateAsync(formData);
        };
        function checkURL(url) {
            return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
        }
        return (
            <Box h="full">
                <VStack
                    bg="white"
                    h={{ base: 550, lg: 550 }}
                    p={4}
                    gridGap={4}
                    overflow="auto"
                    overscrollY="auto"
                    scrollBehavior="auto"
                    id={"mensagens" + data.id}
                >
                    {interacoes?.map((item) => (
                        <Flex
                            key={item.id}
                            w="full"
                            gridGap={2}
                            flexDir={
                                usuario?.id == item.usuario?.id
                                    ? "row-reverse"
                                    : "row"
                            }
                        >
                            <Tooltip
                                label={`${item.usuario?.nome} ${
                                    item.usuario.contratosInquilino?.filter(
                                        (i) => i.id == chamado.contratoId
                                    ).length
                                        ? "(Inquilino)"
                                        : item.usuario.contratosProprietario?.filter(
                                              (i) => i.id == chamado.contratoId
                                          ).length
                                        ? "(Proprietário)"
                                        : item.usuario.contratosFiador?.filter(
                                              (i) => i.id == chamado.contratoId
                                          ).length
                                        ? "(Fiador)"
                                        : ""
                                }`}
                            >
                                <Avatar name={item.usuario?.nome} size="sm" />
                            </Tooltip>
                            <Box maxW="80%">
                                <Box
                                    bg={
                                        usuario?.id == item.usuario?.id
                                            ? "blue.100"
                                            : "gray.100"
                                    }
                                    px={4}
                                    py={2}
                                    rounded="lg"
                                >
                                    {item.anexos.length ? (
                                        <Flex flexWrap="wrap" gap={4}>
                                            {item.anexos.map((item) => (
                                                <Box key={item.id}>
                                                    {checkURL(item.anexo) ? (
                                                        <>
                                                            <Image
                                                                src={item.anexo}
                                                                h={40}
                                                                alt={item.anexo}
                                                            />
                                                            <NextChakraLink
                                                                href={
                                                                    item.anexo
                                                                }
                                                            >
                                                                <Button variant="link">
                                                                    Baixar anexo
                                                                </Button>
                                                            </NextChakraLink>
                                                        </>
                                                    ) : (
                                                        <NextChakraLink
                                                            href={item.anexo}
                                                        >
                                                            <Button variant="link">
                                                                Baixar anexo
                                                            </Button>
                                                        </NextChakraLink>
                                                    )}
                                                </Box>
                                            ))}
                                        </Flex>
                                    ) : (
                                        item.mensagem
                                    )}
                                </Box>
                                <Text ml={2} fontSize="xs" color="gray.400">
                                    Enviado em{" "}
                                    {formatoData(item.createdAt, "DATA_HORA")}
                                </Text>
                            </Box>
                        </Flex>
                    ))}
                </VStack>
                <Flex
                    as="form"
                    onSubmit={handleSubmit(onSubmit)}
                    maxW="calc(100% - 2rem)"
                    position="absolute"
                    bottom={4}
                    left={4}
                    right={0}
                    mx={4}
                >
                    <FormInput
                        leftElement={
                            <label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        onUpload(e);
                                    }}
                                    style={{
                                        display: "none",
                                    }}
                                />
                                <Icon as={GrAttachment} />
                            </label>
                        }
                        rightElement={
                            <IconButton
                                variant="ghost"
                                icon={<Icon as={FiSend} />}
                                colorScheme="gray"
                                position="absolute"
                                top={0}
                                right={4}
                                type="submit"
                                isLoading={isSubmitting}
                            />
                        }
                        placeholder="Escreva sua mensagem"
                        error={errors.mensagem?.message}
                        {...register("mensagem")}
                    />
                </Flex>
            </Box>
        );
    }

    function DataTabs({ data }) {
        return (
            <>
                <Tabs size="sm" w="full" maxH="full">
                    <TabList>
                        {data.map((item, index) => (
                            <Tab key={index}>
                                <Text>
                                    {item.participantes?.map((item, indexP) => (
                                        <Text as="span" key={item.id}>
                                            {indexP > 0 && ", "}
                                            {item.nome}
                                        </Text>
                                    ))}
                                </Text>
                            </Tab>
                        ))}{" "}
                    </TabList>
                    <TabPanels maxH="full">
                        {data.map((tab, index) => (
                            <TabPanel key={index} h="full">
                                <Conversa data={tab} />
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
            </>
        );
    }
    return (
        <LayoutPainel>
            <Flex py={2} justify="space-between">
                <Button
                    size="sm"
                    leftIcon={<Icon as={FiArrowLeft} />}
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Voltar
                </Button>
                <Button
                    size="sm"
                    rightIcon={<Icon as={FiCheck} />}
                    variant="outline"
                    colorScheme="blue"
                    isLoading={atualizando}
                    onClick={() => atualizarStatus("FINALIZADO")}
                >
                    Finalizar
                </Button>
            </Flex>
            <Flex
                flexDir={{ base: "column", lg: "row" }}
                gridTemplateColumns="repeat(2, 1fr)"
            >
                <VStack align="flex-start" w={96} gridGap={4} p={4}>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            Título
                        </Text>
                        <Text fontWeight="bold">{chamado.titulo}</Text>
                    </Box>
                    <VStack align="flex-start" w="full">
                        <Heading size="sm">Participantes</Heading>
                        <Flex
                            gridGap={2}
                            bg="white"
                            w="full"
                            rounded="lg"
                            p={4}
                        >
                            <Avatar name={chamado.criador?.nome} size="sm" />
                            <Flex flexDirection="column" justify="center">
                                <Text lineHeight="none" fontWeight="bold">
                                    {chamado.criador?.nome}
                                </Text>
                                <Text
                                    lineHeight="none"
                                    fontWeight="semibold"
                                    color="gray.400"
                                >
                                    Inquilino
                                </Text>
                            </Flex>
                        </Flex>
                        {/* <Flex gridGap={2}>
                            <Avatar name="Imobiliaria" size="sm" />
                            <Flex flexDirection="column" justify="center">
                                <Text lineHeight="none" fontWeight="bold">
                                    Nome do Atendente
                                </Text>
                                <Text
                                    lineHeight="none"
                                    fontWeight="semibold"
                                    color="gray.400"
                                >
                                    Imobiliria
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex gridGap={2}>
                            <Avatar name="Imobiliaria" size="sm" />
                            <Flex flexDirection="column" justify="center">
                                <Text lineHeight="none" fontWeight="bold">
                                    Nome do Atendente
                                </Text>
                                <Text
                                    lineHeight="none"
                                    fontWeight="semibold"
                                    color="gray.400"
                                >
                                    Imobiliria
                                </Text>
                            </Flex>
                        </Flex> */}
                    </VStack>
                    <VStack align="flex-start" w="full">
                        <Heading size="sm">Contrato</Heading>
                        <Box gridGap={2} bg="white" w="full" rounded="lg" p={4}>
                            <Text fontWeight="bold">
                                {chamado.contrato?.codigo}
                            </Text>
                            <Text fontSize="xs">
                                {chamado.contrato?.imovel?.endereco}
                            </Text>
                        </Box>
                    </VStack>
                    <Box>
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                            Chamado aberto em{" "}
                            <Text as="span" fontWeight="bold">
                                {formatoData(chamado.createdAt, "DATA_HORA")}
                            </Text>{" "}
                            por{" "}
                            <Text as="span" fontWeight="bold">
                                {chamado.criador?.nome}
                            </Text>
                        </Text>
                    </Box>
                </VStack>
                <VStack
                    pos="relative"
                    bg="white"
                    h="calc(100vh - 13rem)"
                    w="full"
                    rounded="xl"
                    shadow="sm"
                    p={4}
                    gridGap={4}
                >
                    {conversas && <DataTabs data={conversas} />}
                </VStack>
            </Flex>
        </LayoutPainel>
    );
};

export default Chamado;
export const getServerSideProps = async (ctx) => {
    const { id } = ctx.query;
    const api = setupApiClient(ctx);
    const { data } = await api.get(`chamado/${id}`);
    return {
        props: {
            chamado: data,
        },
    };
};
