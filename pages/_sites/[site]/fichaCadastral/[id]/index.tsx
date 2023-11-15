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
    Image,
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
    useSteps,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiEye } from "react-icons/fi";
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
import { BiSave } from "react-icons/bi";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
const FichaCadastral = ({ ficha, campos, modelo }) => {
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

            const formData = new FormData();
            if (data.arquivos && Object.entries(data.arquivos).length) {
                const filesData = await Promise.all(
                    Object.entries(data.arquivos).map(async (item) => {
                        var files = item[1];
                        console.log("files", files, item[1]);

                        const filePromises = Array.from(files).map(
                            async (file) => {
                                console.log(file, file.name);
                                const base64String = await convertToBase64(
                                    file
                                );
                                const fileExtension = getFileExtension(
                                    file.name
                                );

                                return {
                                    nome: item[0],
                                    extensao: fileExtension,
                                    base64: base64String,
                                };
                            }
                        );

                        return Promise.all(filePromises);
                    })
                );

                // Flatten the array
                const flattenedFilesData = filesData.flat();

                // Now you have an array of objects with nome, extensao, and base64 properties
                console.log(flattenedFilesData);
                await atualizarAnexos.mutateAsync({
                    id: data.id,
                    formData: {
                        arquivos: flattenedFilesData,
                    },
                });
            }

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
        index: 1,
        count: campos.length,
    });
    console.log(campos);
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
                    py={6}
                    gap={6}
                    flexDir={{ base: "column", lg: "row" }}
                >
                    <Box>
                        <Image h={100} src={ficha.imobiliaria.logo} />
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
                <Box py={4}>
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
                    {ficha.Processo?.campos?.find((e) => e.valor)?.valor && (
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
                    )}
                    {ficha.imovel?.valorCondominio && (
                        <GridItem p={4} bg="white">
                            <Text fontSize="sm" color="gray">
                                Valor Condominio
                            </Text>
                            <Text>
                                {formatoValor(ficha.imovel?.valorCondominio)}
                            </Text>
                        </GridItem>
                    )}
                    {ficha.imovel?.valorIPTU && (
                        <GridItem p={4} bg="white">
                            <Text fontSize="sm" color="gray">
                                Valor IPTU
                            </Text>
                            <Text>{formatoValor(ficha.imovel?.valorIPTU)}</Text>
                        </GridItem>
                    )}
                </Grid>
                <Flex>
                    <Box w="2xl">
                        <Stepper
                            size="xs"
                            index={activeStep}
                            orientation="vertical"
                        >
                            {campos.map((step, index) => (
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
                            <Step onClick={() => setActiveStep(campos.length)}>
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
                    <Box>
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
                                    >
                                        <Heading size="sm" mb={6}>
                                            {item.nome}
                                        </Heading>
                                        <Grid
                                            gridTemplateColumns={{
                                                base: "repeat(1,1fr)",
                                                lg: "repeat(5,1fr)",
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
                                                .map((campo) => (
                                                    <GridItem
                                                        key={campo.id}
                                                        colSpan={{
                                                            lg: campo.colSpan,
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
                                                                <FormInput
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
                                                                />
                                                            </Flex>
                                                        ) : campo.tipoCampo ==
                                                          "file" ? (
                                                            <Flex align="center">
                                                                <FormInput
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
                                                                />
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
                                bg="white"
                                p={4}
                                hidden={activeStep != campos.length}
                            >
                                Resumo
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
                        </Grid>
                        <Flex py={4} justify="space-between">
                            <Button
                                isDisabled={activeStep == 0}
                                size="sm"
                                colorScheme="blue"
                                type="button"
                                isLoading={isSubmitting}
                                leftIcon={<BsArrowLeft />}
                                onClick={() => setActiveStep(activeStep - 1)}
                            >
                                Voltar
                            </Button>
                            <Button
                                size="sm"
                                colorScheme="blue"
                                type="button"
                                isLoading={isSubmitting}
                                rightIcon={<BsArrowRight />}
                                onClick={() => setActiveStep(activeStep + 1)}
                            >
                                Avançar
                            </Button>
                            {activeStep == campos.length &&
                                (ficha.status == "reprovada" ||
                                    ficha.status == "aguardando") && (
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        type="submit"
                                        isLoading={isSubmitting}
                                        rightIcon={<BiSave />}
                                    >
                                        Proximo
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
