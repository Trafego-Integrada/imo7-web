import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { listarCategoriaCampoFichas } from "@/services/models/categoriaCampoFicha";
import {
    atualizarFicha,
    buscarFicha,
    cadastrarFicha,
} from "@/services/models/fichaCadastral";
import { listarFichas } from "@/services/models/modeloFicha";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { AnaliseCampo } from "./AnaliseCampo";
const schema = yup.object({});
const ModalBase = ({}, ref) => {
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

    const { data: modelos } = useQuery(["modelosFichas"], listarFichas);
    const { data: campos } = useQuery(
        ["categoriasCampos"],
        listarCategoriaCampoFichas
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Ficha Cadastral</ModalHeader>
                <ModalBody
                    id="formFichaCadastral"
                    as="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Tabs>
                        <TabList>
                            <Tab>Geral</Tab>
                            {watch("id") && <Tab>Preenchimento</Tab>}
                        </TabList>
                        <TabPanels>
                            <TabPanel>
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
                            <TabPanel p={0}>
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
                                                        <Text fontSize="xs">
                                                            {i.nome}
                                                        </Text>

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
                                                                                ""
                                                                            }
                                                                            fichaId={
                                                                                ""
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
                        form="formFichaCadastral"
                    >
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const ModalFichaCadastral = forwardRef(ModalBase);
