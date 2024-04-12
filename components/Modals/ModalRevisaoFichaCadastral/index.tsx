import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { Historicos } from "@/components/Pages/Historicos";
import { verificarExtensaoImagem } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/apiClient";
import { imo7ApiService } from "@/services/apiServiceUsage";
import { listarCategoriaCampoFichas } from "@/services/models/categoriaCampoFicha";
import {
    atualizarFicha,
    buscarFicha,
    cadastrarFicha,
} from "@/services/models/fichaCadastral";
import { cadastrarValidacao } from "@/services/models/validacaofacial";
import { queryClient } from "@/services/queryClient";
import {
    Avatar,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Progress,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiDownload,
    FiEye,
    FiLink,
    FiSearch,
} from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { Documentos } from "../Contrato/Documentos";
import { ConsultasNetrin } from "../ModalProcesso/ConsultaNetrin";
import { ModalTribunalJustica } from "../ModalRevisaoFichaCadastral2/TribunalJustica/Modal";
import { AnaliseCampo } from "./AnaliseCampo";
const schema = yup.object({
    status: yup.string().required("Status é obrigatório"),
    motivoReprovacaoId: yup.string().when("status", {
        is: "reprovada", // quando o campo status for igual a 'reprovado'
        then: yup.string().required("Motivo da Reprovação é obrigatório"), // torna o campo motivoReprovacaoId obrigatório
        otherwise: yup.string().nullable(), // em outros casos, o campo motivoReprovacaoId não é obrigatório
    }),
});
const ModalBase = ({}, ref) => {
    const { usuario } = useAuth();
    const preview = useRef();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast();
    const {
        register,
        control,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const buscar = useMutation(buscarFicha, {
        onSuccess: (data) => {
            reset(data);
        },
    });

    const cadastrar = useMutation(cadastrarFicha);
    const atualizar = useMutation(atualizarFicha);
    const onSubmit = async (data) => {
        try {
            if (data.id) {
                await atualizar.mutateAsync(data);
                onClose();
                toast({ title: "Ficha Cadastrada", status: "success" });
                queryClient.invalidateQueries(["fichas"]);
            } else {
                await cadastrar.mutateAsync(data);
                onClose();
                toast({ title: "Ficha atualizada", status: "success" });
                queryClient.invalidateQueries(["fichas"]);
            }
        } catch (error) {
            //console.log(error);
        }
    };

    const { data: campos } = useQuery(
        ["categoriasCampos", { tipoFicha: watch("modelo.tipo") }],
        listarCategoriaCampoFichas,
        { refetchOnReconnect: false, refetchOnWindowFocus: false }
    );

    const { data: motivos } = useQuery(
        ["motivosReprovacao", {}],
        imo7ApiService("motivoReprovacao").list,
        { refetchOnReconnect: false, refetchOnWindowFocus: false }
    );
    //console.log(motivos);
    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            reset({});
            if (id) {
                buscar.mutateAsync(id);
                onOpen();
            } else {
                onOpen();
            }
        },
    }));

    const router = useRouter();

    const cadastrarValidacaoFacial = useMutation(cadastrarValidacao);

    const onCadastrarValidacao = async ({
        fichaCadastralId,
        cpf,
        campoFichaCadastralCodigo,
    }) => {
        await cadastrarValidacaoFacial.mutateAsync({
            fichaCadastralId,
            cpf,
            campoFichaCadastralCodigo,
        });
        buscar.mutate(fichaCadastralId);
    };

    const [consultandoNetrin, setConsultandoNetrin] = useState(false);
    const consultarNetrin = async (data) => {
        try {
            setConsultandoNetrin(true);
            const response = await api.post("v1/integracao/netrin", {
                ...data,
                processoId: watch("processoId"),
                fichaCadastralId: watch("id"),
            });
            queryClient.invalidateQueries(["consultasNetrin"]);
            toast({
                title: "Consulta realizada com sucesso, entre na aba consultas para visualizar o documento",
                status: "success",
            });
            buscar.mutateAsync(watch("id"));
            setConsultandoNetrin(false);
        } catch (error) {
            setConsultandoNetrin(false);
            //console.log(error);
            toast({
                title: "Houve um problema",
                description: error?.response?.data?.message,
                status: "warning",
            });
        }
    };
    const { data } = useQuery(
        [
            "consultasNetrin",
            {
                processoId: watch("processoId"),
                fichaCadastralId: watch("id"),
            },
        ],
        async ({ queryKey }) => {
            try {
                const response = await api.get("v1/integracao/netrin", {
                    params: {
                        ...queryKey[1],
                    },
                });

                return response?.data;
            } catch (error) {
                throw Error(error.message);
            }
        }
    );
    const totalProtestos = (protestos) => {
        let total = 0;
        if (protestos.code != 606) {
            Object.entries(protestos)?.map((i) => {
                //console.log("Item", i);

                if (i.length > 1) {
                    i[1].map((i) => {
                        //console.log("Item2", i);
                        total += i.protestos?.length;
                    });
                }
            });
        }

        return total;
    };
    //console.log("DAdos", watch());
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />

            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Ficha Cadastral</ModalHeader>
                <ModalBody>
                    <Tabs size="sm">
                        <TabList>
                            {/* <Tab>Geral</Tab> */}
                            {watch("id") && <Tab>Revisão</Tab>}
                            {watch("id") && (
                                <Tab>
                                    Anexos{" "}
                                    <Tag colorScheme="blue" size="sm" ml={1}>
                                        {watch("_count.Anexo")}
                                    </Tag>
                                </Tab>
                            )}
                            <Tab>Histórico da FIcha</Tab>
                            <Tab>Histórico do Processo</Tab>
                            <Tab>
                                Consultas{" "}
                                <Tag colorScheme="blue" size="sm" ml={1}>
                                    {watch("_count.ConsultaNetrin")}
                                </Tag>
                            </Tab>
                        </TabList>
                        <TabPanels>
                            {/* <TabPanel px={0}>
                                <Box bg="white" p={4} rounded="lg">
                                    <Grid
                                        gridTemplateColumns={{
                                            base: "repeat(1, 1fr)",
                                            lg: "repeat(2, 1fr)",
                                        }}
                                        gap={4}
                                    >
                                        <GridItem>
                                            <Controller
                                                control={control}
                                                name="modelo"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        label="Ficha Cadastral"
                                                        options={modelos?.data}
                                                        placeholder="Selecione..."
                                                        error={
                                                            errors.modelo
                                                                ?.message
                                                        }
                                                        getOptionLabel={(e) =>
                                                            `${e.tipo} - ${e.nome}`
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                    />
                                                )}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="Descrição"
                                                placeholder="Descrição"
                                                error={
                                                    errors.descricao?.message
                                                }
                                                {...register("descricao")}
                                                descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="Nome / Razão Social"
                                                placeholder="nome"
                                                error={errors.nome?.message}
                                                {...register("nome")}
                                                descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="CPF/CNPJ"
                                                placeholder="CPF/CNPJ"
                                                error={
                                                    errors.documento?.message
                                                }
                                                {...register("documento")}
                                                descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="E-mail"
                                                placeholder="e-mail"
                                                error={errors.email?.message}
                                                {...register("email")}
                                                descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="Telefone / Celular"
                                                placeholder="Telefone"
                                                error={errors.telefone?.message}
                                                {...register("telefone")}
                                                descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                            />
                                        </GridItem>
                                    </Grid>
                                </Box>
                            </TabPanel> */}

                            <TabPanel px={0}>
                                <Box
                                    id="formRevisarFichaCadastral"
                                    as="form"
                                    onSubmit={handleSubmit(onSubmit)}
                                    bg="white"
                                    p={4}
                                    rounded="lg"
                                >
                                    <Grid gap={4}>
                                        <GridItem>
                                            <FormTextarea
                                                size="sm"
                                                {...register("observacoes")}
                                                placeholder="Observações (será impresso somente no PDF)"
                                            />
                                        </GridItem>
                                        {campos?.data
                                            ?.filter((i) =>
                                                i?.campos?.find(
                                                    (e) =>
                                                        watch(
                                                            `modelo.campos.${e.codigo}`
                                                        )?.exibir
                                                )
                                            )
                                            .map((item) => (
                                                <Box
                                                    key={item.id}
                                                    bg="gray.100"
                                                    p={4}
                                                    overflow="auto"
                                                >
                                                    <Heading size="sm">
                                                        {item.nome}
                                                    </Heading>
                                                    <Grid
                                                        mt={4}
                                                        gridTemplateColumns={{
                                                            base: "repeat(1,1fr)",
                                                            lg: "repeat(5,1fr)",
                                                        }}
                                                        gap={4}
                                                    >
                                                        {item?.campos
                                                            ?.filter((i) => {
                                                                if (
                                                                    (watch(
                                                                        `modelo.campos.${i.codigo}`
                                                                    ) &&
                                                                        watch(
                                                                            `modelo.campos.${i.codigo}`
                                                                        )
                                                                            ?.exibir &&
                                                                        !i.dependencia) ||
                                                                    (watch(
                                                                        `modelo.campos.${i.codigo}`
                                                                    ) &&
                                                                        watch(
                                                                            `modelo.campos.${i.codigo}`
                                                                        )
                                                                            ?.exibir &&
                                                                        ((i
                                                                            .dependencia
                                                                            ?.codigo &&
                                                                            !i.dependenciaValor &&
                                                                            watch(
                                                                                `preenchimento`
                                                                            ).find(
                                                                                (
                                                                                    ii
                                                                                ) =>
                                                                                    ii.campoFichaCadastralCodigo ==
                                                                                    i
                                                                                        .dependencia
                                                                                        ?.codigo
                                                                            )) ||
                                                                            (i
                                                                                .dependencia
                                                                                ?.codigo &&
                                                                                i.dependenciaValor &&
                                                                                JSON.parse(
                                                                                    i.dependenciaValor
                                                                                ).includes(
                                                                                    watch(
                                                                                        `preenchimento`
                                                                                    ).find(
                                                                                        (
                                                                                            ii
                                                                                        ) =>
                                                                                            ii.campoFichaCadastralCodigo ==
                                                                                            i
                                                                                                .dependencia
                                                                                                ?.codigo
                                                                                    )
                                                                                        ?.valor
                                                                                ))))
                                                                ) {
                                                                    return true;
                                                                } else {
                                                                    return false;
                                                                }
                                                            })
                                                            ?.map((i) => (
                                                                <GridItem
                                                                    key={i.id}
                                                                    colSpan={
                                                                        i.tipoCampo ==
                                                                            "cpf" ||
                                                                        i.tipoCampo ==
                                                                            "cnpj"
                                                                            ? 5
                                                                            : i.colSpan
                                                                    }
                                                                >
                                                                    <Flex
                                                                        align="center"
                                                                        gap={2}
                                                                    >
                                                                        <Text fontSize="xs">
                                                                            {
                                                                                i.nome
                                                                            }{" "}
                                                                        </Text>
                                                                        {}
                                                                        {watch(
                                                                            "preenchimento"
                                                                        )?.find(
                                                                            (
                                                                                p
                                                                            ) =>
                                                                                p.campoFichaCadastralCodigo ==
                                                                                i.codigo
                                                                        )
                                                                            ?.aprovado ? (
                                                                            <Tag
                                                                                colorScheme="green"
                                                                                size="sm"
                                                                            >
                                                                                Aprovado
                                                                            </Tag>
                                                                        ) : watch(
                                                                              "preenchimento"
                                                                          )?.find(
                                                                              (
                                                                                  p
                                                                              ) =>
                                                                                  p.campoFichaCadastralCodigo ==
                                                                                  i.codigo
                                                                          )
                                                                              ?.motivoReprovacao ? (
                                                                            <Tooltip
                                                                                label={
                                                                                    "Motivo: " +
                                                                                    watch(
                                                                                        "preenchimento"
                                                                                    )?.find(
                                                                                        (
                                                                                            p
                                                                                        ) =>
                                                                                            p.campoFichaCadastralCodigo ==
                                                                                            i.codigo
                                                                                    )
                                                                                        ?.motivoReprovacao
                                                                                }
                                                                            >
                                                                                <Tag
                                                                                    colorScheme="red"
                                                                                    size="sm"
                                                                                >
                                                                                    Reprovado
                                                                                </Tag>
                                                                            </Tooltip>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </Flex>

                                                                    <Flex
                                                                        gap={2}
                                                                    >
                                                                        <Text
                                                                            fontSize="sm"
                                                                            fontWeight="bold"
                                                                        >
                                                                            {i.tipoCampo ==
                                                                                "image" ||
                                                                            i.tipoCampo ==
                                                                                "files" ||
                                                                            i.tipoCampo ==
                                                                                "file" ? (
                                                                                <Flex
                                                                                    wrap="wrap"
                                                                                    gap={
                                                                                        2
                                                                                    }
                                                                                >
                                                                                    {watch(
                                                                                        "preenchimento"
                                                                                    )?.find(
                                                                                        (
                                                                                            p
                                                                                        ) =>
                                                                                            p.campoFichaCadastralCodigo ==
                                                                                            i.codigo
                                                                                    )
                                                                                        ?.valor &&
                                                                                        JSON.parse(
                                                                                            watch(
                                                                                                "preenchimento"
                                                                                            )?.find(
                                                                                                (
                                                                                                    p
                                                                                                ) =>
                                                                                                    p.campoFichaCadastralCodigo ==
                                                                                                    i.codigo
                                                                                            )
                                                                                                ?.valor
                                                                                        ).map(
                                                                                            (
                                                                                                item
                                                                                            ) => (
                                                                                                <Box
                                                                                                    key={
                                                                                                        item
                                                                                                    }
                                                                                                >
                                                                                                    {verificarExtensaoImagem(
                                                                                                        item
                                                                                                    )
                                                                                                        .eImagem ? (
                                                                                                        <Image
                                                                                                            src={
                                                                                                                item
                                                                                                            }
                                                                                                            w={
                                                                                                                32
                                                                                                            }
                                                                                                            h={
                                                                                                                32
                                                                                                            }
                                                                                                            cursor="pointer"
                                                                                                            onClick={() =>
                                                                                                                preview.current.onOpen(
                                                                                                                    item
                                                                                                                )
                                                                                                            }
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <Flex
                                                                                                            align="center"
                                                                                                            justify="center"
                                                                                                            h={
                                                                                                                32
                                                                                                            }
                                                                                                            w={
                                                                                                                32
                                                                                                            }
                                                                                                            bg="gray.700"
                                                                                                            cursor="pointer"
                                                                                                            onClick={() =>
                                                                                                                preview.current.onOpen(
                                                                                                                    item
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <Text
                                                                                                                color="white"
                                                                                                                fontSize="lg"
                                                                                                            >
                                                                                                                {verificarExtensaoImagem(
                                                                                                                    item
                                                                                                                ).extensao?.toLocaleUpperCase()}
                                                                                                            </Text>
                                                                                                        </Flex>
                                                                                                    )}
                                                                                                    <Flex
                                                                                                        gap={
                                                                                                            1
                                                                                                        }
                                                                                                    >
                                                                                                        <Tooltip label="Visualizar Arquivo">
                                                                                                            <IconButton
                                                                                                                size="xs"
                                                                                                                icon={
                                                                                                                    <Icon
                                                                                                                        as={
                                                                                                                            FiEye
                                                                                                                        }
                                                                                                                    />
                                                                                                                }
                                                                                                                onClick={() =>
                                                                                                                    preview.current.onOpen(
                                                                                                                        item
                                                                                                                    )
                                                                                                                }
                                                                                                            />
                                                                                                        </Tooltip>
                                                                                                        <Tooltip label="Baixar Arquivo">
                                                                                                            <Link
                                                                                                                href={
                                                                                                                    item
                                                                                                                        ? item
                                                                                                                        : "#"
                                                                                                                }
                                                                                                                passHref
                                                                                                            >
                                                                                                                <IconButton
                                                                                                                    size="xs"
                                                                                                                    icon={
                                                                                                                        <Icon
                                                                                                                            as={
                                                                                                                                FiDownload
                                                                                                                            }
                                                                                                                        />
                                                                                                                    }
                                                                                                                />
                                                                                                            </Link>
                                                                                                        </Tooltip>
                                                                                                    </Flex>
                                                                                                </Box>
                                                                                            )
                                                                                        )}
                                                                                    <AnaliseCampo
                                                                                        campoCodigo={
                                                                                            i.codigo
                                                                                        }
                                                                                        fichaId={watch(
                                                                                            "id"
                                                                                        )}
                                                                                        buscarFicha={
                                                                                            buscar
                                                                                        }
                                                                                    />
                                                                                </Flex>
                                                                            ) : i.tipoCampo ==
                                                                              "file" ? (
                                                                                <Box>
                                                                                    <Flex>
                                                                                        {watch(
                                                                                            "preenchimento"
                                                                                        )?.find(
                                                                                            (
                                                                                                p
                                                                                            ) =>
                                                                                                p.campoFichaCadastralCodigo ==
                                                                                                i.codigo
                                                                                        )
                                                                                            ?.valor ? (
                                                                                            <>
                                                                                                {verificarExtensaoImagem(
                                                                                                    watch(
                                                                                                        "preenchimento"
                                                                                                    )?.find(
                                                                                                        (
                                                                                                            p
                                                                                                        ) =>
                                                                                                            p.campoFichaCadastralCodigo ==
                                                                                                            i.codigo
                                                                                                    )
                                                                                                        ?.valor
                                                                                                )
                                                                                                    .eImagem ? (
                                                                                                    <Image
                                                                                                        src={
                                                                                                            watch(
                                                                                                                "preenchimento"
                                                                                                            )?.find(
                                                                                                                (
                                                                                                                    p
                                                                                                                ) =>
                                                                                                                    p.campoFichaCadastralCodigo ==
                                                                                                                    i.codigo
                                                                                                            )
                                                                                                                ?.valor
                                                                                                        }
                                                                                                        w={
                                                                                                            32
                                                                                                        }
                                                                                                        h={
                                                                                                            32
                                                                                                        }
                                                                                                        cursor="pointer"
                                                                                                        onClick={() =>
                                                                                                            preview.current.onOpen(
                                                                                                                watch(
                                                                                                                    "preenchimento"
                                                                                                                )?.find(
                                                                                                                    (
                                                                                                                        p
                                                                                                                    ) =>
                                                                                                                        p.campoFichaCadastralCodigo ==
                                                                                                                        i.codigo
                                                                                                                )
                                                                                                                    ?.valor
                                                                                                            )
                                                                                                        }
                                                                                                    />
                                                                                                ) : (
                                                                                                    <Flex
                                                                                                        align="center"
                                                                                                        justify="center"
                                                                                                        h={
                                                                                                            32
                                                                                                        }
                                                                                                        w={
                                                                                                            32
                                                                                                        }
                                                                                                        bg="gray.700"
                                                                                                        cursor="pointer"
                                                                                                        onClick={() =>
                                                                                                            preview.current.onOpen(
                                                                                                                watch(
                                                                                                                    "preenchimento"
                                                                                                                )?.find(
                                                                                                                    (
                                                                                                                        p
                                                                                                                    ) =>
                                                                                                                        p.campoFichaCadastralCodigo ==
                                                                                                                        i.codigo
                                                                                                                )
                                                                                                                    ?.valor
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        <Text
                                                                                                            color="white"
                                                                                                            fontSize="lg"
                                                                                                        >
                                                                                                            {verificarExtensaoImagem(
                                                                                                                watch(
                                                                                                                    "preenchimento"
                                                                                                                )?.find(
                                                                                                                    (
                                                                                                                        p
                                                                                                                    ) =>
                                                                                                                        p.campoFichaCadastralCodigo ==
                                                                                                                        i.codigo
                                                                                                                )
                                                                                                                    ?.valor
                                                                                                            ).extensao?.toLocaleUpperCase()}
                                                                                                        </Text>
                                                                                                    </Flex>
                                                                                                )}
                                                                                                <Tooltip label="Visualizar Arquivo">
                                                                                                    <IconButton
                                                                                                        size="xs"
                                                                                                        icon={
                                                                                                            <Icon
                                                                                                                as={
                                                                                                                    FiEye
                                                                                                                }
                                                                                                            />
                                                                                                        }
                                                                                                        onClick={() =>
                                                                                                            preview.current.onOpen(
                                                                                                                watch(
                                                                                                                    "preenchimento"
                                                                                                                )?.find(
                                                                                                                    (
                                                                                                                        p
                                                                                                                    ) =>
                                                                                                                        p.campoFichaCadastralCodigo ==
                                                                                                                        i.codigo
                                                                                                                )
                                                                                                                    ?.valor
                                                                                                            )
                                                                                                        }
                                                                                                    />
                                                                                                </Tooltip>
                                                                                                <Tooltip label="Baixar Arquivo">
                                                                                                    <Link
                                                                                                        href={
                                                                                                            watch(
                                                                                                                "preenchimento"
                                                                                                            )?.find(
                                                                                                                (
                                                                                                                    p
                                                                                                                ) =>
                                                                                                                    p.campoFichaCadastralCodigo ==
                                                                                                                    i.codigo
                                                                                                            )
                                                                                                                ?.valor
                                                                                                                ? watch(
                                                                                                                      "preenchimento"
                                                                                                                  )?.find(
                                                                                                                      (
                                                                                                                          p
                                                                                                                      ) =>
                                                                                                                          p.campoFichaCadastralCodigo ==
                                                                                                                          i.codigo
                                                                                                                  )
                                                                                                                      ?.valor
                                                                                                                : "#"
                                                                                                        }
                                                                                                        passHref
                                                                                                    >
                                                                                                        <IconButton
                                                                                                            size="xs"
                                                                                                            icon={
                                                                                                                <Icon
                                                                                                                    as={
                                                                                                                        FiDownload
                                                                                                                    }
                                                                                                                />
                                                                                                            }
                                                                                                        />
                                                                                                    </Link>
                                                                                                </Tooltip>
                                                                                            </>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                        <AnaliseCampo
                                                                                            campoCodigo={
                                                                                                i.codigo
                                                                                            }
                                                                                            fichaId={watch(
                                                                                                "id"
                                                                                            )}
                                                                                            buscarFicha={
                                                                                                buscar
                                                                                            }
                                                                                        />
                                                                                    </Flex>
                                                                                </Box>
                                                                            ) : (
                                                                                <>
                                                                                    <Flex
                                                                                        align="center"
                                                                                        gap={
                                                                                            2
                                                                                        }
                                                                                    >
                                                                                        {i.tipoCampo ==
                                                                                        "date"
                                                                                            ? moment(
                                                                                                  watch(
                                                                                                      "preenchimento"
                                                                                                  )?.find(
                                                                                                      (
                                                                                                          p
                                                                                                      ) =>
                                                                                                          p.campoFichaCadastralCodigo ==
                                                                                                          i.codigo
                                                                                                  )
                                                                                                      ?.valor
                                                                                              ).format(
                                                                                                  "DD/MM/YYYY"
                                                                                              )
                                                                                            : watch(
                                                                                                  "preenchimento"
                                                                                              )?.find(
                                                                                                  (
                                                                                                      p
                                                                                                  ) =>
                                                                                                      p.campoFichaCadastralCodigo ==
                                                                                                      i.codigo
                                                                                              )
                                                                                                  ?.valor}
                                                                                        <AnaliseCampo
                                                                                            campoCodigo={
                                                                                                i.codigo
                                                                                            }
                                                                                            fichaId={watch(
                                                                                                "id"
                                                                                            )}
                                                                                            buscarFicha={
                                                                                                buscar
                                                                                            }
                                                                                        />
                                                                                    </Flex>
                                                                                </>
                                                                            )}
                                                                        </Text>
                                                                        {i.tipoCampo ==
                                                                            "cpf" && (
                                                                            <Flex
                                                                                gap={
                                                                                    4
                                                                                }
                                                                                align="center"
                                                                            >
                                                                                <Box
                                                                                    minW={
                                                                                        44
                                                                                    }
                                                                                >
                                                                                    <Text fontSize="xs">
                                                                                        Validação
                                                                                        Facial
                                                                                    </Text>
                                                                                    {watch(
                                                                                        "preenchimento"
                                                                                    )?.find(
                                                                                        (
                                                                                            p
                                                                                        ) =>
                                                                                            p.campoFichaCadastralCodigo ==
                                                                                            i.codigo
                                                                                    )
                                                                                        ?.validacaoFacial
                                                                                        .length >
                                                                                    0 ? (
                                                                                        <Text as="span">
                                                                                            {watch(
                                                                                                "preenchimento"
                                                                                            )
                                                                                                ?.find(
                                                                                                    (
                                                                                                        p
                                                                                                    ) =>
                                                                                                        p.campoFichaCadastralCodigo ==
                                                                                                        i.codigo
                                                                                                )
                                                                                                ?.validacaoFacial.map(
                                                                                                    (
                                                                                                        item
                                                                                                    ) => (
                                                                                                        <>
                                                                                                            {item.status ==
                                                                                                                1 && (
                                                                                                                <Popover>
                                                                                                                    <PopoverTrigger>
                                                                                                                        <Button
                                                                                                                            variant="ghost"
                                                                                                                            size="xs"
                                                                                                                            colorScheme={
                                                                                                                                JSON.parse(
                                                                                                                                    item.resultado
                                                                                                                                )?.biometria_face?.probabilidade.indexOf(
                                                                                                                                    "Altíssima "
                                                                                                                                ) >=
                                                                                                                                0
                                                                                                                                    ? "green"
                                                                                                                                    : "red"
                                                                                                                            }
                                                                                                                            leftIcon={
                                                                                                                                JSON.parse(
                                                                                                                                    item.resultado
                                                                                                                                )?.biometria_face?.probabilidade.indexOf(
                                                                                                                                    "Altíssima "
                                                                                                                                ) >=
                                                                                                                                0 ? (
                                                                                                                                    <FiCheckCircle />
                                                                                                                                ) : (
                                                                                                                                    <FiAlertCircle />
                                                                                                                                )
                                                                                                                            }
                                                                                                                        >
                                                                                                                            Validado
                                                                                                                        </Button>
                                                                                                                    </PopoverTrigger>
                                                                                                                    <PopoverContent>
                                                                                                                        <PopoverArrow />
                                                                                                                        <PopoverCloseButton />
                                                                                                                        <PopoverHeader>
                                                                                                                            Validação
                                                                                                                            Facial
                                                                                                                        </PopoverHeader>
                                                                                                                        <PopoverBody>
                                                                                                                            <Flex
                                                                                                                                flexDir="column"
                                                                                                                                align="center"
                                                                                                                                justify="center"
                                                                                                                                gap={
                                                                                                                                    4
                                                                                                                                }
                                                                                                                            >
                                                                                                                                <Avatar
                                                                                                                                    src={
                                                                                                                                        item.fotoUrl
                                                                                                                                    }
                                                                                                                                    size="2xl"
                                                                                                                                />
                                                                                                                                <Box pos="relative">
                                                                                                                                    <Box>
                                                                                                                                        <Progress
                                                                                                                                            w="full"
                                                                                                                                            size="lg"
                                                                                                                                            value={
                                                                                                                                                JSON.parse(
                                                                                                                                                    item.resultado
                                                                                                                                                )
                                                                                                                                                    ?.biometria_face
                                                                                                                                                    ?.similaridade *
                                                                                                                                                100
                                                                                                                                            }
                                                                                                                                            max={
                                                                                                                                                100
                                                                                                                                            }
                                                                                                                                            colorScheme={
                                                                                                                                                JSON.parse(
                                                                                                                                                    item.resultado
                                                                                                                                                )?.biometria_face?.probabilidade.indexOf(
                                                                                                                                                    "Altíssima "
                                                                                                                                                ) >=
                                                                                                                                                0
                                                                                                                                                    ? "green"
                                                                                                                                                    : JSON.parse(
                                                                                                                                                          item.resultado
                                                                                                                                                      )?.biometria_face?.probabilidade.indexOf(
                                                                                                                                                          "Alta "
                                                                                                                                                      ) >=
                                                                                                                                                      0
                                                                                                                                                    ? "blue"
                                                                                                                                                    : JSON.parse(
                                                                                                                                                          item.resultado
                                                                                                                                                      )?.biometria_face?.probabilidade.indexOf(
                                                                                                                                                          "Baixa "
                                                                                                                                                      ) >=
                                                                                                                                                      0
                                                                                                                                                    ? "orange"
                                                                                                                                                    : "red"
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                    </Box>
                                                                                                                                    <Flex
                                                                                                                                        pos="absolute"
                                                                                                                                        top="0"
                                                                                                                                        justify="center"
                                                                                                                                        mx="auto"
                                                                                                                                        w="full"
                                                                                                                                    >
                                                                                                                                        <Text
                                                                                                                                            textAlign="center"
                                                                                                                                            fontSize="xs"
                                                                                                                                            color={
                                                                                                                                                JSON.parse(
                                                                                                                                                    item.resultado
                                                                                                                                                )?.biometria_face?.probabilidade.indexOf(
                                                                                                                                                    "Altíssima "
                                                                                                                                                ) >=
                                                                                                                                                0
                                                                                                                                                    ? "white"
                                                                                                                                                    : "white"
                                                                                                                                            }
                                                                                                                                        >
                                                                                                                                            {parseInt(
                                                                                                                                                JSON.parse(
                                                                                                                                                    item.resultado
                                                                                                                                                )
                                                                                                                                                    ?.biometria_face
                                                                                                                                                    ?.similaridade *
                                                                                                                                                    100
                                                                                                                                            )}{" "}
                                                                                                                                            %
                                                                                                                                        </Text>
                                                                                                                                    </Flex>
                                                                                                                                    <Text
                                                                                                                                        textAlign="center"
                                                                                                                                        fontSize="xs"
                                                                                                                                        color={
                                                                                                                                            JSON.parse(
                                                                                                                                                item.resultado
                                                                                                                                            )?.biometria_face?.probabilidade.indexOf(
                                                                                                                                                "Altíssima "
                                                                                                                                            ) >=
                                                                                                                                            0
                                                                                                                                                ? "green"
                                                                                                                                                : JSON.parse(
                                                                                                                                                      item.resultado
                                                                                                                                                  )?.biometria_face?.probabilidade.indexOf(
                                                                                                                                                      "Alta "
                                                                                                                                                  ) >=
                                                                                                                                                  0
                                                                                                                                                ? "blue"
                                                                                                                                                : JSON.parse(
                                                                                                                                                      item.resultado
                                                                                                                                                  )?.biometria_face?.probabilidade.indexOf(
                                                                                                                                                      "Baixa "
                                                                                                                                                  ) >=
                                                                                                                                                  0
                                                                                                                                                ? "orange"
                                                                                                                                                : "red"
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            JSON.parse(
                                                                                                                                                item.resultado
                                                                                                                                            )
                                                                                                                                                ?.biometria_face
                                                                                                                                                ?.probabilidade
                                                                                                                                        }
                                                                                                                                    </Text>
                                                                                                                                </Box>
                                                                                                                            </Flex>
                                                                                                                        </PopoverBody>
                                                                                                                    </PopoverContent>
                                                                                                                </Popover>
                                                                                                            )}

                                                                                                            <Tooltip label="Copiar URL da Ficha">
                                                                                                                <Button
                                                                                                                    size="xs"
                                                                                                                    variant="ghost"
                                                                                                                    colorScheme="blue"
                                                                                                                    leftIcon={
                                                                                                                        <Icon
                                                                                                                            as={
                                                                                                                                FiLink
                                                                                                                            }
                                                                                                                        />
                                                                                                                    }
                                                                                                                    onClick={() => {
                                                                                                                        navigator.clipboard.writeText(
                                                                                                                            `${window.location.origin}/validacao-facial/${item.id}`
                                                                                                                        );
                                                                                                                        toast(
                                                                                                                            {
                                                                                                                                title: "URL Copiada",
                                                                                                                            }
                                                                                                                        );
                                                                                                                    }}
                                                                                                                >
                                                                                                                    Copiar
                                                                                                                    Link
                                                                                                                    da
                                                                                                                    Validação
                                                                                                                </Button>
                                                                                                            </Tooltip>
                                                                                                        </>
                                                                                                    )
                                                                                                )}
                                                                                        </Text>
                                                                                    ) : (
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            size="xs"
                                                                                            onClick={() =>
                                                                                                onCadastrarValidacao(
                                                                                                    {
                                                                                                        campoFichaCadastralCodigo:
                                                                                                            watch(
                                                                                                                "preenchimento"
                                                                                                            )?.find(
                                                                                                                (
                                                                                                                    p
                                                                                                                ) =>
                                                                                                                    p.campoFichaCadastralCodigo ==
                                                                                                                    i.codigo
                                                                                                            )
                                                                                                                ?.campoFichaCadastralCodigo,
                                                                                                        cpf: watch(
                                                                                                            "preenchimento"
                                                                                                        )?.find(
                                                                                                            (
                                                                                                                p
                                                                                                            ) =>
                                                                                                                p.campoFichaCadastralCodigo ==
                                                                                                                i.codigo
                                                                                                        )
                                                                                                            ?.valor,
                                                                                                        fichaCadastralId:
                                                                                                            watch(
                                                                                                                "preenchimento"
                                                                                                            )?.find(
                                                                                                                (
                                                                                                                    p
                                                                                                                ) =>
                                                                                                                    p.campoFichaCadastralCodigo ==
                                                                                                                    i.codigo
                                                                                                            )
                                                                                                                ?.fichaCadastralId,
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                            isLoading={
                                                                                                cadastrarValidacaoFacial.isLoading
                                                                                            }
                                                                                        >
                                                                                            Consultar
                                                                                        </Button>
                                                                                    )}
                                                                                </Box>
                                                                                <Box
                                                                                    minW={
                                                                                        44
                                                                                    }
                                                                                >
                                                                                    <Text fontSize="xs">
                                                                                        Consultar
                                                                                        <br />
                                                                                        Tribunal
                                                                                        de
                                                                                        Justiça
                                                                                        Brasil
                                                                                    </Text>
                                                                                    <Button
                                                                                        w="full"
                                                                                        variant="outline"
                                                                                        size="xs"
                                                                                        leftIcon={
                                                                                            <Icon
                                                                                                as={
                                                                                                    FiSearch
                                                                                                }
                                                                                            />
                                                                                        }
                                                                                        onClick={() =>
                                                                                            consultarNetrin(
                                                                                                {
                                                                                                    tipoConsulta:
                                                                                                        "processos_pf",
                                                                                                    requisicao:
                                                                                                        {
                                                                                                            cpf: watch(
                                                                                                                "preenchimento"
                                                                                                            )?.find(
                                                                                                                (
                                                                                                                    p
                                                                                                                ) =>
                                                                                                                    p.campoFichaCadastralCodigo ==
                                                                                                                    i.codigo
                                                                                                            )
                                                                                                                ?.valor,
                                                                                                        },
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        isLoading={
                                                                                            consultandoNetrin
                                                                                        }
                                                                                    >
                                                                                        Consultar
                                                                                    </Button>
                                                                                    {data?.find(
                                                                                        (
                                                                                            ii
                                                                                        ) =>
                                                                                            ii.tipoConsulta ==
                                                                                                "processos_pf" &&
                                                                                            ii
                                                                                                .requisicao
                                                                                                .cpf ==
                                                                                                watch(
                                                                                                    "preenchimento"
                                                                                                )?.find(
                                                                                                    (
                                                                                                        p
                                                                                                    ) =>
                                                                                                        p.campoFichaCadastralCodigo ==
                                                                                                        i.codigo
                                                                                                )
                                                                                                    ?.valor
                                                                                    )
                                                                                        ?.retorno
                                                                                        ?.processosCPF && (
                                                                                        <Tooltip label="Visualizar Arquivo">
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                size="xs"
                                                                                                leftIcon={
                                                                                                    <Icon
                                                                                                        as={
                                                                                                            FiEye
                                                                                                        }
                                                                                                    />
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    preview.current.onOpen(
                                                                                                        process
                                                                                                            .env
                                                                                                            .NODE_ENV ==
                                                                                                            "production"
                                                                                                            ? `https://www.imo7.com.br/api/v1/integracao/netrin/${
                                                                                                                  data?.find(
                                                                                                                      (
                                                                                                                          ii
                                                                                                                      ) =>
                                                                                                                          ii.tipoConsulta ==
                                                                                                                              "processos_pf" &&
                                                                                                                          ii
                                                                                                                              .requisicao
                                                                                                                              .cpf ==
                                                                                                                              watch(
                                                                                                                                  "preenchimento"
                                                                                                                              )?.find(
                                                                                                                                  (
                                                                                                                                      p
                                                                                                                                  ) =>
                                                                                                                                      p.campoFichaCadastralCodigo ==
                                                                                                                                      i.codigo
                                                                                                                              )
                                                                                                                                  ?.valor
                                                                                                                  )
                                                                                                                      .id
                                                                                                              }/pdf`
                                                                                                            : `http://localhost:3000/api/v1/integracao/netrin/${
                                                                                                                  data?.find(
                                                                                                                      (
                                                                                                                          ii
                                                                                                                      ) =>
                                                                                                                          ii.tipoConsulta ==
                                                                                                                              "processos_pf" &&
                                                                                                                          ii
                                                                                                                              .requisicao
                                                                                                                              .cpf ==
                                                                                                                              watch(
                                                                                                                                  "preenchimento"
                                                                                                                              )?.find(
                                                                                                                                  (
                                                                                                                                      p
                                                                                                                                  ) =>
                                                                                                                                      p.campoFichaCadastralCodigo ==
                                                                                                                                      i.codigo
                                                                                                                              )
                                                                                                                                  ?.valor
                                                                                                                  )
                                                                                                                      .id
                                                                                                              }/pdf`
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                {data?.find(
                                                                                                    (
                                                                                                        ii
                                                                                                    ) =>
                                                                                                        ii.tipoConsulta ==
                                                                                                            "processos_pf" &&
                                                                                                        ii
                                                                                                            .requisicao
                                                                                                            .cpf ==
                                                                                                            watch(
                                                                                                                "preenchimento"
                                                                                                            )?.find(
                                                                                                                (
                                                                                                                    p
                                                                                                                ) =>
                                                                                                                    p.campoFichaCadastralCodigo ==
                                                                                                                    i.codigo
                                                                                                            )
                                                                                                                ?.valor
                                                                                                )
                                                                                                    ?.retorno
                                                                                                    ?.processosCPF
                                                                                                    ?.code
                                                                                                    ? "0"
                                                                                                    : data?.find(
                                                                                                          (
                                                                                                              ii
                                                                                                          ) =>
                                                                                                              ii.tipoConsulta ==
                                                                                                                  "processos_pf" &&
                                                                                                              ii
                                                                                                                  .requisicao
                                                                                                                  .cpf ==
                                                                                                                  watch(
                                                                                                                      "preenchimento"
                                                                                                                  )?.find(
                                                                                                                      (
                                                                                                                          p
                                                                                                                      ) =>
                                                                                                                          p.campoFichaCadastralCodigo ==
                                                                                                                          i.codigo
                                                                                                                  )
                                                                                                                      ?.valor
                                                                                                      )
                                                                                                          ?.retorno
                                                                                                          ?.processosCPF
                                                                                                          ?.totalProcessos}{" "}
                                                                                                processos
                                                                                                encontrados
                                                                                            </Button>
                                                                                        </Tooltip>
                                                                                    )}
                                                                                </Box>
                                                                                <Box
                                                                                    minW={
                                                                                        44
                                                                                    }
                                                                                >
                                                                                    <Text fontSize="xs">
                                                                                        Consultar
                                                                                        <br />
                                                                                        Protestos
                                                                                        Nacional
                                                                                    </Text>
                                                                                    <Button
                                                                                        w="full"
                                                                                        variant="outline"
                                                                                        size="xs"
                                                                                        leftIcon={
                                                                                            <Icon
                                                                                                as={
                                                                                                    FiSearch
                                                                                                }
                                                                                            />
                                                                                        }
                                                                                        onClick={() =>
                                                                                            consultarNetrin(
                                                                                                {
                                                                                                    tipoConsulta:
                                                                                                        "protestos_pf",
                                                                                                    requisicao:
                                                                                                        {
                                                                                                            cpf: watch(
                                                                                                                "preenchimento"
                                                                                                            )?.find(
                                                                                                                (
                                                                                                                    p
                                                                                                                ) =>
                                                                                                                    p.campoFichaCadastralCodigo ==
                                                                                                                    i.codigo
                                                                                                            )
                                                                                                                ?.valor,
                                                                                                        },
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        isLoading={
                                                                                            consultandoNetrin
                                                                                        }
                                                                                    >
                                                                                        Consultar
                                                                                    </Button>
                                                                                    {data?.find(
                                                                                        (
                                                                                            ii
                                                                                        ) =>
                                                                                            ii.tipoConsulta ==
                                                                                                "protestos_pf" &&
                                                                                            ii
                                                                                                .requisicao
                                                                                                .cpf ==
                                                                                                watch(
                                                                                                    "preenchimento"
                                                                                                )?.find(
                                                                                                    (
                                                                                                        p
                                                                                                    ) =>
                                                                                                        p.campoFichaCadastralCodigo ==
                                                                                                        i.codigo
                                                                                                )
                                                                                                    ?.valor
                                                                                    )
                                                                                        ?.retorno
                                                                                        ?.cenprotProtestos && (
                                                                                        <Tooltip label="Visualizar Arquivo">
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                size="xs"
                                                                                                leftIcon={
                                                                                                    <Icon
                                                                                                        as={
                                                                                                            FiEye
                                                                                                        }
                                                                                                    />
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    preview.current.onOpen(
                                                                                                        process
                                                                                                            .env
                                                                                                            .NODE_ENV ==
                                                                                                            "production"
                                                                                                            ? `https://www.imo7.com.br/api/v1/integracao/netrin/${
                                                                                                                  data?.find(
                                                                                                                      (
                                                                                                                          ii
                                                                                                                      ) =>
                                                                                                                          ii.tipoConsulta ==
                                                                                                                              "protestos_pf" &&
                                                                                                                          ii
                                                                                                                              .requisicao
                                                                                                                              .cpf ==
                                                                                                                              watch(
                                                                                                                                  "preenchimento"
                                                                                                                              )?.find(
                                                                                                                                  (
                                                                                                                                      p
                                                                                                                                  ) =>
                                                                                                                                      p.campoFichaCadastralCodigo ==
                                                                                                                                      i.codigo
                                                                                                                              )
                                                                                                                                  ?.valor
                                                                                                                  )
                                                                                                                      .id
                                                                                                              }/pdf`
                                                                                                            : `http://localhost:3000/api/v1/integracao/netrin/${
                                                                                                                  data?.find(
                                                                                                                      (
                                                                                                                          ii
                                                                                                                      ) =>
                                                                                                                          ii.tipoConsulta ==
                                                                                                                              "protestos_pf" &&
                                                                                                                          ii
                                                                                                                              .requisicao
                                                                                                                              .cpf ==
                                                                                                                              watch(
                                                                                                                                  "preenchimento"
                                                                                                                              )?.find(
                                                                                                                                  (
                                                                                                                                      p
                                                                                                                                  ) =>
                                                                                                                                      p.campoFichaCadastralCodigo ==
                                                                                                                                      i.codigo
                                                                                                                              )
                                                                                                                                  ?.valor
                                                                                                                  )
                                                                                                                      .id
                                                                                                              }/pdf`
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                {data?.find(
                                                                                                    (
                                                                                                        ii
                                                                                                    ) =>
                                                                                                        ii.tipoConsulta ==
                                                                                                            "protestos_pf" &&
                                                                                                        ii
                                                                                                            .requisicao
                                                                                                            .cpf ==
                                                                                                            watch(
                                                                                                                "preenchimento"
                                                                                                            )?.find(
                                                                                                                (
                                                                                                                    p
                                                                                                                ) =>
                                                                                                                    p.campoFichaCadastralCodigo ==
                                                                                                                    i.codigo
                                                                                                            )
                                                                                                                ?.valor
                                                                                                )
                                                                                                    ?.retorno
                                                                                                    ?.processosCPF
                                                                                                    ?.code
                                                                                                    ? "0"
                                                                                                    : totalProtestos(
                                                                                                          data?.find(
                                                                                                              (
                                                                                                                  ii
                                                                                                              ) =>
                                                                                                                  ii.tipoConsulta ==
                                                                                                                      "protestos_pf" &&
                                                                                                                  ii
                                                                                                                      .requisicao
                                                                                                                      .cpf ==
                                                                                                                      watch(
                                                                                                                          "preenchimento"
                                                                                                                      )?.find(
                                                                                                                          (
                                                                                                                              p
                                                                                                                          ) =>
                                                                                                                              p.campoFichaCadastralCodigo ==
                                                                                                                              i.codigo
                                                                                                                      )
                                                                                                                          ?.valor
                                                                                                          )
                                                                                                              ?.retorno
                                                                                                              ?.cenprotProtestos
                                                                                                      )}{" "}
                                                                                                protestos
                                                                                                encontrados
                                                                                            </Button>
                                                                                        </Tooltip>
                                                                                    )}
                                                                                </Box>
                                                                            </Flex>
                                                                        )}
                                                                    </Flex>
                                                                </GridItem>
                                                            ))}
                                                    </Grid>
                                                </Box>
                                            ))}{" "}
                                        <GridItem>
                                            <FormSelect
                                                label="Status"
                                                placeholder="Selecione o status"
                                                error={errors.status?.message}
                                                {...register("status")}
                                            >
                                                <option value="aguardando">
                                                    Aguardando Preenchimento
                                                </option>
                                                <option value="preenchida">
                                                    Preenchida
                                                </option>
                                                <option value="em_analise">
                                                    Em análise
                                                </option>
                                                <option value="aprovada">
                                                    Aprovada
                                                </option>
                                                <option value="reprovada">
                                                    Reprovada
                                                </option>
                                                <option value="arquivada">
                                                    Arquivada
                                                </option>
                                            </FormSelect>
                                        </GridItem>
                                        {watch("status") == "reprovada" && (
                                            <>
                                                <GridItem>
                                                    <FormSelect
                                                        label="Motivo da Reprovação"
                                                        placeholder="Selecione o motivo"
                                                        error={
                                                            errors
                                                                .motivoReprovacaoId
                                                                ?.message
                                                        }
                                                        {...register(
                                                            "motivoReprovacaoId"
                                                        )}
                                                    >
                                                        {motivos?.data?.data?.map(
                                                            (item) => (
                                                                <option
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {item.nome}
                                                                </option>
                                                            )
                                                        )}
                                                    </FormSelect>
                                                </GridItem>
                                                <GridItem>
                                                    <FormTextarea
                                                        label="Observações sobre a reprovação"
                                                        placeholder="Digite o aqui as observações sobre a reprovação..."
                                                        error={
                                                            errors
                                                                .motivoReprovacao
                                                                ?.message
                                                        }
                                                        {...register(
                                                            "motivoReprovacao"
                                                        )}
                                                    />
                                                </GridItem>
                                            </>
                                        )}
                                    </Grid>
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <Documentos
                                    fichaCadastralId={watch("id")}
                                    contratoId={watch("contratoId")}
                                    data={watch("anexos")}
                                />
                            </TabPanel>

                            <TabPanel>
                                <Historicos
                                    tabela="FichaCadastral"
                                    tabelaId={watch("id")}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Historicos
                                    tabela="Processo"
                                    tabelaId={watch("processoId")}
                                />
                            </TabPanel>
                            <TabPanel>
                                <ConsultasNetrin
                                    fichaCadastralId={watch("id")}
                                    processoId={watch("processoId")}
                                />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter gridGap={4}>
                    <Button onClick={() => onClose()}>Desistir</Button>
                    <Button
                        colorScheme="blue"
                        variant="solid"
                        isLoading={isSubmitting}
                        type="submit"
                        form="formRevisarFichaCadastral"
                    >
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
            <ModalTribunalJustica ref={preview} />
        </Modal>
    );
};

export const ModalRevisaoFichaCadastral = forwardRef(ModalBase);
