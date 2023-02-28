import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import prisma from "@/lib/prisma";
import {
    atualizarAnexosFicha,
    atualizarFicha,
} from "@/services/models/fichaCadastral";
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
    Grid,
    GridItem,
    Heading,
    Icon,
    Image,
    Tag,
    Text,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye } from "react-icons/fi";
import { useMutation } from "react-query";
import * as yup from "yup";
import "react-quill/dist/quill.snow.css";
import { buscarEndereco } from "@/lib/buscarEndereco";
const FichaCadastral = ({ ficha, campos, modelo }) => {
    console.log(modelo);
    const [schema, setSchema] = useState({});
    const toast = useToast();
    const {
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
    const atualizarAnexos = useMutation(atualizarAnexosFicha);
    const onSubmit = async (data) => {
        try {
            console.log(data);
            await atualizar.mutateAsync(data);

            const formData = new FormData();
            await Promise.all(
                Object.entries(data.arquivos).map((item) => {
                    var files = item[1].length;
                    for (var x = 0; x < files; x++) {
                        formData.append(item[0], item[1][x]);
                    }
                })
            );
            await atualizarAnexos.mutateAsync({ id: data.id, formData });
            toast({ title: "Ficha salva", status: "success" });
        } catch (e) {
            toast({ title: "Houve um problema", status: "error" });
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
    return (
        <Box
            bg="gray.100"
            minH="100vh"
            as="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container maxW="container.lg">
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
                            {ficha.imobiliaria.endereco},
                            {ficha.imobiliaria.bairro},
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

                {ficha.imovel ? (
                    <Box p={4} bg="white">
                        <Text>
                            Ficha referente ao imóvel: {ficha.imovel?.codigo} -{" "}
                            {ficha.imovel?.endereco}, {ficha.imovel?.bairro},{" "}
                            {ficha.imovel?.cidade}/{ficha.imovel?.estado}
                        </Text>
                    </Box>
                ) : ficha.codigoImovel ? (
                    <Box p={4} bg="white">
                        <Text>
                            Ficha referente ao imóvel: {ficha.codigoImovel} -{" "}
                            {ficha.enderecoImovel} nº {ficha.numeroImovel}{" "}
                            {ficha.complementoImovel &&
                                `(${ficha.complementoImovel})`}
                            , {ficha.bairroImovel}, {ficha.cidadeImovel}/
                            {ficha.estadoImovel}
                        </Text>
                    </Box>
                ) : (
                    ""
                )}
                <Grid gap={4}>
                    {campos
                        .filter((i) =>
                            i.campos.find(
                                (e) => modelo?.campos[e.codigo]?.exibir
                            )
                        )
                        .map((item) => (
                            <Box key={item.id} bg="white" p={4}>
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
                                        .filter((i) => modelo.campos[i.codigo])
                                        .map((campo) => (
                                            <GridItem
                                                key={campo.id}
                                                colSpan={{ lg: campo.colSpan }}
                                            >
                                                {campo.tipoCampo == "text" ? (
                                                    <FormInput
                                                        size="sm"
                                                        label={campo.nome}
                                                        mask={campo.mask}
                                                        {...register(
                                                            "preenchimento." +
                                                                campo.codigo,
                                                            {
                                                                required: {
                                                                    value: modelo
                                                                        .campos[
                                                                        campo
                                                                            .codigo
                                                                    ]
                                                                        ?.obrigatorio,
                                                                    message:
                                                                        "Campo obrigatório",
                                                                },
                                                                onChange: (
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
                                                                campo.codigo
                                                            ]?.message
                                                                ? errors
                                                                      .preenchimento[
                                                                      campo
                                                                          .codigo
                                                                  ]?.message
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
                                                  "date" ? (
                                                    <FormInput
                                                        size="sm"
                                                        type="date"
                                                        label={campo.nome}
                                                        {...register(
                                                            "preenchimento." +
                                                                campo.codigo,
                                                            {
                                                                required: {
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
                                                                campo.codigo
                                                            ]?.message
                                                                ? errors
                                                                      .preenchimento[
                                                                      campo
                                                                          .codigo
                                                                  ]?.message
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
                                                  "file" ? (
                                                    <Flex align="center">
                                                        <FormInput
                                                            size="sm"
                                                            type="file"
                                                            label={campo.nome}
                                                            {...register(
                                                                "arquivos." +
                                                                    campo.codigo,
                                                                {
                                                                    required: {
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
                                                                errors.arquivos &&
                                                                errors.arquivos[
                                                                    campo.codigo
                                                                ]?.message
                                                                    ? errors
                                                                          .arquivos[
                                                                          campo
                                                                              .codigo
                                                                      ]?.message
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
                                                        label={campo.nome}
                                                        {...register(
                                                            "arquivos." +
                                                                campo.codigo,
                                                            {
                                                                required: {
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
                </Grid>
                <Box colSpan={{ base: 1, lg: 5 }} p={4} bg="white" mt={4}>
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
                            isInvalid={errors[`checkbox_${key}`]?.message}
                        >
                            {item}{" "}
                            {errors[`checkbox_${key}`]?.message && (
                                <Tag colorScheme="red">
                                    Você deve aceitar os termos para prosseguir
                                </Tag>
                            )}
                        </Checkbox>
                    ))}
                </Flex>
                <Flex py={4} justify="flex-end">
                    {(ficha.status == "reprovada" ||
                        ficha.status == "aguardando") && (
                        <Button
                            colorScheme="blue"
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Salvar
                        </Button>
                    )}
                </Flex>
            </Container>
        </Box>
    );
};

export default FichaCadastral;

export const getServerSideProps = async (ctx) => {
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
        },
    });
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
                },
            },
        },
        orderBy: {
            ordem: "asc",
        },
        include: {
            campos: {
                where: {
                    tipoFicha: ficha?.modelo.tipo,
                },
                orderBy: {
                    ordem: "asc",
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
