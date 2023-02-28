import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { buscarEndereco } from "@/lib/buscarEndereco";
import { listarCategoriaCampoFichas } from "@/services/models/categoriaCampoFicha";
import {
    atualizarFicha,
    buscarFicha,
    cadastrarFicha,
} from "@/services/models/fichaCadastral";
import { listarImoveis } from "@/services/models/imovel";
import { listarFichas } from "@/services/models/modeloFicha";
import { listarUsuarios } from "@/services/models/usuario";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
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
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiDownload, FiEye } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { ModalPreview } from "../Preview";
import { AnaliseCampo } from "./AnaliseCampo";
const schema = yup.object({});
const ModalBase = ({}, ref) => {
    const [buscandoCep, setBuscandoCep] = useState(false);
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
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            documento: "",
            cepImovel: "",
            telefone: "",
        },
    });
    const buscar = useMutation(buscarFicha, {
        onSuccess: (data) => {
            reset({
                ...data,
                documento: data.documento ? data.documento : "",
                telefone: data.telefone ? data.telefone : "",
                cepImovel: data.cepImovel ? data.cepImovel : "",
            });
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
    const { data: usuarios } = useQuery(
        ["listaUsuarios", { admImobiliaria: true }],
        listarUsuarios
    );
    const { data: imoveis } = useQuery(["listarImoveis", {}], listarImoveis);

    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            setBuscandoCep(false);
            reset({ documento: "", cepImovel: "", telefone: "" });
            if (id) {
                buscar.mutateAsync(id);
                onOpen();
            } else {
                onOpen();
            }
        },
    }));

    const handleBuscarCep = async (cep) => {
        if (cep.length === 9) {
            setBuscandoCep(true);
            const res = await buscarEndereco(cep);
            reset({
                ...watch(),
                enderecoImovel: res.logradouro,
                bairroImovel: res.bairro,
                estadoImovel: res.uf,
                cidadeImovel: res.cidade,
            });
            setBuscandoCep(false);
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
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
                            {/* {watch("id") && <Tab>Revisão</Tab>} */}
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
                                            <Controller
                                                control={control}
                                                name="responsavel"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        label="Responsável"
                                                        options={
                                                            usuarios &&
                                                            usuarios.data?.data
                                                        }
                                                        getOptionLabel={(e) =>
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                        placeholder="Selecione o responsável"
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
                                                label="Nome"
                                                placeholder="nome"
                                                error={errors.nome?.message}
                                                {...register("nome")}
                                                descricao="Utilize este campo para te auxiliar a identificar a ficha"
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                mask={
                                                    watch("documento") &&
                                                    "999.999.999-99"
                                                }
                                                label="CPF"
                                                placeholder="CPF"
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
                                                mask={
                                                    watch("telefone") &&
                                                    "(99) 9 9999-9999"
                                                }
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
                                    <Box mt={4}>
                                        <Heading size="md">
                                            Associe um imóvel
                                        </Heading>
                                        <Text fontSize="sm" color="gray" mb={4}>
                                            Facilita a ligação e identificação
                                            da ficha com um imóvel
                                        </Text>
                                        <Grid
                                            gridTemplateColumns={{
                                                base: "repeat(1, 1fr)",
                                                lg: "repeat(5, 1fr)",
                                            }}
                                            gap={4}
                                        >
                                            <GridItem
                                                colSpan={{ base: 1, lg: 5 }}
                                            >
                                                <Controller
                                                    control={control}
                                                    name="imovel"
                                                    render={({ field }) => (
                                                        <FormMultiSelect
                                                            {...field}
                                                            label="Imóvel"
                                                            options={
                                                                imoveis &&
                                                                imoveis.data
                                                                    ?.data
                                                            }
                                                            getOptionLabel={(
                                                                e
                                                            ) =>
                                                                `${e.codigo} - ${e.endereco}, ${e.bairro}, ${e.cidade}/${e.estado}`
                                                            }
                                                            getOptionValue={(
                                                                e
                                                            ) => e.id}
                                                            placeholder="Selecione o imóvel"
                                                            isClearable={true}
                                                        />
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem
                                                colSpan={{ base: 1, lg: 5 }}
                                            >
                                                ou
                                            </GridItem>
                                            <GridItem
                                                colStart={{ base: 1, lg: 1 }}
                                            >
                                                <FormInput
                                                    label="Código do Imóvel"
                                                    placeholder="Digite o código"
                                                    {...register(
                                                        "codigoImovel"
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem
                                                as={Flex}
                                                colStart={{ base: 1, lg: 1 }}
                                                colSpan={{ base: 1, lg: 1 }}
                                            >
                                                <FormInput
                                                    mask={
                                                        watch("cepImovel") &&
                                                        "99999-999"
                                                    }
                                                    label="CEP do Imóvel"
                                                    placeholder="Digite o cep"
                                                    {...register("cepImovel", {
                                                        onChange: (e) => {
                                                            handleBuscarCep(
                                                                e.target.value
                                                            );
                                                        },
                                                    })}
                                                />
                                                {buscandoCep && <Spinner />}
                                            </GridItem>
                                            <GridItem
                                                colStart={{ base: 1, lg: 1 }}
                                                colSpan={{ base: 1, lg: 4 }}
                                            >
                                                <FormInput
                                                    label="Endereço do Imóvel"
                                                    placeholder="Digite o endereço"
                                                    {...register(
                                                        "enderecoImovel"
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem
                                                colSpan={{ base: 1, lg: 1 }}
                                            >
                                                <FormInput
                                                    label="Número do Imóvel"
                                                    placeholder="Digite o Número"
                                                    {...register(
                                                        "numeroImovel"
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem
                                                colSpan={{ base: 1, lg: 2 }}
                                            >
                                                <FormInput
                                                    label="Complemento do Imóvel"
                                                    placeholder="Digite o Complemento"
                                                    {...register(
                                                        "complementoImovel"
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem
                                                colSpan={{ base: 1, lg: 1 }}
                                            >
                                                <FormInput
                                                    label="Bairro do Imóvel"
                                                    placeholder="Digite o bairro"
                                                    {...register(
                                                        "bairroImovel"
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem
                                                colSpan={{ base: 1, lg: 1 }}
                                            >
                                                <FormInput
                                                    label="Cidade do Imóvel"
                                                    placeholder="Digite o endereço"
                                                    {...register(
                                                        "cidadeImovel"
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem
                                                colSpan={{ base: 1, lg: 1 }}
                                            >
                                                <FormInput
                                                    label="Estado do Imóvel"
                                                    placeholder="Digite o estado"
                                                    {...register(
                                                        "estadoImovel"
                                                    )}
                                                />
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                </Box>
                            </TabPanel>
                            {/* <TabPanel px={0}>
                                <Box bg="white" p={4} rounded="lg">
                                    <Grid gap={4}>
                                        {campos?.data
                                            ?.filter((i) => i.campos.length)
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
                                                                            }
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
                            </TabPanel> */}
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
            <ModalPreview ref={preview} />
        </Modal>
    );
};

export const ModalFichaCadastral = forwardRef(ModalBase);
