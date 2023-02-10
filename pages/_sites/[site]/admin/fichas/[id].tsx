import { Layout } from "@/components/Layout/layout";
import {
    atualizarFicha,
    buscarFicha,
    cadastrarFicha,
} from "@/services/models/fichaCadastral";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Text,
    toast,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { listarFichas } from "@/services/models/modeloFicha";
import { listarCategoriaCampoFichas } from "@/services/models/categoriaCampoFicha";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import Link from "next/link";
import { AnaliseCampo } from "@/components/Modals/ModalFichaCadastral/AnaliseCampo";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import prisma from "@/lib/prisma";
const schema = yup.object({});
const Ficha = ({ ficha }) => {
    const router = useRouter();
    const toast = useToast();
    const {
        register,
        control,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema), defaultValues: { ...ficha } });
    const buscar = useMutation(buscarFicha, {
        onSuccess: (data) => {
            reset(data);
        },
    });
    const atualizar = useMutation(atualizarFicha);
    const onSubmit = async (data) => {
        try {
            if (data.id) {
                await atualizar.mutateAsync(data);
                onClose();
                toast({ title: "Ficha atualizada", status: "success" });
                queryClient.invalidateQueries(["fichas"]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const { data: modelos } = useQuery(["modelosFichas"], listarFichas);
    const { data: campos } = useQuery(
        ["categoriasCampos"],
        listarCategoriaCampoFichas
    );

    return (
        <Layout>
            <Box
                id="formFichaCadastral"
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                p={6}
            >
                <Flex gridGap={4} justify="flex-end" gap={4}>
                    <Button onClick={() => router.back()}>Voltar</Button>
                    <Button
                        colorScheme="blue"
                        variant="solid"
                        isLoading={isSubmitting}
                        type="submit"
                        form="formFichaCadastral"
                    >
                        Salvar
                    </Button>
                </Flex>
                <Tabs>
                    <TabList>
                        <Tab>Geral</Tab>
                        {watch("id") && <Tab>Preenchimento</Tab>}
                    </TabList>
                    <TabPanels>
                        <TabPanel px={0}>
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
                                                        errors.modelo?.message
                                                    }
                                                    getOptionLabel={(e) =>
                                                        `${e.tipo} - ${e.nome}`
                                                    }
                                                    getOptionValue={(e) => e.id}
                                                />
                                            )}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            label="Descrição"
                                            placeholder="Descrição"
                                            error={errors.descricao?.message}
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
                                            error={errors.documento?.message}
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
                                        <GridItem colSpan={{ lg: 2 }}>
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
                        <TabPanel px={0}>
                            <Box bg="white" p={4} rounded="lg">
                                <Grid gap={4}>
                                    {campos?.data?.map((item) => (
                                        <Box key={item.id} bg="gray.100" p={4}>
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
                                                {item?.campos?.map((i) => (
                                                    <GridItem
                                                        key={i.id}
                                                        colSpan={i.colSpan}
                                                    >
                                                        <Flex
                                                            align="center"
                                                            gap={2}
                                                        >
                                                            <Text fontSize="xs">
                                                                {i.nome}
                                                            </Text>
                                                            {watch(
                                                                "preenchimento"
                                                            )?.find(
                                                                (p) =>
                                                                    p.campoFichaCadastralCodigo ==
                                                                    i.codigo
                                                            )?.aprovado ? (
                                                                <Tag
                                                                    colorScheme="green"
                                                                    size="sm"
                                                                >
                                                                    Aprovado
                                                                </Tag>
                                                            ) : watch(
                                                                  "preenchimento"
                                                              )?.find(
                                                                  (p) =>
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
                                                            "file" ? (
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
                                                                        )?.valor
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
                                                                    <Text>
                                                                        Visualizar
                                                                        arquivo
                                                                    </Text>
                                                                </Link>
                                                            ) : (
                                                                <>
                                                                    <Flex
                                                                        align="center"
                                                                        gap={2}
                                                                    >
                                                                        {
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
                                                                        <AnaliseCampo
                                                                            campoCodigo={
                                                                                i.codigo
                                                                            }
                                                                            fichaId={
                                                                                ficha.id
                                                                            }
                                                                            buscarFicha={
                                                                                buscar
                                                                            }
                                                                        />
                                                                    </Flex>
                                                                </>
                                                            )}
                                                        </Text>
                                                    </GridItem>
                                                ))}
                                            </Grid>
                                        </Box>
                                    ))}
                                </Grid>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Layout>
    );
};

export default Ficha;

export const getServerSideProps = async (ctx) => {
    const { id } = ctx.query;

    const ficha = await prisma.fichaCadastral.findUnique({
        where: {
            id,
        },
        include: {
            modelo: true,
            preenchimento: {
                include: {
                    campo: true,
                },
            },
        },
    });

    return {
        props: {
            ficha: JSON.parse(JSON.stringify(ficha)),
        },
    };
};
