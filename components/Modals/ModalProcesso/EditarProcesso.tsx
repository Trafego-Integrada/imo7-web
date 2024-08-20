import { FormInput } from "@/components/Form/FormInput";
import { FormInputCurrency } from "@/components/Form/FormInputCurrency";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { useAuth } from "@/hooks/useAuth";
import { imo7ApiService } from "@/services/apiServiceUsage";
import { listarUsuarios } from "@/services/models/usuario";
import {
    Box,
    Button,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Text,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { MdClose, MdSave } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { FichasCadastrais } from "./Fichas";
import { queryClient } from "@/services/queryClient";
import { formatoValor } from "@/helpers/helpers";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Documentos } from "../Contrato/Documentos";
import { Historicos } from "@/components/Pages/Historicos";
import { ModalImovel } from "../ModalImovel";
import { buscarImovel } from "@/services/models/imovel";

const schema = yup.object({
    tipoProcesso: yup.string().required("Campo obrigatório"),
    responsavelId: yup.string().required("Campo obrigatório"),
    imovelId: yup.string().required("Campo obrigatório"),
    condicoesGerais: yup.string(),
    inicioContrato: yup.date().nullable(),
    prazoContrato: yup.string().max(90, 'Limite 90 caracteres').nullable(),
    comissao: yup.string().max(45, 'Limite 45 caracteres').nullable()
});
export const EditarProcesso = ({ id, isOpen, onClose }) => {
    const { usuario } = useAuth();
    const toast = useToast();
    const [query, setQuery] = useState('');
    const modalImovel = useRef();
    const {
        control,
        reset,
        watch,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const buscar = useMutation(imo7ApiService("processo").get, {
        onSuccess(data, variables, context) {
            reset({ ...data });
        },
    });
    const atualizar = useMutation(imo7ApiService("processo").update);
    const onSubmit = async ({ fichas, imovel, responsavel, ...data }) => {
        try {
            await atualizar.mutateAsync({ ...data });
            queryClient.invalidateQueries(["processos"]);
            onClose();
        } catch (error) { }
    };

    const { data: imoveis } = useQuery(
        ["imoveis", { noIncludes: true, query, imovelId: watch('imovelId') }],
        imo7ApiService("imovel").list,
    );
    const campos = [
        {
            nome: "valor",
            label: "Valor Negociado",
        },
    ];

    const { data: usuarios } = useQuery(
        ["listaUsuarios", { admImobiliaria: true }],
        listarUsuarios,
        { refetchOnReconnect: false, refetchOnWindowFocus: false }
    );

    useEffect(() => {
        reset({});
    }, []);
    const { fields, append, remove } = useFieldArray({
        control,
        name: "fichas",
    });

    useEffect(() => {
        reset({});
        buscar.mutate(id);
    }, [id]);

    const onCallbackImovel = async (imovelId) => {
        await queryClient.invalidateQueries(["imoveis"]);
        reset({ ...watch(), imovelId });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Processo Nº {watch("codigo")} <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Tabs size="sm">
                        <TabList>
                            <Tab>Dados do Processo</Tab>
                            <Tab>
                                Fichas{" "}
                                <Tag ml={2} size="sm" colorScheme="blue">
                                    {watch("_count.fichas")}
                                </Tag>
                            </Tab>
                            <Tab>
                                Anexos{" "}
                                <Tag colorScheme="blue" size="sm" ml={1}>
                                    {watch("_count.Anexo")}
                                </Tag>
                            </Tab>
                            <Tab>Históricos</Tab>
                            {/* <Tab>
                                Consultas{" "}
                                <Tag colorScheme="blue" size="sm" ml={1}>
                                    {watch("_count.ConsultaNetrin")}
                                </Tag>
                            </Tab> */}
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Flex
                                    as="form"
                                    id="formEditarProcesso"
                                    onSubmit={handleSubmit(onSubmit)}
                                    flexDir="column"
                                    gap={4}
                                >
                                    <Box>
                                        <Grid
                                            gridTemplateColumns={{
                                                lg: "repeat(2,1fr)",
                                            }}
                                            gap={4}
                                        >
                                            <GridItem colStart={{ lg: 1 }}>
                                                <FormSelect
                                                    size="sm"
                                                    label="Status do Processo"
                                                    placeholder="Selecione..."
                                                    {...register("status")}
                                                    error={
                                                        errors?.status?.message
                                                    }
                                                >
                                                    <option value="EM_ANDAMENTO">
                                                        Em andamento
                                                    </option>
                                                    <option value="EM_ANALISE">
                                                        Em análise
                                                    </option>
                                                    <option value="CANCELADO">
                                                        Cancelado
                                                    </option>
                                                    <option value="ARQUIVADO">
                                                        Arquivado
                                                    </option>
                                                    <option value="COMPLETO">
                                                        Completo
                                                    </option>
                                                    <option value="APROVADO">
                                                        Aprovado
                                                    </option>
                                                    <option value="REPROVADO">
                                                        Reprovado
                                                    </option>
                                                    <option value="LOCADO">
                                                        Locado
                                                    </option>
                                                    <option value="DESISTENTE">
                                                        Desistente
                                                    </option>
                                                    <option value="reprovado_por_analise_interna">
                                                        Reprovado por Analise Interna
                                                    </option>
                                                    <option value="renda_insuficiente">
                                                        Renda Insuficiente
                                                    </option>
                                                </FormSelect>
                                            </GridItem>
                                            <GridItem colStart={{ lg: 1 }}>
                                                <FormSelect
                                                    size="sm"
                                                    label="Tipo de Processo"
                                                    placeholder="Selecione..."
                                                    {...register(
                                                        "tipoProcesso"
                                                    )}
                                                    error={
                                                        errors?.tipoProcesso
                                                            ?.message
                                                    }
                                                >
                                                    <option value="LOCACAO">
                                                        Locação
                                                    </option>
                                                    <option value="VENDA">
                                                        Venda
                                                    </option>
                                                    <option value="COMPRA">
                                                        Compra
                                                    </option>
                                                </FormSelect>
                                            </GridItem>
                                            {watch("tipoProcesso") ==
                                                "LOCACAO" && (
                                                    <GridItem>
                                                        <FormSelect
                                                            size="sm"
                                                            placeholder="Selecione..."
                                                            label="Tipo de Garantia"
                                                            {...register(
                                                                "tipoGarantia"
                                                            )}
                                                            error={
                                                                errors?.tipoGarantia
                                                                    ?.message
                                                            }
                                                        >
                                                            <option value="NENHUMA">
                                                                Nenhuma
                                                            </option>
                                                            <option value="PAGA">
                                                                Garantia Paga
                                                            </option>
                                                            <option value="SEGURO">
                                                                Seguro Fiança
                                                            </option>
                                                            <option value="FIADOR">
                                                                Fiador
                                                            </option>
                                                            <option value="APOLICE">
                                                                Apolice
                                                            </option>
                                                            <option value="CAUCAO">
                                                                Caução
                                                            </option>
                                                            <option value="CREDPAGO">
                                                                CredPago
                                                            </option>
                                                        </FormSelect>
                                                    </GridItem>
                                                )}
                                            <GridItem colStart={{ lg: 1 }}>
                                                <Controller
                                                    control={control}
                                                    name="imovelId"
                                                    render={({ field }) => (
                                                        <FormMultiSelect
                                                            size="sm"
                                                            label="Imóvel"
                                                            options={
                                                                imoveis?.data
                                                                    ?.data
                                                            }
                                                            isClearable
                                                            formatOptionLabel={(
                                                                i
                                                            ) => (
                                                                <Box>
                                                                    <Text>
                                                                        <Text
                                                                            fontSize="xs"
                                                                            as="span"
                                                                            fontWeight="bold"
                                                                        >
                                                                            Código:
                                                                        </Text>{" "}
                                                                        {
                                                                            i.codigo
                                                                        }
                                                                        <Text
                                                                            as="span"
                                                                            fontSize="xs"
                                                                        >{` - ${i.endereco}, ${i.bairro},${i.cidade}`}</Text>
                                                                    </Text>
                                                                </Box>
                                                            )}
                                                            getOptionLabel={(
                                                                i
                                                            ) =>
                                                                `Codigo: ${i.codigo} -  ${i.endereco}, ${i.bairro},${i.cidade}`
                                                            }
                                                            getOptionValue={(
                                                                i
                                                            ) => i.id}
                                                            rightAddon={
                                                                <Box p={0}>
                                                                    <Tooltip
                                                                        label={
                                                                            watch(
                                                                                "imovelId"
                                                                            )
                                                                                ? "Editar imóvel"
                                                                                : "Cadastrar Imóvel"
                                                                        }
                                                                    >
                                                                        <IconButton
                                                                            rounded="none"
                                                                            colorScheme="blue"
                                                                            size="sm"
                                                                            icon={
                                                                                watch(
                                                                                    "imovelId"
                                                                                ) ? (
                                                                                    <FiEdit />
                                                                                ) : (
                                                                                    <FiPlus />
                                                                                )
                                                                            }
                                                                            onClick={() =>
                                                                                watch(
                                                                                    "imovelId"
                                                                                )
                                                                                    ? modalImovel.current.onOpen(
                                                                                        watch(
                                                                                            "imovelId"
                                                                                        )
                                                                                    )
                                                                                    : modalImovel.current.onOpen()
                                                                            }
                                                                        />
                                                                    </Tooltip>
                                                                </Box>
                                                            }
                                                            onChange={(e) => {
                                                                e?.target?.value && setQuery(e?.target?.value);
                                                                field.onChange(
                                                                    e?.id
                                                                        ? e.id
                                                                        : null
                                                                )
                                                            }
                                                            }
                                                            value={
                                                                field.value
                                                                    ? imoveis?.data?.data.find(
                                                                        (i) =>
                                                                            i.id ==
                                                                            field.value
                                                                    )
                                                                    : null
                                                            }
                                                            error={
                                                                errors?.imovelId
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem>
                                                <Controller
                                                    control={control}
                                                    name="responsavelId"
                                                    render={({ field }) => (
                                                        <FormMultiSelect
                                                            size="sm"
                                                            label="Responsável"
                                                            options={
                                                                usuarios &&
                                                                usuarios.data
                                                                    ?.data
                                                            }
                                                            getOptionLabel={(
                                                                e
                                                            ) => e.nome}
                                                            getOptionValue={(
                                                                e
                                                            ) => e.id}
                                                            placeholder="Selecione o responsável"
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    e.id
                                                                )
                                                            }
                                                            value={
                                                                field.value
                                                                    ? usuarios?.data?.data.find(
                                                                        (i) =>
                                                                            i.id ==
                                                                            field.value
                                                                    )
                                                                    : null
                                                            }
                                                            error={
                                                                errors
                                                                    ?.responsavelId
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem>
                                                <Controller
                                                    control={control}
                                                    name="inicioContrato"
                                                    render={({ field }) => (
                                                        <FormInput
                                                            type='date'
                                                            size="sm"
                                                            label="Início do Contrato"
                                                            {...field}
                                                            error={
                                                                errors
                                                                    ?.responsavelId
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem>
                                                <Controller
                                                    control={control}
                                                    name="prazoContrato"
                                                    render={({ field }) => (
                                                        <FormInput
                                                            size="sm"
                                                            label="Prazo do Contrato"
                                                            {...field}
                                                            error={
                                                                errors
                                                                    ?.responsavelId
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem>
                                                <Controller
                                                    control={control}
                                                    name="comissao"
                                                    render={({ field }) => (
                                                        <FormInput
                                                            size="sm"
                                                            label="Comissão"
                                                            {...field}
                                                            error={
                                                                errors
                                                                    ?.responsavelId
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                    {watch("imovelId") && (
                                        <Box>
                                            <Heading size="sm" color="gray.700">
                                                Cadastro do Imóvel
                                            </Heading>
                                            <Divider my={2} />{" "}
                                            <Grid
                                                gap={4}
                                                gridTemplateColumns={{
                                                    lg: "repeat(4,1fr)",
                                                }}
                                            >
                                                <GridItem>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray"
                                                    >
                                                        Valor de Venda
                                                    </Text>
                                                    <Text>
                                                        {formatoValor(
                                                            imoveis?.data?.data?.find(
                                                                (i) =>
                                                                    i.id ==
                                                                    watch(
                                                                        "imovelId"
                                                                    )
                                                            )?.valorVenda
                                                        )}
                                                    </Text>
                                                </GridItem>
                                                <GridItem>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray"
                                                    >
                                                        Valor de Locação
                                                    </Text>{" "}
                                                    <Text>
                                                        {formatoValor(
                                                            imoveis?.data?.data?.find(
                                                                (i) =>
                                                                    i.id ==
                                                                    watch(
                                                                        "imovelId"
                                                                    )
                                                            )?.valorAluguel
                                                        )}
                                                    </Text>
                                                </GridItem>
                                                <GridItem>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray"
                                                    >
                                                        Valor IPTU
                                                    </Text>{" "}
                                                    <Text>
                                                        {formatoValor(
                                                            imoveis?.data?.data?.find(
                                                                (i) =>
                                                                    i.id ==
                                                                    watch(
                                                                        "imovelId"
                                                                    )
                                                            )?.valorIPTU
                                                        )}
                                                    </Text>
                                                </GridItem>
                                                <GridItem>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray"
                                                    >
                                                        Valor Condominio
                                                    </Text>
                                                    <Text>
                                                        {formatoValor(
                                                            imoveis?.data?.data?.find(
                                                                (i) =>
                                                                    i.id ==
                                                                    watch(
                                                                        "imovelId"
                                                                    )
                                                            )?.valorCondominio
                                                        )}
                                                    </Text>
                                                </GridItem>
                                                <GridItem>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray"
                                                    >
                                                        Valor Seguro Incêndio
                                                    </Text>
                                                    <Text>
                                                        {formatoValor(
                                                            imoveis?.data?.data?.find(
                                                                (i) =>
                                                                    i.id ==
                                                                    watch(
                                                                        "imovelId"
                                                                    )
                                                            )?.valorSeguro
                                                        )}
                                                    </Text>
                                                </GridItem>
                                            </Grid>
                                        </Box>
                                    )}
                                    <Box>
                                        <Heading size="sm" color="gray.700">
                                            Condições
                                        </Heading>
                                        <Divider my={2} />
                                        <Grid
                                            gap={4}
                                            gridTemplateColumns={{
                                                lg: "repeat(2,1fr)",
                                            }}
                                        >
                                            {campos.map((item, key) => (
                                                <GridItem key={item.id}>
                                                    <Controller
                                                        control={control}
                                                        name={`campos[${key}].${item.nome}`}
                                                        render={({ field }) => (
                                                            <FormInputCurrency
                                                                size="sm"
                                                                label={
                                                                    item.label
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    v
                                                                ) =>
                                                                    field.onChange(
                                                                        v
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    <FormInput
                                                        size='sm'
                                                        label='Codições Gerais'
                                                        {...register('condicoesGerais')}
                                                    />
                                                </GridItem>
                                            ))}
                                        </Grid>
                                    </Box>
                                    <Box>
                                        <Grid gap={4}>
                                            <GridItem>
                                                <FormTextarea
                                                    size="sm"
                                                    {...register("observacoes")}
                                                    placeholder="Observações"
                                                />
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <FichasCadastrais
                                    processoId={id}
                                    imovelId={watch("imovelId")}
                                    responsavelId={watch("responsavelId")}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Documentos
                                    processoId={watch("id")}
                                    data={watch("anexos")}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Historicos
                                    tabela="Processo"
                                    tabelaId={watch("id")}
                                />
                            </TabPanel>
                            {/* <TabPanel>
                                <ConsultasNetrin processoId={watch("id")} />
                            </TabPanel> */}
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button
                        size="sm"
                        leftIcon={<MdClose />}
                        variant="ghost"
                        onClick={onClose}
                    >
                        Desistir
                    </Button>
                    <Button
                        type="submit"
                        form="formEditarProcesso"
                        size="sm"
                        leftIcon={<MdSave />}
                        colorScheme="blue"
                        isLoading={isSubmitting}
                    >
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
            <ModalImovel
                ref={modalImovel}
                callback={(data) => onCallbackImovel(data)}
            />
        </Modal>
    );
};
