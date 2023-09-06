import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { useAuth } from "@/hooks/useAuth";
import { listarCategoriaCampoFichas } from "@/services/models/categoriaCampoFicha";
import {
    atualizarFicha,
    buscarFicha,
    cadastrarFicha,
} from "@/services/models/fichaCadastral";
import { listarFichas } from "@/services/models/modeloFicha";
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
import { Router, useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    FiAlertCircle,
    FiCheck,
    FiCheckCircle,
    FiDownload,
    FiEye,
    FiLink,
} from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { ModalPreview } from "../Preview";
import { AnaliseCampo } from "./AnaliseCampo";
import { Historicos } from "@/components/Pages/Historicos";
import { Documentos } from "../Contrato/Documentos";
const schema = yup.object({});
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
            console.log(error);
        }
    };

    const { data: campos } = useQuery(
        ["categoriasCampos", { tipoFicha: watch("modelo.tipo") }],
        listarCategoriaCampoFichas,
        { refetchOnReconnect: false, refetchOnWindowFocus: false }
    );

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
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />

            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Ficha Cadastral</ModalHeader>
                <ModalBody>
                    <Tabs>
                        <TabList>
                            {/* <Tab>Geral</Tab> */}
                            {watch("id") && <Tab>Revisão</Tab>}
                            {watch("id") && <Tab>Anexos</Tab>}
                            <Tab>Histórico</Tab>
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
                                        {campos?.data
                                            ?.filter((i) =>
                                                i.campos.find(
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
                                                        {item?.campos?.map(
                                                            (i) => (
                                                                <GridItem
                                                                    key={i.id}
                                                                    colSpan={
                                                                        i.colSpan
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
                                                                            {i.nome.indexOf(
                                                                                "CPF"
                                                                            ) >=
                                                                                0 && (
                                                                                <>
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
                                                                                        >
                                                                                            Validação
                                                                                            Facial
                                                                                        </Button>
                                                                                    )}
                                                                                </>
                                                                            )}
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

                                                                    <Text
                                                                        fontSize="sm"
                                                                        fontWeight="bold"
                                                                    >
                                                                        {i.tipoCampo ==
                                                                        "image" ? (
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
                                                                                        <Image
                                                                                            w={
                                                                                                32
                                                                                            }
                                                                                            h={
                                                                                                44
                                                                                            }
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
                                                                                            objectFit="cover"
                                                                                            objectPosition="center"
                                                                                        />
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
                                                                        ) : i.tipoCampo ==
                                                                          "file" ? (
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
                                                                                        <Text as="span">
                                                                                            Arquivo
                                                                                            anexado
                                                                                        </Text>
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
                                                                </GridItem>
                                                            )
                                                        )}
                                                    </Grid>
                                                </Box>
                                            ))}{" "}
                                        <GridItem>
                                            <FormSelect
                                                label="Status"
                                                placeholder="Selecione o status"
                                                error={errors.telefone?.message}
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
                                            <GridItem>
                                                <FormTextarea
                                                    label="Motivo da Reprovação"
                                                    placeholder="Digite o motivo..."
                                                    error={
                                                        errors.motivoReprovacao
                                                            ?.message
                                                    }
                                                    {...register(
                                                        "motivoReprovacao"
                                                    )}
                                                />
                                            </GridItem>
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
            <ModalPreview ref={preview} />
        </Modal>
    );
};

export const ModalRevisaoFichaCadastral = forwardRef(ModalBase);
