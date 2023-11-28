import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import prisma from "@/lib/prisma";
import {
    atualizarAnexosFicha,
    atualizarFicha,
} from "@/services/models/public/fichaCadastral";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Checkbox,
    Container,
    Flex,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Image,
    Progress,
    Radio,
    RadioGroup,
    Stack,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Tag,
    Text,
    Tooltip,
    useSteps,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiEye, FiFile, FiPlus, FiUpload } from "react-icons/fi";
import { useMutation } from "react-query";
import * as yup from "yup";
import "react-quill/dist/quill.snow.css";
import { buscarEndereco } from "@/lib/buscarEndereco";
import { GetServerSideProps } from "next";
import { FormSelect } from "@/components/Form/FormSelect";
import {
    convertToBase64,
    formatoValor,
    getFileExtension,
} from "@/helpers/helpers";
import { Head } from "@/components/Head";
import { MdClose } from "react-icons/md";

import { FileUpload } from "primereact/fileupload";
import { BiSave } from "react-icons/bi";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

function Previews(props) {
    const toast = useToast(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast({
            status: "info",
            title: "File Uploaded",
        });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size < 0 ? 0 : totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 100000;
        const formatedValue =
            fileUploadRef && fileUploadRef.current
                ? fileUploadRef.current.formatSize(totalSize)
                : "0 B";

        return (
            <Flex
                alignItems="center"
                justify="space-between"
                flexDir="row"
                gap={2}
            >
                <Flex gap={4}>
                    {chooseButton}
                    {uploadButton}
                    {cancelButton}
                </Flex>
                <Flex align="center" flexDir="column" gap={1} ml="auto">
                    <Text fontSize="xs">{formatedValue} / 100 MB</Text>
                    <Progress
                        value={value}
                        max={100}
                        hasStripe
                        rounded="full"
                        w={44}
                    />
                </Flex>
            </Flex>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <Flex
                align="center"
                justify="space-between"
                flexWrap="wrap"
                pos="relative"
            >
                <Flex align="center">
                    <Image
                        alt={file.name}
                        role="presentation"
                        src={file.objectURL}
                        w="full"
                        rounded="lg"
                    />
                </Flex>
                <Box as="span" flexDir="column" textAlign="center">
                    <Text fontSize="xs">{file.name}</Text>
                    <Tag size="sm" colorScheme="orange">
                        {props.formatSize}
                    </Tag>
                </Box>

                <IconButton
                    top={0}
                    right={0}
                    size="sm"
                    pos="absolute"
                    colorScheme="red"
                    variant="outline"
                    icon={<MdClose />}
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </Flex>
        );
    };

    const emptyTemplate = () => {
        return (
            <Flex align="center" flexDir="column" p={4}>
                <Icon as={FiFile} fontSize="2em" color="gray" />
                <Text fontSize="sm" color="gray">
                    Arraste e solte aqui
                </Text>
            </Flex>
        );
    };

    const atualizarAnexos = useMutation(atualizarAnexosFicha);
    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];

        const base64String = await convertToBase64(file);
        const fileExtension = getFileExtension(file.name);

        await atualizarAnexos.mutateAsync(
            {
                id: props.id,
                formData: {
                    arquivos: [
                        {
                            nome: props.codigo,
                            extensao: fileExtension,
                            base64: base64String,
                        },
                    ],
                },
            },
            {
                onSuccess: () => {
                    toast({ title: "Upload realizado com sucesso" });
                },
            }
        );
    };
    return (
        <Flex
            flexDir="column"
            gap={4}
            borderWidth={1}
            p={4}
            rounded="lg"
            w="full"
        >
            <Text fontSize="sm" fontWeight="medium">
                {props.nome}
            </Text>
            <FileUpload
                ref={fileUploadRef}
                nome={props.codigo}
                id={props.id}
                customUpload
                multiple={props.multiple}
                maxFileSize={100000000}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                uploadHandler={customBase64Uploader}
                mode="advanced"
                auto
                uploadOptions={{
                    icon: (
                        <Tooltip label="Upload">
                            <IconButton icon={<FiUpload />} />
                        </Tooltip>
                    ),
                    iconOnly: true,
                }}
                chooseOptions={{
                    icon: (props) => (
                        <Tooltip label="Selecionar arquivo">
                            <IconButton icon={<FiPlus />} {...props} />
                        </Tooltip>
                    ),
                    iconOnly: true,
                }}
                cancelOptions={{
                    icon: (
                        <Tooltip label="Cancelar">
                            <IconButton icon={<MdClose />} />
                        </Tooltip>
                    ),
                    iconOnly: true,
                }}
            />
            {props.data && (
                <Flex flexDir="column" gap={1}>
                    <Text fontSize="sm">Arquivos anexados</Text>
                    <Image src={props.data} w={24} />
                </Flex>
            )}
        </Flex>
    );
}

const FichaCadastral = ({ ficha, campos, modelo }) => {
    console.log(modelo);
    const [schema, setSchema] = useState({});
    const toast = useToast();
    const {
        control,
        reset,
        watch,
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm({
        defaultValues: {
            ...ficha,
        },
    });
    const atualizar = useMutation(atualizarFicha);
    const atualizarAnexos = useMutation(atualizarAnexosFicha); // Função para converter arquivo para base64

    const onSubmit = async (data) => {
        try {
            console.log(data);
            await atualizar.mutateAsync(data);

            // const formData = new FormData();
            // if (data.arquivos && Object.entries(data.arquivos).length) {
            //     const filesData = await Promise.all(
            //         Object.entries(data.arquivos).map(async (item) => {
            //             var files = item[1];
            //             console.log("files", files, item[1]);

            //             const filePromises = Array.from(files).map(
            //                 async (file) => {
            //                     console.log(file, file.name);
            //                     const base64String = await convertToBase64(
            //                         file
            //                     );
            //                     const fileExtension = getFileExtension(
            //                         file.name
            //                     );

            //                     return {
            //                         nome: item[0],
            //                         extensao: fileExtension,
            //                         base64: base64String,
            //                     };
            //                 }
            //             );

            //             return Promise.all(filePromises);
            //         })
            //     );

            //     // Flatten the array
            //     const flattenedFilesData = filesData.flat();

            //     // Now you have an array of objects with nome, extensao, and base64 properties
            //     console.log(flattenedFilesData);
            //     await atualizarAnexos.mutateAsync({
            //         id: data.id,
            //         formData: {
            //             arquivos: flattenedFilesData,
            //         },
            //     });
            // }

            toast({ title: "Ficha salva", status: "success" });
        } catch (e) {
            console.log(e);
            toast({
                title: "Houve um problema",
                description: e.response?.data?.message,
                status: "error",
            });
        }
    };

    const buscarEnderecoPorCep = async (cep, camposEndereco) => {
        try {
            if (cep.length > 8) {
                const res = await buscarEndereco(cep);
                console.log(res);
                let obj = {};
                Object.entries(camposEndereco).map((item) => {
                    if (item[0] == "endereco") {
                        obj[item[1].codigo] = res.logradouro;
                    } else if (item[0] == "bairro") {
                        obj[item[1].codigo] = res.bairro;
                    } else if (item[0] == "cidade") {
                        obj[item[1].codigo] = res.cidade;
                    } else if (item[0] == "estado") {
                        obj[item[1].codigo] = res.uf;
                    }
                });
                reset({
                    ...watch(),
                    preenchimento: {
                        ...watch("preenchimento"),
                        ...obj,
                    },
                });
            }
        } catch (e) {
            toast({
                title: "Endereço não encontrado",
                status: "warning",
            });
        }
    };
    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: campos.filter((i) =>
            i.campos.find((e) => modelo?.campos[e.codigo]?.exibir)
        ).length,
    });
    return (
        <Box
            bg="gray.100"
            minH="100vh"
            as="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Head
                title={ficha?.nome}
                description={`${modelo.nome} - ${modelo.descricao}`}
            />
            <Container maxW="container.xl">
                <Flex
                    align="center"
                    py={8}
                    gap={6}
                    flexDir={{ base: "column", lg: "row" }}
                >
                    <Box>
                        <Image w={150} src={ficha.imobiliaria.logo} />
                    </Box>
                    <Box>
                        <Text>
                            <Text as="span" fontWeight="bold">
                                {ficha.imobiliaria.razaoSocial}
                            </Text>{" "}
                            • CNPJ: {ficha.imobiliaria.cnpj}
                        </Text>
                        <Text fontSize="sm">
                            {ficha.imobiliaria.endereco}
                            {ficha.imobiliaria.numero &&
                                ` nº ${ficha.imobiliaria.numero}`}
                            ,{ficha.imobiliaria.bairro},
                            {ficha.imobiliaria.cidade}/
                            {ficha.imobiliaria.estado} - CEP:{" "}
                            {ficha.imobiliaria.cep}
                        </Text>
                        <Text fontSize="sm">
                            <Text as="span" fontWeight="bold">
                                Fixo:
                            </Text>{" "}
                            {ficha.imobiliaria.telefone} •{" "}
                            <Text as="span" fontWeight="bold">
                                E-mail:
                            </Text>{" "}
                            {ficha.imobiliaria.email} •{" "}
                            <Text as="span" fontWeight="bold">
                                Site:
                            </Text>{" "}
                            {ficha.imobiliaria.site}
                        </Text>
                    </Box>
                </Flex>
                <Box py={8}>
                    <Heading size="md" textAlign="center">
                        {modelo.nome}
                    </Heading>
                    <Text textAlign="center" fontSize="sm" color="gray">
                        {modelo.descricao}
                    </Text>
                    {ficha.status == "aprovada" && (
                        <Alert status="success" my={2}>
                            <AlertIcon />
                            <AlertTitle>Ficha Aprovada</AlertTitle>
                        </Alert>
                    )}
                    {ficha.status == "reprovada" && (
                        <Alert status="error" my={2}>
                            <AlertIcon />
                            <AlertTitle>Ficha reprovada</AlertTitle>
                            <AlertDescription>
                                {ficha.motivoReprovacao}
                            </AlertDescription>
                        </Alert>
                    )}
                </Box>

                <Grid
                    gridTemplateColumns={{ lg: "repeat(6,1fr)" }}
                    gap={4}
                    my={2}
                >
                    <GridItem colSpan={{ lg: 3 }}>
                        {ficha.imovel ? (
                            <Box p={4} bg="white">
                                <Text fontSize="sm" color="gray">
                                    Ficha referente ao imóvel:
                                </Text>
                                <Text>
                                    {ficha.imovel?.codigo} -{" "}
                                    {ficha.imovel?.endereco},{" "}
                                    {ficha.imovel?.bairro},{" "}
                                    {ficha.imovel?.cidade}/
                                    {ficha.imovel?.estado}
                                </Text>
                            </Box>
                        ) : ficha.codigoImovel ? (
                            <Box p={2} bg="white">
                                <Text fontSize="sm" color="gray">
                                    Ficha referente ao imóvel:
                                </Text>
                                <Text>
                                    {ficha.codigoImovel} -{" "}
                                    {ficha.enderecoImovel} nº{" "}
                                    {ficha.numeroImovel}{" "}
                                    {ficha.complementoImovel &&
                                        `(${ficha.complementoImovel})`}
                                    , {ficha.bairroImovel}, {ficha.cidadeImovel}
                                    /{ficha.estadoImovel}
                                </Text>
                            </Box>
                        ) : (
                            ""
                        )}
                    </GridItem>
                    <GridItem p={4} bg="white">
                        <Text fontSize="sm" color="gray">
                            Valor Negociado
                        </Text>
                        <Text>
                            {
                                ficha.Processo?.campos?.find((e) => e.valor)
                                    ?.valor
                            }
                        </Text>
                    </GridItem>
                    <GridItem p={4} bg="white">
                        <Text fontSize="sm" color="gray">
                            Valor Condominio
                        </Text>
                        <Text>
                            {formatoValor(ficha.imovel?.valorCondominio)}
                        </Text>
                    </GridItem>
                    <GridItem p={4} bg="white">
                        <Text fontSize="sm" color="gray">
                            Valor IPTU
                        </Text>
                        <Text>{formatoValor(ficha.imovel?.valorIPTU)}</Text>
                    </GridItem>
                </Grid>
                <Flex flexDir={{ base: "column", lg: "row" }}>
                    <Box w={{ base: "full", lg: "xs" }} overflow="auto">
                        <Stepper
                            size="xs"
                            index={activeStep}
                            orientation="vertical"
                            display={{ base: "none", lg: "flex" }}
                        >
                            {campos
                                .filter((i) =>
                                    i.campos.find(
                                        (e) => modelo?.campos[e.codigo]?.exibir
                                    )
                                )
                                .map((step, index) => (
                                    <Step
                                        key={index}
                                        onClick={() => setActiveStep(index)}
                                    >
                                        <StepIndicator>
                                            <StepStatus
                                                complete={<StepIcon />}
                                                incomplete={<StepNumber />}
                                                active={<StepNumber />}
                                            />
                                        </StepIndicator>

                                        <Box flexShrink="0">
                                            <StepTitle>{step.nome}</StepTitle>
                                            <StepDescription>
                                                {step.descricao}
                                            </StepDescription>
                                        </Box>

                                        <StepSeparator />
                                    </Step>
                                ))}
                            <Step
                                onClick={() =>
                                    setActiveStep(
                                        campos.filter((i) =>
                                            i.campos.find(
                                                (e) =>
                                                    modelo?.campos[e.codigo]
                                                        ?.exibir
                                            )
                                        ).length
                                    )
                                }
                            >
                                <StepIndicator>
                                    <StepStatus
                                        complete={<StepIcon />}
                                        incomplete={<StepNumber />}
                                        active={<StepNumber />}
                                    />
                                </StepIndicator>

                                <Box flexShrink="0">
                                    <StepTitle>Resumo</StepTitle>
                                    <StepDescription>
                                        Confira os dados informados
                                    </StepDescription>
                                </Box>

                                <StepSeparator />
                            </Step>
                        </Stepper>
                        <Box display={{ lg: "none" }}>
                            <Stepper
                                size="xs"
                                index={activeStep}
                                flexWrap="wrap"
                            >
                                {campos
                                    .filter((i) =>
                                        i.campos.find(
                                            (e) =>
                                                modelo?.campos[e.codigo]?.exibir
                                        )
                                    )
                                    .map((step, index) => (
                                        <Step
                                            key={index}
                                            onClick={() => setActiveStep(index)}
                                            style={{
                                                minWidth: "content",
                                            }}
                                        >
                                            <StepIndicator>
                                                <StepStatus
                                                    complete={<StepIcon />}
                                                    incomplete={<StepNumber />}
                                                    active={<StepNumber />}
                                                />
                                            </StepIndicator>

                                            <Box flexShrink="0">
                                                <StepTitle>
                                                    {step.nome}
                                                </StepTitle>
                                                <StepDescription>
                                                    {step.descricao}
                                                </StepDescription>
                                            </Box>

                                            <StepSeparator />
                                        </Step>
                                    ))}
                                <Step
                                    onClick={() =>
                                        setActiveStep(
                                            campos.filter((i) =>
                                                i.campos.find(
                                                    (e) =>
                                                        modelo?.campos[e.codigo]
                                                            ?.exibir
                                                )
                                            ).length
                                        )
                                    }
                                >
                                    <StepIndicator>
                                        <StepStatus
                                            complete={<StepIcon />}
                                            incomplete={<StepNumber />}
                                            active={<StepNumber />}
                                        />
                                    </StepIndicator>

                                    <Box flexShrink="0">
                                        <StepTitle>Resumo</StepTitle>
                                        <StepDescription>
                                            Confira os dados informados
                                        </StepDescription>
                                    </Box>

                                    <StepSeparator />
                                </Step>
                            </Stepper>
                        </Box>
                    </Box>
                    <Box w="full">
                        <Grid gap={4}>
                            {campos
                                .filter((i) =>
                                    i.campos.find(
                                        (e) => modelo?.campos[e.codigo]?.exibir
                                    )
                                )
                                .map((item, index) => (
                                    <Box
                                        key={item.id}
                                        bg="white"
                                        p={4}
                                        hidden={activeStep != index}
                                        w="full"
                                        minH={96}
                                    >
                                        <Heading size="sm" mb={6}>
                                            {item.nome}
                                        </Heading>
                                        <Grid
                                            gridTemplateColumns={{
                                                base: "repeat(1,1fr)",
                                                lg: "repeat(6,1fr)",
                                            }}
                                            gap={2}
                                        >
                                            {item.campos
                                                .filter((i) => {
                                                    if (
                                                        (modelo.campos[
                                                            i.codigo
                                                        ] &&
                                                            modelo?.campos[
                                                                i.codigo
                                                            ]?.exibir &&
                                                            !i.dependencia) ||
                                                        (modelo.campos[
                                                            i.codigo
                                                        ] &&
                                                            modelo?.campos[
                                                                i.codigo
                                                            ]?.exibir &&
                                                            ((i.dependencia
                                                                ?.codigo &&
                                                                !i.dependenciaValor &&
                                                                watch(
                                                                    `preenchimento.${i.dependencia?.codigo}`
                                                                )) ||
                                                                (i.dependencia
                                                                    ?.codigo &&
                                                                    i.dependenciaValor ==
                                                                        watch(
                                                                            `preenchimento.${i.dependencia?.codigo}`
                                                                        ))))
                                                    ) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                })
                                                .map((campo, i) => (
                                                    <GridItem
                                                        key={campo.id}
                                                        colSpan={{
                                                            base: 1,
                                                            lg:
                                                                campo.tipoCampo ==
                                                                "file"
                                                                    ? 2
                                                                    : campo.colSpan +
                                                                      1,
                                                        }}
                                                        colStart={{
                                                            lg:
                                                                campo.tipoCampo ==
                                                                    "file" &&
                                                                item.campos.filter(
                                                                    (i) => {
                                                                        if (
                                                                            (modelo
                                                                                .campos[
                                                                                i
                                                                                    .codigo
                                                                            ] &&
                                                                                modelo
                                                                                    ?.campos[
                                                                                    i
                                                                                        .codigo
                                                                                ]
                                                                                    ?.exibir &&
                                                                                !i.dependencia) ||
                                                                            (modelo
                                                                                .campos[
                                                                                i
                                                                                    .codigo
                                                                            ] &&
                                                                                modelo
                                                                                    ?.campos[
                                                                                    i
                                                                                        .codigo
                                                                                ]
                                                                                    ?.exibir &&
                                                                                ((i
                                                                                    .dependencia
                                                                                    ?.codigo &&
                                                                                    !i.dependenciaValor &&
                                                                                    watch(
                                                                                        `preenchimento.${i.dependencia?.codigo}`
                                                                                    )) ||
                                                                                    (i
                                                                                        .dependencia
                                                                                        ?.codigo &&
                                                                                        i.dependenciaValor ==
                                                                                            watch(
                                                                                                `preenchimento.${i.dependencia?.codigo}`
                                                                                            ))))
                                                                        ) {
                                                                            return true;
                                                                        } else {
                                                                            return false;
                                                                        }
                                                                    }
                                                                )[i - 1]
                                                                    ?.tipoCampo !=
                                                                    "file"
                                                                    ? 1
                                                                    : "auto",
                                                        }}
                                                    >
                                                        {campo.tipoCampo ==
                                                            "checkbox" && (
                                                            <>
                                                                <Controller
                                                                    control={
                                                                        control
                                                                    }
                                                                    name={
                                                                        "preenchimento." +
                                                                        campo.codigo
                                                                    }
                                                                    rules={{
                                                                        required:
                                                                            {
                                                                                value: modelo
                                                                                    .campos[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.obrigatorio,
                                                                                message:
                                                                                    "Campo obrigatório",
                                                                            },
                                                                    }}
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <Checkbox
                                                                            {...field}
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                ) {
                                                                                    field.onChange(
                                                                                        "Sim"
                                                                                    );
                                                                                } else {
                                                                                    field.onChange(
                                                                                        "Não"
                                                                                    );
                                                                                }
                                                                            }}
                                                                            borderColor={
                                                                                watch(
                                                                                    "analise." +
                                                                                        campo.codigo
                                                                                )
                                                                                    ?.aprovado
                                                                                    ? "green"
                                                                                    : ""
                                                                            }
                                                                            borderWidth={
                                                                                watch(
                                                                                    "analise." +
                                                                                        campo.codigo
                                                                                )
                                                                                    ?.aprovado
                                                                                    ? 2
                                                                                    : ""
                                                                            }
                                                                            error={
                                                                                errors.preenchimento &&
                                                                                errors
                                                                                    .preenchimento[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.message
                                                                                    ? errors
                                                                                          .preenchimento[
                                                                                          campo
                                                                                              .codigo
                                                                                      ]
                                                                                          ?.message
                                                                                    : watch(
                                                                                          "analise." +
                                                                                              campo.codigo
                                                                                      )
                                                                                          ?.motivoReprovacao
                                                                                    ? "Campo reprovado: " +
                                                                                      watch(
                                                                                          "analise." +
                                                                                              campo.codigo
                                                                                      )
                                                                                          ?.motivoReprovacao
                                                                                    : ""
                                                                            }
                                                                        >
                                                                            {
                                                                                campo.nome
                                                                            }
                                                                        </Checkbox>
                                                                    )}
                                                                />
                                                            </>
                                                        )}
                                                        {campo.tipoCampo ==
                                                            "select" && (
                                                            <FormSelect
                                                                size="sm"
                                                                label={
                                                                    campo.nome
                                                                }
                                                                mask={
                                                                    campo.mask
                                                                }
                                                                placeholder={`Selecione ${campo.nome}`}
                                                                {...register(
                                                                    "preenchimento." +
                                                                        campo.codigo,
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: modelo
                                                                                    .campos[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.obrigatorio,
                                                                                message:
                                                                                    "Campo obrigatório",
                                                                            },
                                                                    }
                                                                )}
                                                                borderColor={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? "green"
                                                                        : ""
                                                                }
                                                                borderWidth={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? 2
                                                                        : ""
                                                                }
                                                                error={
                                                                    errors.preenchimento &&
                                                                    errors
                                                                        .preenchimento[
                                                                        campo
                                                                            .codigo
                                                                    ]?.message
                                                                        ? errors
                                                                              .preenchimento[
                                                                              campo
                                                                                  .codigo
                                                                          ]
                                                                              ?.message
                                                                        : watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        ? "Campo reprovado: " +
                                                                          watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        : ""
                                                                }
                                                            >
                                                                {campo.opcoes.map(
                                                                    (op) => (
                                                                        <option
                                                                            key={
                                                                                op
                                                                            }
                                                                            value={
                                                                                op
                                                                            }
                                                                        >
                                                                            {op}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </FormSelect>
                                                        )}
                                                        {campo.tipoCampo ==
                                                            "cnpj" ||
                                                        campo.tipoCampo ==
                                                            "cpf" ||
                                                        campo.tipoCampo ==
                                                            "text" ||
                                                        campo.tipoCampo ==
                                                            "number" ||
                                                        campo.tipoCampo ==
                                                            "qrcode" ? (
                                                            <FormInput
                                                                size="sm"
                                                                type={
                                                                    campo.tipoCampo
                                                                }
                                                                label={
                                                                    campo.nome
                                                                }
                                                                mask={
                                                                    campo.mask
                                                                }
                                                                {...register(
                                                                    "preenchimento." +
                                                                        campo.codigo,
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: modelo
                                                                                    .campos[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.obrigatorio,
                                                                                message:
                                                                                    "Campo obrigatório",
                                                                            },
                                                                        onChange:
                                                                            (
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    campo.cep
                                                                                ) {
                                                                                    buscarEnderecoPorCep(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        campo.camposEndereco
                                                                                    );
                                                                                }
                                                                            },
                                                                    }
                                                                )}
                                                                borderColor={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? "green"
                                                                        : ""
                                                                }
                                                                borderWidth={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? 2
                                                                        : ""
                                                                }
                                                                error={
                                                                    errors.preenchimento &&
                                                                    errors
                                                                        .preenchimento[
                                                                        campo
                                                                            .codigo
                                                                    ]?.message
                                                                        ? errors
                                                                              .preenchimento[
                                                                              campo
                                                                                  .codigo
                                                                          ]
                                                                              ?.message
                                                                        : watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        ? "Campo reprovado: " +
                                                                          watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        : ""
                                                                }
                                                            />
                                                        ) : campo.tipoCampo ==
                                                              "date" ||
                                                          campo.tipoCampo ==
                                                              "time" ? (
                                                            <FormInput
                                                                size="sm"
                                                                type={
                                                                    campo.tipoCampo
                                                                }
                                                                label={
                                                                    campo.nome
                                                                }
                                                                {...register(
                                                                    "preenchimento." +
                                                                        campo.codigo,
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: modelo
                                                                                    .campos[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.obrigatorio,
                                                                                message:
                                                                                    "Campo obrigatório",
                                                                            },
                                                                    }
                                                                )}
                                                                borderColor={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? "green"
                                                                        : ""
                                                                }
                                                                borderWidth={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? 2
                                                                        : ""
                                                                }
                                                                error={
                                                                    errors.preenchimento &&
                                                                    errors
                                                                        .preenchimento[
                                                                        campo
                                                                            .codigo
                                                                    ]?.message
                                                                        ? errors
                                                                              .preenchimento[
                                                                              campo
                                                                                  .codigo
                                                                          ]
                                                                              ?.message
                                                                        : watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        ? "Campo reprovado: " +
                                                                          watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        : ""
                                                                }
                                                            />
                                                        ) : campo.tipoCampo ==
                                                          "image" ? (
                                                            <Flex align="center">
                                                                <Previews
                                                                    nome={
                                                                        campo.nome
                                                                    }
                                                                    codigo={
                                                                        campo.codigo
                                                                    }
                                                                    id={
                                                                        ficha.id
                                                                    }
                                                                    data={watch(
                                                                        "preenchimento." +
                                                                            campo.codigo
                                                                    )}
                                                                />
                                                                {/* <FormInput
                                                                    size="sm"
                                                                    type="file"
                                                                    label={
                                                                        campo.nome
                                                                    }
                                                                    {...register(
                                                                        "arquivos." +
                                                                            campo.codigo,
                                                                        {
                                                                            required:
                                                                                {
                                                                                    value:
                                                                                        modelo
                                                                                            .campos[
                                                                                            campo
                                                                                                .codigo
                                                                                        ]
                                                                                            ?.obrigatorio &&
                                                                                        !watch(
                                                                                            "preenchimento." +
                                                                                                campo.codigo
                                                                                        )
                                                                                            ? true
                                                                                            : false,
                                                                                    message:
                                                                                        "Campo obrigatório",
                                                                                },
                                                                        }
                                                                    )}
                                                                    borderColor={
                                                                        watch(
                                                                            "analise." +
                                                                                campo.codigo
                                                                        )
                                                                            ?.aprovado
                                                                            ? "green"
                                                                            : ""
                                                                    }
                                                                    borderWidth={
                                                                        watch(
                                                                            "analise." +
                                                                                campo.codigo
                                                                        )
                                                                            ?.aprovado
                                                                            ? 2
                                                                            : ""
                                                                    }
                                                                    error={
                                                                        errors.arquivos &&
                                                                        errors
                                                                            .arquivos[
                                                                            campo
                                                                                .codigo
                                                                        ]
                                                                            ?.message
                                                                            ? errors
                                                                                  .arquivos[
                                                                                  campo
                                                                                      .codigo
                                                                              ]
                                                                                  ?.message
                                                                            : watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            ? "Campo reprovado: " +
                                                                              watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            : ""
                                                                    }
                                                                    rightAddon={
                                                                        watch(
                                                                            "preenchimento." +
                                                                                campo.codigo
                                                                        ) && (
                                                                            <Link
                                                                                href={watch(
                                                                                    "preenchimento." +
                                                                                        campo.codigo
                                                                                )}
                                                                                target="_parent"
                                                                            >
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    colorScheme="blue"
                                                                                    leftIcon={
                                                                                        <Icon
                                                                                            as={
                                                                                                FiEye
                                                                                            }
                                                                                        />
                                                                                    }
                                                                                    px={
                                                                                        6
                                                                                    }
                                                                                >
                                                                                    Visualizar
                                                                                </Button>
                                                                            </Link>
                                                                        )
                                                                    }
                                                                /> */}
                                                            </Flex>
                                                        ) : campo.tipoCampo ==
                                                          "file" ? (
                                                            <Flex
                                                                align="center"
                                                                w="full"
                                                            >
                                                                <Previews
                                                                    nome={
                                                                        campo.nome
                                                                    }
                                                                    codigo={
                                                                        campo.codigo
                                                                    }
                                                                    id={
                                                                        ficha.id
                                                                    }
                                                                    data={watch(
                                                                        "preenchimento." +
                                                                            campo.codigo
                                                                    )}
                                                                />
                                                                {/* <FormInput
                                                                    size="sm"
                                                                    type="file"
                                                                    label={
                                                                        campo.nome
                                                                    }
                                                                    {...register(
                                                                        "arquivos." +
                                                                            campo.codigo,
                                                                        {
                                                                            required:
                                                                                {
                                                                                    value:
                                                                                        modelo
                                                                                            .campos[
                                                                                            campo
                                                                                                .codigo
                                                                                        ]
                                                                                            ?.obrigatorio &&
                                                                                        !watch(
                                                                                            "preenchimento." +
                                                                                                campo.codigo
                                                                                        )
                                                                                            ? true
                                                                                            : false,
                                                                                    message:
                                                                                        "Campo obrigatório",
                                                                                },
                                                                        }
                                                                    )}
                                                                    borderColor={
                                                                        watch(
                                                                            "analise." +
                                                                                campo.codigo
                                                                        )
                                                                            ?.aprovado
                                                                            ? "green"
                                                                            : ""
                                                                    }
                                                                    borderWidth={
                                                                        watch(
                                                                            "analise." +
                                                                                campo.codigo
                                                                        )
                                                                            ?.aprovado
                                                                            ? 2
                                                                            : ""
                                                                    }
                                                                    onChange={() =>
                                                                        handleSubmit(
                                                                            onSubmit
                                                                        )
                                                                    }
                                                                    error={
                                                                        errors.arquivos &&
                                                                        errors
                                                                            .arquivos[
                                                                            campo
                                                                                .codigo
                                                                        ]
                                                                            ?.message
                                                                            ? errors
                                                                                  .arquivos[
                                                                                  campo
                                                                                      .codigo
                                                                              ]
                                                                                  ?.message
                                                                            : watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            ? "Campo reprovado: " +
                                                                              watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            : ""
                                                                    }
                                                                    rightAddon={
                                                                        watch(
                                                                            "preenchimento." +
                                                                                campo.codigo
                                                                        ) && (
                                                                            <Link
                                                                                href={watch(
                                                                                    "preenchimento." +
                                                                                        campo.codigo
                                                                                )}
                                                                                target="_parent"
                                                                            >
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    colorScheme="blue"
                                                                                    leftIcon={
                                                                                        <Icon
                                                                                            as={
                                                                                                FiEye
                                                                                            }
                                                                                        />
                                                                                    }
                                                                                    px={
                                                                                        6
                                                                                    }
                                                                                >
                                                                                    Visualizar
                                                                                </Button>
                                                                            </Link>
                                                                        )
                                                                    }
                                                                /> */}
                                                            </Flex>
                                                        ) : campo.tipoCampo ==
                                                          "files" ? (
                                                            <FormInput
                                                                size="sm"
                                                                type="file"
                                                                multiple="multiple"
                                                                label={
                                                                    campo.nome
                                                                }
                                                                {...register(
                                                                    "arquivos." +
                                                                        campo.codigo,
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: modelo
                                                                                    .campos[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.obrigatorio,
                                                                                message:
                                                                                    "Campo obrigatório",
                                                                            },
                                                                    }
                                                                )}
                                                            />
                                                        ) : (
                                                            ""
                                                        )}
                                                    </GridItem>
                                                ))}
                                        </Grid>
                                    </Box>
                                ))}
                            <GridItem
                                hidden={
                                    activeStep !=
                                    campos.filter((i) =>
                                        i.campos.find(
                                            (e) =>
                                                modelo?.campos[e.codigo]?.exibir
                                        )
                                    ).length
                                }
                            >
                                <Box
                                    colSpan={{ base: 1, lg: 5 }}
                                    p={4}
                                    bg="white"
                                    mt={4}
                                >
                                    <Box
                                        dangerouslySetInnerHTML={{
                                            __html: modelo.instrucoes,
                                        }}
                                    />
                                </Box>
                                <Flex mt={4} p={4} bg="white" flexDir="column">
                                    {modelo.checkbox?.map((item, key) => (
                                        <Checkbox
                                            key={item.id}
                                            {...register("checkbox_" + key, {
                                                required: {
                                                    message:
                                                        "Você deve aceitar para prosseguir",
                                                    value: true,
                                                },
                                            })}
                                            isInvalid={
                                                errors[`checkbox_${key}`]
                                                    ?.message
                                            }
                                        >
                                            {item}{" "}
                                            {errors[`checkbox_${key}`]
                                                ?.message && (
                                                <Tag colorScheme="red">
                                                    Você deve aceitar os termos
                                                    para prosseguir
                                                </Tag>
                                            )}
                                        </Checkbox>
                                    ))}
                                </Flex>
                            </GridItem>
                        </Grid>{" "}
                        <Flex py={4} justify="space-between">
                            <Button
                                isDisabled={activeStep == 0}
                                size="sm"
                                colorScheme="blue"
                                type="button"
                                leftIcon={<BsArrowLeft />}
                                onClick={() => setActiveStep(activeStep - 1)}
                            >
                                Voltar
                            </Button>
                            {activeStep !=
                                campos.filter((i) =>
                                    i.campos.find(
                                        (e) => modelo?.campos[e.codigo]?.exibir
                                    )
                                ).length && (
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    type="button"
                                    isLoading={isSubmitting}
                                    rightIcon={<BsArrowRight />}
                                    onClick={() =>
                                        setActiveStep(activeStep + 1)
                                    }
                                >
                                    Avançar
                                </Button>
                            )}
                            {(ficha.status == "reprovada" ||
                                ficha.status == "aguardando") &&
                                activeStep ==
                                    campos.filter((i) =>
                                        i.campos.find(
                                            (e) =>
                                                modelo?.campos[e.codigo]?.exibir
                                        )
                                    ).length && (
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        type="submit"
                                        isLoading={isSubmitting}
                                        rightIcon={<BiSave />}
                                    >
                                        Salvar
                                    </Button>
                                )}
                        </Flex>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default FichaCadastral;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { id } = ctx.query;
    let ficha = await prisma.fichaCadastral.findUnique({
        where: { id },
        include: {
            imobiliaria: true,
            modelo: true,
            preenchimento: {
                include: {
                    campo: true,
                },
            },
            imovel: true,
            Processo: true,
        },
    });
    if (ficha?.deletedAt) {
        return {
            props: {
                notFound: true,
            },
        };
    }
    const modelo = await prisma.modeloFichaCadastral.findUnique({
        where: {
            id: ficha?.modeloFichaCadastralId,
        },
    });
    const campos = await prisma.categoriaCampoFichaCadastral.findMany({
        where: {
            campos: {
                some: {
                    tipoFicha: ficha?.modelo.tipo,
                    deletedAt: null,
                },
            },
            deletedAt: null,
        },
        orderBy: {
            ordem: "asc",
        },
        include: {
            campos: {
                where: {
                    tipoFicha: ficha?.modelo.tipo,
                    deletedAt: null,
                },
                orderBy: {
                    ordem: "asc",
                },
                include: {
                    dependencia: true,
                },
            },
        },
    });
    let newObj = {};
    let newArq = {};
    let analise = {};
    ficha.preenchimento.map((item) => {
        newObj[item.campoFichaCadastralCodigo] = item.valor;
        analise[item.campoFichaCadastralCodigo] = {
            aprovado: item.aprovado,
            motivoReprovacao: item.motivoReprovacao,
        };
    });
    ficha.preenchimento = newObj;
    ficha.analise = analise;
    return {
        props: {
            ficha: JSON.parse(JSON.stringify(ficha)),
            modelo: JSON.parse(JSON.stringify(modelo)),
            campos: JSON.parse(JSON.stringify(campos)),
        },
    };
};

// import { FormInput } from "@/components/Form/FormInput";
// import { Layout } from "@/components/Layout/layout";
// import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
// import prisma from "@/lib/prisma";
// import {
//     atualizarAnexosFicha,
//     atualizarFicha,
// } from "@/services/models/public/fichaCadastral";
// import {
//     Alert,
//     AlertDescription,
//     AlertIcon,
//     AlertTitle,
//     Box,
//     Button,
//     Checkbox,
//     Container,
//     Flex,
//     FormLabel,
//     Grid,
//     GridItem,
//     Heading,
//     Icon,
//     IconButton,
//     Image,
//     Progress,
//     Radio,
//     RadioGroup,
//     Stack,
//     Step,
//     StepDescription,
//     StepIcon,
//     StepIndicator,
//     StepNumber,
//     StepSeparator,
//     StepStatus,
//     StepTitle,
//     Stepper,
//     Tag,
//     Text,
//     Tooltip,
//     useSteps,
//     useToast,
// } from "@chakra-ui/react";
// import { FileUpload } from "primereact/fileupload";
// import { yupResolver } from "@hookform/resolvers/yup";
// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { FiEye, FiFile, FiPlus, FiUpload } from "react-icons/fi";
// import { useMutation } from "react-query";
// import * as yup from "yup";
// import "react-quill/dist/quill.snow.css";
// import { buscarEndereco } from "@/lib/buscarEndereco";
// import { GetServerSideProps } from "next";
// import { FormSelect } from "@/components/Form/FormSelect";
// import {
//     convertToBase64,
//     formatoValor,
//     getFileExtension,
// } from "@/helpers/helpers";
// import { Head } from "@/components/Head";
// import { BiSave } from "react-icons/bi";
// import "react-dropzone-uploader/dist/styles.css";
// import Dropzone from "react-dropzone-uploader";
// import { useDropzone } from "react-dropzone";
// import { MdClose } from "react-icons/md";

// function Previews(props) {
//     const toast = useToast(null);
//     const [totalSize, setTotalSize] = useState(0);
//     const fileUploadRef = useRef(null);

//     const onTemplateSelect = (e) => {
//         let _totalSize = totalSize;
//         let files = e.files;

//         Object.keys(files).forEach((key) => {
//             _totalSize += files[key].size || 0;
//         });

//         setTotalSize(_totalSize);
//     };

//     const onTemplateUpload = (e) => {
//         let _totalSize = 0;

//         e.files.forEach((file) => {
//             _totalSize += file.size || 0;
//         });

//         setTotalSize(_totalSize);
//         toast({
//             status: "info",
//             title: "File Uploaded",
//         });
//     };

//     const onTemplateRemove = (file, callback) => {
//         setTotalSize(totalSize - file.size < 0 ? 0 : totalSize - file.size);
//         callback();
//     };

//     const onTemplateClear = () => {
//         setTotalSize(0);
//     };

//     const headerTemplate = (options) => {
//         const { className, chooseButton, uploadButton, cancelButton } = options;
//         const value = totalSize / 100000;
//         const formatedValue =
//             fileUploadRef && fileUploadRef.current
//                 ? fileUploadRef.current.formatSize(totalSize)
//                 : "0 B";

//         return (
//             <Flex
//                 alignItems="center"
//                 justify="space-between"
//                 flexDir="column"
//                 gap={2}
//             >
//                 <Flex gap={4}>
//                     {chooseButton}
//                     {uploadButton}
//                     {cancelButton}
//                 </Flex>
//                 <Flex align="center" gap={3} ml="auto">
//                     <Text fontSize="xs">{formatedValue} / 100 MB</Text>
//                     <Progress
//                         value={value}
//                         max={100}
//                         hasStripe
//                         rounded="full"
//                         w={44}
//                     />
//                 </Flex>
//             </Flex>
//         );
//     };

//     const itemTemplate = (file, props) => {
//         return (
//             <Flex align="center" justify="space-between" flexWrap="wrap">
//                 <Flex align="center">
//                     <img
//                         alt={file.name}
//                         role="presentation"
//                         src={file.objectURL}
//                         width={100}
//                     />
//                     <Flex as="span" flexDir="column" textAlign="left" ml={3}>
//                         {file.name}
//                         <Tag
//                             size="sm"
//                             colorScheme="orange"
//                             className="px-3 py-2"
//                         >
//                             {props.formatSize}
//                         </Tag>
//                     </Flex>
//                 </Flex>

//                 <IconButton
//                     colorScheme="red"
//                     variant="outline"
//                     icon={<MdClose />}
//                     onClick={() => onTemplateRemove(file, props.onRemove)}
//                 />
//             </Flex>
//         );
//     };

//     const emptyTemplate = () => {
//         return (
//             <Flex align="center" flexDir="column" p={4}>
//                 <Icon as={FiFile} fontSize="2em" color="gray" />
//                 <Text fontSize="sm" color="gray">
//                     Arraste e solte aqui
//                 </Text>
//             </Flex>
//         );
//     };

//     const atualizarAnexos = useMutation(atualizarAnexosFicha);
//     const customBase64Uploader = async (event) => {
//         // convert file to base64 encoded
//         const file = event.files[0];

//         const base64String = await convertToBase64(file);
//         const fileExtension = getFileExtension(file.name);

//         await atualizarAnexos.mutateAsync(
//             {
//                 id: props.id,
//                 formData: {
//                     arquivos: [
//                         {
//                             nome: props.nome,
//                             extensao: fileExtension,
//                             base64: base64String,
//                         },
//                     ],
//                 },
//             },
//             {
//                 onSuccess: () => {
//                     toast({ title: "Upload realizado com sucesso" });
//                 },
//             }
//         );
//     };
//     return (
//         <Flex flexDir="column" gap={4} borderWidth={1} p={4} rounded="lg">
//             <Text>{props.nome}</Text>
//             <FileUpload
//                 ref={fileUploadRef}
//                 nome={props.codigo}
//                 id={props.id}
//                 customUpload
//                 multiple={props.multiple}
//                 maxFileSize={100000000}
//                 onUpload={onTemplateUpload}
//                 onSelect={onTemplateSelect}
//                 onError={onTemplateClear}
//                 onClear={onTemplateClear}
//                 headerTemplate={headerTemplate}
//                 itemTemplate={itemTemplate}
//                 emptyTemplate={emptyTemplate}
//                 uploadHandler={customBase64Uploader}
//                 mode="advanced"
//                 uploadOptions={{
//                     icon: (
//                         <Tooltip label="Upload">
//                             <IconButton icon={<FiUpload />} />
//                         </Tooltip>
//                     ),
//                     iconOnly: true,
//                 }}
//                 chooseOptions={{
//                     icon: (props) => (
//                         <Tooltip label="Selecionar arquivo">
//                             <IconButton icon={<FiPlus />} {...props} />
//                         </Tooltip>
//                     ),
//                     iconOnly: true,
//                 }}
//                 cancelOptions={{
//                     icon: (
//                         <Tooltip label="Cancelar">
//                             <IconButton icon={<MdClose />} />
//                         </Tooltip>
//                     ),
//                     iconOnly: true,
//                 }}
//             />
//             {props.data && (
//                 <Flex flexDir="column" gap={1}>
//                     <Text fontSize="sm">Arquivos anexados</Text>
//                     <Image src={props.data} w={24} />
//                 </Flex>
//             )}
//         </Flex>
//     );
// }

// const FichaCadastral = ({ ficha, campos, modelo }) => {
//     const [schema, setSchema] = useState({});
//     const toast = useToast();
//     const {
//         control,
//         reset,
//         watch,
//         register,
//         handleSubmit,
//         formState: { isSubmitting, errors },
//     } = useForm({
//         defaultValues: {
//             ...ficha,
//         },
//     });
//     const atualizar = useMutation(atualizarFicha);
//     const atualizarAnexos = useMutation(atualizarAnexosFicha); // Função para converter arquivo para base64

//     const onSubmit = async (data) => {
//         try {
//             console.log(data);
//             await atualizar.mutateAsync(data);

//             const formData = new FormData();
//             if (data.arquivos && Object.entries(data.arquivos).length) {
//                 const filesData = await Promise.all(
//                     Object.entries(data.arquivos).map(async (item) => {
//                         var files = item[1];
//                         console.log("files", files, item[1]);

//                         const filePromises = Array.from(files).map(
//                             async (file) => {
//                                 console.log(file, file.name);
//                                 const base64String = await convertToBase64(
//                                     file
//                                 );
//                                 const fileExtension = getFileExtension(
//                                     file.name
//                                 );

//                                 return {
//                                     nome: item[0],
//                                     extensao: fileExtension,
//                                     base64: base64String,
//                                 };
//                             }
//                         );

//                         return Promise.all(filePromises);
//                     })
//                 );

//                 // Flatten the array
//                 const flattenedFilesData = filesData.flat();

//                 // Now you have an array of objects with nome, extensao, and base64 properties
//                 console.log(flattenedFilesData);
//                 await atualizarAnexos.mutateAsync({
//                     id: data.id,
//                     formData: {
//                         arquivos: flattenedFilesData,
//                     },
//                 });
//             }

//             toast({ title: "Ficha salva", status: "success" });
//         } catch (e) {
//             console.log(e);
//             toast({
//                 title: "Houve um problema",
//                 description: e.response?.data?.message,
//                 status: "error",
//             });
//         }
//     };

//     const buscarEnderecoPorCep = async (cep, camposEndereco) => {
//         try {
//             if (cep.length > 8) {
//                 const res = await buscarEndereco(cep);
//                 console.log(res);
//                 let obj = {};
//                 Object.entries(camposEndereco).map((item) => {
//                     if (item[0] == "endereco") {
//                         obj[item[1].codigo] = res.logradouro;
//                     } else if (item[0] == "bairro") {
//                         obj[item[1].codigo] = res.bairro;
//                     } else if (item[0] == "cidade") {
//                         obj[item[1].codigo] = res.cidade;
//                     } else if (item[0] == "estado") {
//                         obj[item[1].codigo] = res.uf;
//                     }
//                 });
//                 reset({
//                     ...watch(),
//                     preenchimento: {
//                         ...watch("preenchimento"),
//                         ...obj,
//                     },
//                 });
//             }
//         } catch (e) {
//             toast({
//                 title: "Endereço não encontrado",
//                 status: "warning",
//             });
//         }
//     };
//     const { activeStep, setActiveStep } = useSteps({
//         index: 1,
//         count: campos.filter((i) =>
//     i.campos.find(
//         (e) => modelo?.campos[e.codigo]?.exibir
//     )
// ).length,
//     });
//     const getUploadParams = ({ meta }) => {
//         return { url: "https://httpbin.org/post" };
//     };

//     // called every time a file's `status` changes
//     const handleChangeStatus = ({ meta, file }, status) => {
//         console.log(status, meta, file);
//     };

//     // receives array of files that are done uploading when submit button is clicked
//     const handleSubmitFiles = (files, allFiles) => {
//         console.log("Upload");
//         console.log(files.map((f) => f.meta));
//         allFiles.forEach((f) => f.remove());
//     };

//     return (
//         <Box
//             bg="gray.100"
//             minH="100vh"
//             as="form"
//             onSubmit={handleSubmit(onSubmit)}
//         >
//             <Head
//                 title={ficha?.nome}
//                 description={`${modelo.nome} - ${modelo.descricao}`}
//             />
//             <Container maxW="container.xl">
//                 <Flex
//                     align="center"
//                     py={6}
//                     gap={6}
//                     flexDir={{ base: "column", lg: "row" }}
//                 >
//                     <Box>
//                         <Image h={100} src={ficha.imobiliaria.logo} />
//                     </Box>
//                     <Box>
//                         <Text>
//                             <Text as="span" fontWeight="bold">
//                                 {ficha.imobiliaria.razaoSocial}
//                             </Text>{" "}
//                             • CNPJ: {ficha.imobiliaria.cnpj}
//                         </Text>
//                         <Text fontSize="sm">
//                             {ficha.imobiliaria.endereco}
//                             {ficha.imobiliaria.numero &&
//                                 ` nº ${ficha.imobiliaria.numero}`}
//                             ,{ficha.imobiliaria.bairro},
//                             {ficha.imobiliaria.cidade}/
//                             {ficha.imobiliaria.estado} - CEP:{" "}
//                             {ficha.imobiliaria.cep}
//                         </Text>
//                         <Text fontSize="sm">
//                             <Text as="span" fontWeight="bold">
//                                 Fixo:
//                             </Text>{" "}
//                             {ficha.imobiliaria.telefone} •{" "}
//                             <Text as="span" fontWeight="bold">
//                                 E-mail:
//                             </Text>{" "}
//                             {ficha.imobiliaria.email} •{" "}
//                             <Text as="span" fontWeight="bold">
//                                 Site:
//                             </Text>{" "}
//                             {ficha.imobiliaria.site}
//                         </Text>
//                     </Box>
//                 </Flex>
//                 <Box py={4}>
//                     <Heading size="md" textAlign="center">
//                         {modelo.nome}
//                     </Heading>
//                     <Text textAlign="center" fontSize="sm" color="gray">
//                         {modelo.descricao}
//                     </Text>
//                     {ficha.status == "aprovada" && (
//                         <Alert status="success" my={2}>
//                             <AlertIcon />
//                             <AlertTitle>Ficha Aprovada</AlertTitle>
//                         </Alert>
//                     )}
//                     {ficha.status == "reprovada" && (
//                         <Alert status="error" my={2}>
//                             <AlertIcon />
//                             <AlertTitle>Ficha reprovada</AlertTitle>
//                             <AlertDescription>
//                                 {ficha.motivoReprovacao}
//                             </AlertDescription>
//                         </Alert>
//                     )}
//                 </Box>

//                 <Grid
//                     gridTemplateColumns={{ lg: "repeat(6,1fr)" }}
//                     gap={4}
//                     my={2}
//                 >
//                     <GridItem colSpan={{ lg: 3 }}>
//                         {ficha.imovel ? (
//                             <Box p={4} bg="white">
//                                 <Text fontSize="sm" color="gray">
//                                     Ficha referente ao imóvel:
//                                 </Text>
//                                 <Text>
//                                     {ficha.imovel?.codigo} -{" "}
//                                     {ficha.imovel?.endereco},{" "}
//                                     {ficha.imovel?.bairro},{" "}
//                                     {ficha.imovel?.cidade}/
//                                     {ficha.imovel?.estado}
//                                 </Text>
//                             </Box>
//                         ) : ficha.codigoImovel ? (
//                             <Box p={2} bg="white">
//                                 <Text fontSize="sm" color="gray">
//                                     Ficha referente ao imóvel:
//                                 </Text>
//                                 <Text>
//                                     {ficha.codigoImovel} -{" "}
//                                     {ficha.enderecoImovel} nº{" "}
//                                     {ficha.numeroImovel}{" "}
//                                     {ficha.complementoImovel &&
//                                         `(${ficha.complementoImovel})`}
//                                     , {ficha.bairroImovel}, {ficha.cidadeImovel}
//                                     /{ficha.estadoImovel}
//                                 </Text>
//                             </Box>
//                         ) : (
//                             ""
//                         )}
//                     </GridItem>
//                     {ficha.Processo?.campos?.find((e) => e.valor)?.valor && (
//                         <GridItem p={4} bg="white">
//                             <Text fontSize="sm" color="gray">
//                                 Valor Negociado
//                             </Text>
//                             <Text>
//                                 {
//                                     ficha.Processo?.campos?.find((e) => e.valor)
//                                         ?.valor
//                                 }
//                             </Text>
//                         </GridItem>
//                     )}
//                     {ficha.imovel?.valorCondominio && (
//                         <GridItem p={4} bg="white">
//                             <Text fontSize="sm" color="gray">
//                                 Valor Condominio
//                             </Text>
//                             <Text>
//                                 {formatoValor(ficha.imovel?.valorCondominio)}
//                             </Text>
//                         </GridItem>
//                     )}
//                     {ficha.imovel?.valorIPTU && (
//                         <GridItem p={4} bg="white">
//                             <Text fontSize="sm" color="gray">
//                                 Valor IPTU
//                             </Text>
//                             <Text>{formatoValor(ficha.imovel?.valorIPTU)}</Text>
//                         </GridItem>
//                     )}
//                 </Grid>
//                 <Flex>
//                     {/* <Box w="2xl">
//                         <Stepper
//                             size="xs"
//                             index={activeStep}
//                             orientation="vertical"
//                         >
//                             {campos.map((step, index) => (
//                                 <Step
//                                     key={index}
//                                     onClick={() => setActiveStep(index)}
//                                 >
//                                     <StepIndicator>
//                                         <StepStatus
//                                             complete={<StepIcon />}
//                                             incomplete={<StepNumber />}
//                                             active={<StepNumber />}
//                                         />
//                                     </StepIndicator>

//                                     <Box flexShrink="0">
//                                         <StepTitle>{step.nome}</StepTitle>
//                                         <StepDescription>
//                                             {step.descricao}
//                                         </StepDescription>
//                                     </Box>

//                                     <StepSeparator />
//                                 </Step>
//                             ))}
// //                             <Step onClick={() => setActiveStep(campos.filter((i) =>
//                                     i.campos.find(
//                                         (e) => modelo?.campos[e.codigo]?.exibir
//                                     )
//                                 ).length)}>
//                                 <StepIndicator>
//                                     <StepStatus
//                                         complete={<StepIcon />}
//                                         incomplete={<StepNumber />}
//                                         active={<StepNumber />}
//                                     />
//                                 </StepIndicator>

//                                 <Box flexShrink="0">
//                                     <StepTitle>Resumo</StepTitle>
//                                     <StepDescription>
//                                         Confira os dados informados
//                                     </StepDescription>
//                                 </Box>

//                                 <StepSeparator />
//                             </Step>
//                         </Stepper>
//                     </Box> */}
//                     <Box>
//                         <Grid gap={4}>
//                             {campos
//                                 .filter((i) =>
//                                     i.campos.find(
//                                         (e) => modelo?.campos[e.codigo]?.exibir
//                                     )
//                                 )
//                                 .map((item, index) => (
//                                     <Box
//                                         key={item.id}
//                                         bg="white"
//                                         p={4}
//                                         // hidden={activeStep != index}
//                                     >
//                                         <Heading size="sm" mb={6}>
//                                             {item.nome}
//                                         </Heading>
//                                         <Grid
//                                             gridTemplateColumns={{
//                                                 base: "repeat(1,1fr)",
//                                                 lg: "repeat(6,1fr)",
//                                             }}
//                                             gap={2}
//                                         >
//                                             {item.campos
//                                                 .filter((i) => {
//                                                     if (
//                                                         (modelo.campos[
//                                                             i.codigo
//                                                         ] &&
//                                                             modelo?.campos[
//                                                                 i.codigo
//                                                             ]?.exibir &&
//                                                             !i.dependencia) ||
//                                                         (modelo.campos[
//                                                             i.codigo
//                                                         ] &&
//                                                             modelo?.campos[
//                                                                 i.codigo
//                                                             ]?.exibir &&
//                                                             ((i.dependencia
//                                                                 ?.codigo &&
//                                                                 !i.dependenciaValor &&
//                                                                 watch(
//                                                                     `preenchimento.${i.dependencia?.codigo}`
//                                                                 )) ||
//                                                                 (i.dependencia
//                                                                     ?.codigo &&
//                                                                     i.dependenciaValor ==
//                                                                         watch(
//                                                                             `preenchimento.${i.dependencia?.codigo}`
//                                                                         ))))
//                                                     ) {
//                                                         return true;
//                                                     } else {
//                                                         return false;
//                                                     }
//                                                 })
//                                                 .map((campo) => (
//                                                     <GridItem
//                                                         key={campo.id}
//                                                         colSpan={{
//                                                             lg:
//                                                                 campo.tipoCampo ==
//                                                                 "file"
//                                                                     ? 2
//                                                                     : campo.colSpan !=
//                                                                       1
//                                                                     ? campo.colSpan
//                                                                     : 1,
//                                                         }}
//                                                     >
//                                                         {campo.tipoCampo ==
//                                                             "checkbox" && (
//                                                             <>
//                                                                 <Controller
//                                                                     control={
//                                                                         control
//                                                                     }
//                                                                     name={
//                                                                         "preenchimento." +
//                                                                         campo.codigo
//                                                                     }
//                                                                     rules={{
//                                                                         required:
//                                                                             {
//                                                                                 value: modelo
//                                                                                     .campos[
//                                                                                     campo
//                                                                                         .codigo
//                                                                                 ]
//                                                                                     ?.obrigatorio,
//                                                                                 message:
//                                                                                     "Campo obrigatório",
//                                                                             },
//                                                                     }}
//                                                                     render={({
//                                                                         field,
//                                                                     }) => (
//                                                                         <Checkbox
//                                                                             {...field}
//                                                                             onChange={(
//                                                                                 e
//                                                                             ) => {
//                                                                                 if (
//                                                                                     e
//                                                                                         .target
//                                                                                         .checked
//                                                                                 ) {
//                                                                                     field.onChange(
//                                                                                         "Sim"
//                                                                                     );
//                                                                                 } else {
//                                                                                     field.onChange(
//                                                                                         "Não"
//                                                                                     );
//                                                                                 }
//                                                                             }}
//                                                                             borderColor={
//                                                                                 watch(
//                                                                                     "analise." +
//                                                                                         campo.codigo
//                                                                                 )
//                                                                                     ?.aprovado
//                                                                                     ? "green"
//                                                                                     : ""
//                                                                             }
//                                                                             borderWidth={
//                                                                                 watch(
//                                                                                     "analise." +
//                                                                                         campo.codigo
//                                                                                 )
//                                                                                     ?.aprovado
//                                                                                     ? 2
//                                                                                     : ""
//                                                                             }
//                                                                             error={
//                                                                                 errors.preenchimento &&
//                                                                                 errors
//                                                                                     .preenchimento[
//                                                                                     campo
//                                                                                         .codigo
//                                                                                 ]
//                                                                                     ?.message
//                                                                                     ? errors
//                                                                                           .preenchimento[
//                                                                                           campo
//                                                                                               .codigo
//                                                                                       ]
//                                                                                           ?.message
//                                                                                     : watch(
//                                                                                           "analise." +
//                                                                                               campo.codigo
//                                                                                       )
//                                                                                           ?.motivoReprovacao
//                                                                                     ? "Campo reprovado: " +
//                                                                                       watch(
//                                                                                           "analise." +
//                                                                                               campo.codigo
//                                                                                       )
//                                                                                           ?.motivoReprovacao
//                                                                                     : ""
//                                                                             }
//                                                                         >
//                                                                             {
//                                                                                 campo.nome
//                                                                             }
//                                                                         </Checkbox>
//                                                                     )}
//                                                                 />
//                                                             </>
//                                                         )}
//                                                         {campo.tipoCampo ==
//                                                             "select" && (
//                                                             <FormSelect
//                                                                 size="sm"
//                                                                 label={
//                                                                     campo.nome
//                                                                 }
//                                                                 mask={
//                                                                     campo.mask
//                                                                 }
//                                                                 placeholder={`Selecione ${campo.nome}`}
//                                                                 {...register(
//                                                                     "preenchimento." +
//                                                                         campo.codigo,
//                                                                     {
//                                                                         required:
//                                                                             {
//                                                                                 value: modelo
//                                                                                     .campos[
//                                                                                     campo
//                                                                                         .codigo
//                                                                                 ]
//                                                                                     ?.obrigatorio,
//                                                                                 message:
//                                                                                     "Campo obrigatório",
//                                                                             },
//                                                                     }
//                                                                 )}
//                                                                 borderColor={
//                                                                     watch(
//                                                                         "analise." +
//                                                                             campo.codigo
//                                                                     )?.aprovado
//                                                                         ? "green"
//                                                                         : ""
//                                                                 }
//                                                                 borderWidth={
//                                                                     watch(
//                                                                         "analise." +
//                                                                             campo.codigo
//                                                                     )?.aprovado
//                                                                         ? 2
//                                                                         : ""
//                                                                 }
//                                                                 error={
//                                                                     errors.preenchimento &&
//                                                                     errors
//                                                                         .preenchimento[
//                                                                         campo
//                                                                             .codigo
//                                                                     ]?.message
//                                                                         ? errors
//                                                                               .preenchimento[
//                                                                               campo
//                                                                                   .codigo
//                                                                           ]
//                                                                               ?.message
//                                                                         : watch(
//                                                                               "analise." +
//                                                                                   campo.codigo
//                                                                           )
//                                                                               ?.motivoReprovacao
//                                                                         ? "Campo reprovado: " +
//                                                                           watch(
//                                                                               "analise." +
//                                                                                   campo.codigo
//                                                                           )
//                                                                               ?.motivoReprovacao
//                                                                         : ""
//                                                                 }
//                                                             >
//                                                                 {campo.opcoes.map(
//                                                                     (op) => (
//                                                                         <option
//                                                                             key={
//                                                                                 op
//                                                                             }
//                                                                             value={
//                                                                                 op
//                                                                             }
//                                                                         >
//                                                                             {op}
//                                                                         </option>
//                                                                     )
//                                                                 )}
//                                                             </FormSelect>
//                                                         )}
//                                                         {campo.tipoCampo ==
//                                                             "cnpj" ||
//                                                         campo.tipoCampo ==
//                                                             "cpf" ||
//                                                         campo.tipoCampo ==
//                                                             "text" ||
//                                                         campo.tipoCampo ==
//                                                             "number" ||
//                                                         campo.tipoCampo ==
//                                                             "qrcode" ? (
//                                                             <FormInput
//                                                                 size="sm"
//                                                                 type={
//                                                                     campo.tipoCampo
//                                                                 }
//                                                                 label={
//                                                                     campo.nome
//                                                                 }
//                                                                 mask={
//                                                                     campo.mask
//                                                                 }
//                                                                 {...register(
//                                                                     "preenchimento." +
//                                                                         campo.codigo,
//                                                                     {
//                                                                         required:
//                                                                             {
//                                                                                 value: modelo
//                                                                                     .campos[
//                                                                                     campo
//                                                                                         .codigo
//                                                                                 ]
//                                                                                     ?.obrigatorio,
//                                                                                 message:
//                                                                                     "Campo obrigatório",
//                                                                             },
//                                                                         onChange:
//                                                                             (
//                                                                                 e
//                                                                             ) => {
//                                                                                 if (
//                                                                                     campo.cep
//                                                                                 ) {
//                                                                                     buscarEnderecoPorCep(
//                                                                                         e
//                                                                                             .target
//                                                                                             .value,
//                                                                                         campo.camposEndereco
//                                                                                     );
//                                                                                 }
//                                                                             },
//                                                                     }
//                                                                 )}
//                                                                 borderColor={
//                                                                     watch(
//                                                                         "analise." +
//                                                                             campo.codigo
//                                                                     )?.aprovado
//                                                                         ? "green"
//                                                                         : ""
//                                                                 }
//                                                                 borderWidth={
//                                                                     watch(
//                                                                         "analise." +
//                                                                             campo.codigo
//                                                                     )?.aprovado
//                                                                         ? 2
//                                                                         : ""
//                                                                 }
//                                                                 error={
//                                                                     errors.preenchimento &&
//                                                                     errors
//                                                                         .preenchimento[
//                                                                         campo
//                                                                             .codigo
//                                                                     ]?.message
//                                                                         ? errors
//                                                                               .preenchimento[
//                                                                               campo
//                                                                                   .codigo
//                                                                           ]
//                                                                               ?.message
//                                                                         : watch(
//                                                                               "analise." +
//                                                                                   campo.codigo
//                                                                           )
//                                                                               ?.motivoReprovacao
//                                                                         ? "Campo reprovado: " +
//                                                                           watch(
//                                                                               "analise." +
//                                                                                   campo.codigo
//                                                                           )
//                                                                               ?.motivoReprovacao
//                                                                         : ""
//                                                                 }
//                                                             />
//                                                         ) : campo.tipoCampo ==
//                                                               "date" ||
//                                                           campo.tipoCampo ==
//                                                               "time" ? (
//                                                             <FormInput
//                                                                 size="sm"
//                                                                 type={
//                                                                     campo.tipoCampo
//                                                                 }
//                                                                 label={
//                                                                     campo.nome
//                                                                 }
//                                                                 {...register(
//                                                                     "preenchimento." +
//                                                                         campo.codigo,
//                                                                     {
//                                                                         required:
//                                                                             {
//                                                                                 value: modelo
//                                                                                     .campos[
//                                                                                     campo
//                                                                                         .codigo
//                                                                                 ]
//                                                                                     ?.obrigatorio,
//                                                                                 message:
//                                                                                     "Campo obrigatório",
//                                                                             },
//                                                                     }
//                                                                 )}
//                                                                 borderColor={
//                                                                     watch(
//                                                                         "analise." +
//                                                                             campo.codigo
//                                                                     )?.aprovado
//                                                                         ? "green"
//                                                                         : ""
//                                                                 }
//                                                                 borderWidth={
//                                                                     watch(
//                                                                         "analise." +
//                                                                             campo.codigo
//                                                                     )?.aprovado
//                                                                         ? 2
//                                                                         : ""
//                                                                 }
//                                                                 error={
//                                                                     errors.preenchimento &&
//                                                                     errors
//                                                                         .preenchimento[
//                                                                         campo
//                                                                             .codigo
//                                                                     ]?.message
//                                                                         ? errors
//                                                                               .preenchimento[
//                                                                               campo
//                                                                                   .codigo
//                                                                           ]
//                                                                               ?.message
//                                                                         : watch(
//                                                                               "analise." +
//                                                                                   campo.codigo
//                                                                           )
//                                                                               ?.motivoReprovacao
//                                                                         ? "Campo reprovado: " +
//                                                                           watch(
//                                                                               "analise." +
//                                                                                   campo.codigo
//                                                                           )
//                                                                               ?.motivoReprovacao
//                                                                         : ""
//                                                                 }
//                                                             />
//                                                         ) : campo.tipoCampo ==
//                                                           "image" ? (
//                                                             <Flex align="center">
//                                                                 <FormInput
//                                                                     size="sm"
//                                                                     type="file"
//                                                                     label={
//                                                                         campo.nome
//                                                                     }
//                                                                     {...register(
//                                                                         "arquivos." +
//                                                                             campo.codigo,
//                                                                         {
//                                                                             required:
//                                                                                 {
//                                                                                     value:
//                                                                                         modelo
//                                                                                             .campos[
//                                                                                             campo
//                                                                                                 .codigo
//                                                                                         ]
//                                                                                             ?.obrigatorio &&
//                                                                                         !watch(
//                                                                                             "preenchimento." +
//                                                                                                 campo.codigo
//                                                                                         )
//                                                                                             ? true
//                                                                                             : false,
//                                                                                     message:
//                                                                                         "Campo obrigatório",
//                                                                                 },
//                                                                         }
//                                                                     )}
//                                                                     borderColor={
//                                                                         watch(
//                                                                             "analise." +
//                                                                                 campo.codigo
//                                                                         )
//                                                                             ?.aprovado
//                                                                             ? "green"
//                                                                             : ""
//                                                                     }
//                                                                     borderWidth={
//                                                                         watch(
//                                                                             "analise." +
//                                                                                 campo.codigo
//                                                                         )
//                                                                             ?.aprovado
//                                                                             ? 2
//                                                                             : ""
//                                                                     }
//                                                                     error={
//                                                                         errors.arquivos &&
//                                                                         errors
//                                                                             .arquivos[
//                                                                             campo
//                                                                                 .codigo
//                                                                         ]
//                                                                             ?.message
//                                                                             ? errors
//                                                                                   .arquivos[
//                                                                                   campo
//                                                                                       .codigo
//                                                                               ]
//                                                                                   ?.message
//                                                                             : watch(
//                                                                                   "analise." +
//                                                                                       campo.codigo
//                                                                               )
//                                                                                   ?.motivoReprovacao
//                                                                             ? "Campo reprovado: " +
//                                                                               watch(
//                                                                                   "analise." +
//                                                                                       campo.codigo
//                                                                               )
//                                                                                   ?.motivoReprovacao
//                                                                             : ""
//                                                                     }
//                                                                     rightAddon={
//                                                                         watch(
//                                                                             "preenchimento." +
//                                                                                 campo.codigo
//                                                                         ) && (
//                                                                             <Link
//                                                                                 href={watch(
//                                                                                     "preenchimento." +
//                                                                                         campo.codigo
//                                                                                 )}
//                                                                                 target="_parent"
//                                                                             >
//                                                                                 <Button
//                                                                                     size="sm"
//                                                                                     variant="ghost"
//                                                                                     colorScheme="blue"
//                                                                                     leftIcon={
//                                                                                         <Icon
//                                                                                             as={
//                                                                                                 FiEye
//                                                                                             }
//                                                                                         />
//                                                                                     }
//                                                                                     px={
//                                                                                         6
//                                                                                     }
//                                                                                 >
//                                                                                     Visualizar
//                                                                                 </Button>
//                                                                             </Link>
//                                                                         )
//                                                                     }
//                                                                 />
//                                                             </Flex>
//                                                         ) : campo.tipoCampo ==
//                                                           "file" ? (
//                                                             <Flex align="center">
//                                                                 <Previews
//                                                                     nome={
//                                                                         campo.nome
//                                                                     }
//                                                                     codigo={
//                                                                         campo.codigo
//                                                                     }
//                                                                     id={
//                                                                         ficha.id
//                                                                     }
//                                                                     data={watch(
//                                                                         "preenchimento." +
//                                                                             campo.codigo
//                                                                     )}
//                                                                 />
//                                                                 {/* <FormInput
//                                                                     size="sm"
//                                                                     type="file"
//                                                                     label={
//                                                                         campo.nome
//                                                                     }
//                                                                     {...register(
//                                                                         "arquivos." +
//                                                                             campo.codigo,
//                                                                         {
//                                                                             required:
//                                                                                 {
//                                                                                     value:
//                                                                                         modelo
//                                                                                             .campos[
//                                                                                             campo
//                                                                                                 .codigo
//                                                                                         ]
//                                                                                             ?.obrigatorio &&
//                                                                                         !watch(
//                                                                                             "preenchimento." +
//                                                                                                 campo.codigo
//                                                                                         )
//                                                                                             ? true
//                                                                                             : false,
//                                                                                     message:
//                                                                                         "Campo obrigatório",
//                                                                                 },
//                                                                         }
//                                                                     )}
//                                                                     borderColor={
//                                                                         watch(
//                                                                             "analise." +
//                                                                                 campo.codigo
//                                                                         )
//                                                                             ?.aprovado
//                                                                             ? "green"
//                                                                             : ""
//                                                                     }
//                                                                     borderWidth={
//                                                                         watch(
//                                                                             "analise." +
//                                                                                 campo.codigo
//                                                                         )
//                                                                             ?.aprovado
//                                                                             ? 2
//                                                                             : ""
//                                                                     }
//                                                                     onChange={() =>
//                                                                         handleSubmit(
//                                                                             onSubmit
//                                                                         )
//                                                                     }
//                                                                     error={
//                                                                         errors.arquivos &&
//                                                                         errors
//                                                                             .arquivos[
//                                                                             campo
//                                                                                 .codigo
//                                                                         ]
//                                                                             ?.message
//                                                                             ? errors
//                                                                                   .arquivos[
//                                                                                   campo
//                                                                                       .codigo
//                                                                               ]
//                                                                                   ?.message
//                                                                             : watch(
//                                                                                   "analise." +
//                                                                                       campo.codigo
//                                                                               )
//                                                                                   ?.motivoReprovacao
//                                                                             ? "Campo reprovado: " +
//                                                                               watch(
//                                                                                   "analise." +
//                                                                                       campo.codigo
//                                                                               )
//                                                                                   ?.motivoReprovacao
//                                                                             : ""
//                                                                     }
//                                                                     rightAddon={
//                                                                         watch(
//                                                                             "preenchimento." +
//                                                                                 campo.codigo
//                                                                         ) && (
//                                                                             <Link
//                                                                                 href={watch(
//                                                                                     "preenchimento." +
//                                                                                         campo.codigo
//                                                                                 )}
//                                                                                 target="_parent"
//                                                                             >
//                                                                                 <Button
//                                                                                     size="sm"
//                                                                                     variant="ghost"
//                                                                                     colorScheme="blue"
//                                                                                     leftIcon={
//                                                                                         <Icon
//                                                                                             as={
//                                                                                                 FiEye
//                                                                                             }
//                                                                                         />
//                                                                                     }
//                                                                                     px={
//                                                                                         6
//                                                                                     }
//                                                                                 >
//                                                                                     Visualizar
//                                                                                 </Button>
//                                                                             </Link>
//                                                                         )
//                                                                     }
//                                                                 /> */}
//                                                             </Flex>
//                                                         ) : campo.tipoCampo ==
//                                                           "files" ? (
//                                                             <FormInput
//                                                                 size="sm"
//                                                                 type="file"
//                                                                 multiple="multiple"
//                                                                 label={
//                                                                     campo.nome
//                                                                 }
//                                                                 {...register(
//                                                                     "arquivos." +
//                                                                         campo.codigo,
//                                                                     {
//                                                                         required:
//                                                                             {
//                                                                                 value: modelo
//                                                                                     .campos[
//                                                                                     campo
//                                                                                         .codigo
//                                                                                 ]
//                                                                                     ?.obrigatorio,
//                                                                                 message:
//                                                                                     "Campo obrigatório",
//                                                                             },
//                                                                     }
//                                                                 )}
//                                                             />
//                                                         ) : (
//                                                             ""
//                                                         )}
//                                                     </GridItem>
//                                                 ))}
//                                         </Grid>
//                                     </Box>
//                                 ))}
//                             <GridItem
//                                 bg="white"
//                                 p={4}
// //                                 // hidden={activeStep != campos.filter((i) =>
//                                     i.campos.find(
//                                         (e) => modelo?.campos[e.codigo]?.exibir
//                                     )
//                                 ).length}
//                             >
//                                 Resumo
//                                 <Box
//                                     colSpan={{ base: 1, lg: 5 }}
//                                     p={4}
//                                     bg="white"
//                                     mt={4}
//                                 >
//                                     <Box
//                                         dangerouslySetInnerHTML={{
//                                             __html: modelo.instrucoes,
//                                         }}
//                                     />
//                                 </Box>
//                                 <Flex mt={4} p={4} bg="white" flexDir="column">
//                                     {modelo.checkbox?.map((item, key) => (
//                                         <Checkbox
//                                             key={item.id}
//                                             {...register("checkbox_" + key, {
//                                                 required: {
//                                                     message:
//                                                         "Você deve aceitar para prosseguir",
//                                                     value: true,
//                                                 },
//                                             })}
//                                             isInvalid={
//                                                 errors[`checkbox_${key}`]
//                                                     ?.message
//                                             }
//                                         >
//                                             {item}{" "}
//                                             {errors[`checkbox_${key}`]
//                                                 ?.message && (
//                                                 <Tag colorScheme="red">
//                                                     Você deve aceitar os termos
//                                                     para prosseguir
//                                                 </Tag>
//                                             )}
//                                         </Checkbox>
//                                     ))}
//                                 </Flex>
//                             </GridItem>
//                         </Grid>
//                         <Flex py={4} justify="space-between">
//                             {/* <Button
//                                 isDisabled={activeStep == 0}
//                                 size="sm"
//                                 colorScheme="blue"
//                                 type="button"
//                                 isLoading={isSubmitting}
//                                 leftIcon={<BsArrowLeft />}
//                                 onClick={() => setActiveStep(activeStep - 1)}
//                             >
//                                 Voltar
//                             </Button>
//                             <Button
//                                 size="sm"
//                                 colorScheme="blue"
//                                 type="button"
//                                 isLoading={isSubmitting}
//                                 rightIcon={<BsArrowRight />}
//                                 onClick={() => setActiveStep(activeStep + 1)}
//                             >
//                                 Avançar
//                             </Button> */}
//                             {(ficha.status == "reprovada" ||
//                                 ficha.status == "aguardando") && (
//                                 <Button
//                                     size="sm"
//                                     colorScheme="blue"
//                                     type="submit"
//                                     isLoading={isSubmitting}
//                                     rightIcon={<BiSave />}
//                                 >
//                                     Salvar
//                                 </Button>
//                             )}
//                         </Flex>
//                     </Box>
//                 </Flex>
//             </Container>
//         </Box>
//     );
// };

// export default FichaCadastral;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//     const { id } = ctx.query;
//     let ficha = await prisma.fichaCadastral.findUnique({
//         where: { id },
//         include: {
//             imobiliaria: true,
//             modelo: true,
//             preenchimento: {
//                 include: {
//                     campo: true,
//                 },
//             },
//             imovel: true,
//             Processo: true,
//         },
//     });
//     if (ficha?.deletedAt) {
//         return {
//             props: {
//                 notFound: true,
//             },
//         };
//     }
//     const modelo = await prisma.modeloFichaCadastral.findUnique({
//         where: {
//             id: ficha?.modeloFichaCadastralId,
//         },
//     });
//     const campos = await prisma.categoriaCampoFichaCadastral.findMany({
//         where: {
//             campos: {
//                 some: {
//                     tipoFicha: ficha?.modelo.tipo,
//                     deletedAt: null,
//                 },
//             },
//             deletedAt: null,
//         },
//         orderBy: {
//             ordem: "asc",
//         },
//         include: {
//             campos: {
//                 where: {
//                     tipoFicha: ficha?.modelo.tipo,
//                     deletedAt: null,
//                 },
//                 orderBy: {
//                     ordem: "asc",
//                 },
//                 include: {
//                     dependencia: true,
//                 },
//             },
//         },
//     });
//     let newObj = {};
//     let newArq = {};
//     let analise = {};
//     ficha.preenchimento.map((item) => {
//         newObj[item.campoFichaCadastralCodigo] = item.valor;
//         analise[item.campoFichaCadastralCodigo] = {
//             aprovado: item.aprovado,
//             motivoReprovacao: item.motivoReprovacao,
//         };
//     });
//     ficha.preenchimento = newObj;
//     ficha.analise = analise;
//     return {
//         props: {
//             ficha: JSON.parse(JSON.stringify(ficha)),
//             modelo: JSON.parse(JSON.stringify(modelo)),
//             campos: JSON.parse(JSON.stringify(campos)),
//         },
//     };
// };
