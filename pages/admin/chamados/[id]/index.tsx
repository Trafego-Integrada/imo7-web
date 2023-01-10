import {
    Avatar,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Text,
    Tooltip,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Layout } from "@/components/Layout/layout";
import { ModalChamados } from "@/components/Modals/chamados";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { useMutation, useQuery } from "react-query";
import {
    anexarArquivoChamado,
    atualizarChamado,
    enviarMensagemChamado,
    listarChamados,
    listarConversas,
    listarIntecoesChamados,
} from "@/services/models/chamado";
import { setupApiClient } from "@/services/api";
import moment from "moment";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { queryClient } from "@/services/queryClient";
import { formatoData } from "@/helpers/helpers";
import { FormInput } from "@/components/Form/FormInput";
import {
    FiArchive,
    FiArrowLeft,
    FiCheck,
    FiPlus,
    FiSend,
    FiUpload,
    FiUploadCloud,
} from "react-icons/fi";
import * as yup from "yup";
import { useRouter } from "next/router";
import { ModalNovaConversa } from "@/components/Modals/NovaConversa";
import { BiUpload } from "react-icons/bi";
import { FaFileUpload } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { AiOutlineRollback } from "react-icons/ai";
import { NextChakraLink } from "@/components/NextChakraLink";
import prisma from "@/lib/prisma";
const schema = yup.object({
    mensagem: yup.string().required("Campo Obrigatório"),
});
const Cobrancas = ({ chamado }) => {
    const router = useRouter();
    const modalchamados = useRef();
    const [filtro, setFiltro] = useState({});
    const { data } = useQuery(["chamados", filtro], listarChamados);

    const { usuario } = useAuth();

    const { data: conversas } = useQuery(
        ["conversas", { chamadoId: chamado.id }],
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
            await atualizar({ id: chamado.id, status });
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
            console.log(event);
            console.log("ok");
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
                <Flex as="form" onSubmit={handleSubmit(onSubmit)} w="full">
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
        const modal = useRef();
        return (
            <>
                <Tabs size="sm">
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
                        <IconButton
                            variant="ghost"
                            colorScheme="blue"
                            icon={<Icon as={FiPlus} />}
                            onClick={() => modal.current.onOpen()}
                        />
                    </TabList>
                    <TabPanels>
                        {data.map((tab, index) => (
                            <TabPanel key={index}>
                                <Conversa data={tab} />
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
                <ModalNovaConversa
                    ref={modal}
                    chamadoId={chamado.id}
                    contratoId={chamado.contratoId}
                />
            </>
        );
    }

    return (
        <>
            <Layout title="Chamados">
                <Box p={5}>
                    <Flex py={2} justify="space-between">
                        <Button
                            leftIcon={<Icon as={FiArrowLeft} />}
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Voltar
                        </Button>
                        <Flex gridGap={4}>
                            {chamado.status == "FINALIZADO" ? (
                                <>
                                    <Button
                                        size="sm"
                                        rightIcon={
                                            <Icon as={AiOutlineRollback} />
                                        }
                                        colorScheme="blue"
                                        isLoading={atualizando}
                                        onClick={() =>
                                            atualizarStatus("ABERTO")
                                        }
                                    >
                                        Reabrir
                                    </Button>
                                    <Button
                                        size="sm"
                                        rightIcon={<Icon as={FiArchive} />}
                                        variant="outline"
                                        colorScheme="gray"
                                        isLoading={atualizando}
                                        onClick={() =>
                                            atualizarStatus("ARQUIVADO")
                                        }
                                    >
                                        Arquivar
                                    </Button>
                                </>
                            ) : chamado.status == "ARQUIVADO" ? (
                                <Button
                                    size="sm"
                                    rightIcon={<Icon as={AiOutlineRollback} />}
                                    colorScheme="blue"
                                    isLoading={atualizando}
                                    onClick={() => atualizarStatus("ABERTO")}
                                >
                                    Reabrir
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    rightIcon={<Icon as={FiCheck} />}
                                    variant="outline"
                                    colorScheme="blue"
                                    isLoading={atualizando}
                                    onClick={() =>
                                        atualizarStatus("FINALIZADO")
                                    }
                                >
                                    Finalizar
                                </Button>
                            )}
                        </Flex>
                    </Flex>
                    <Grid
                        gap={4}
                        gridTemplateColumns={{
                            base: "repeat(1,1fr)",
                            lg: "repeat(2,1fr)",
                        }}
                    >
                        <GridItem
                            as={Grid}
                            gridTemplateColumns={{ base: "repeat(2,1fr)" }}
                            p={4}
                            bg="white"
                        >
                            <GridItem>
                                <Text fontWeight="bold" fontSize="sm">
                                    Nº do Chamado
                                </Text>
                                <Text>{chamado.id}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontWeight="bold" fontSize="sm">
                                    Departamento
                                </Text>
                                <Text>
                                    {chamado.assunto?.departamento?.titulo}
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Text fontWeight="bold" fontSize="sm">
                                    Assunto
                                </Text>
                                <Text>{chamado.assunto?.titulo}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 1, lg: 3 }}>
                                <Text fontWeight="bold" fontSize="sm">
                                    Título
                                </Text>
                                <Text>{chamado.titulo}</Text>
                            </GridItem>
                        </GridItem>
                        <GridItem
                            as={Grid}
                            gridTemplateColumns={{ base: "repeat(2,1fr)" }}
                            p={4}
                            bg="white"
                        >
                            <GridItem>
                                <Text fontWeight="bold" fontSize="sm">
                                    Data da Abertura
                                </Text>
                                <Text>
                                    {moment(chamado.createdAt).format(
                                        "DD/MM/YYYY HH:mm"
                                    )}
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Text fontWeight="bold" fontSize="sm">
                                    Aberto por
                                </Text>
                                <Text>{chamado.criador?.nome}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontWeight="bold" fontSize="sm">
                                    Status
                                </Text>
                                <Tag>{chamado.status}</Tag>
                            </GridItem>
                        </GridItem>
                        <GridItem colSpan={{ base: 1, lg: 2 }} bg="white">
                            {conversas && <DataTabs data={conversas} />}
                        </GridItem>
                    </Grid>
                </Box>
            </Layout>
            <ModalChamados ref={modalchamados} />
        </>
    );
};

export default Cobrancas;

export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        const { id } = ctx.query;
        const api = setupApiClient(ctx);
        const data = await prisma.chamado.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                assunto: {
                    include: {
                        departamento: true,
                    },
                },
                participantes: true,
                criador: true,
            },
        });
        console.log(data);
        return {
            props: {
                chamado: JSON.parse(JSON.stringify(data)),
            },
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
