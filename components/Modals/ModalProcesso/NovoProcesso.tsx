import { FormInput } from "@/components/Form/FormInput";
import { FormInputCurrency } from "@/components/Form/FormInputCurrency";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { useAuth } from "@/hooks/useAuth";
import { imo7ApiService } from "@/services/apiServiceUsage";
import { listarFichas } from "@/services/models/modeloFicha";
import { listarUsuarios } from "@/services/models/usuario";
import { queryClient } from "@/services/queryClient";
import {
    Alert,
    AlertIcon,
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
    Text,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { MdClose, MdSave } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { ModalImovel } from "../ModalImovel";
import { formatoValor } from "@/helpers/helpers";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
    tipoProcesso: yup.string().required("Campo obrigatório"),
    responsavelId: yup.string().required("Campo obrigatório"),
    imovelId: yup.string().required("Campo obrigatório"),
    tipoGarantia: yup.string().when("tipoProcesso", {
        is: (v) => v === "VENDA",
        then: yup.string().required("Campo obrigatório"),
        otherwise: yup.string().nullable(),
    }),
    fichas: yup
        .array()
        .of(
            yup.object({
                modelo: yup.object().nullable().required("Campo obrigatório"),
                nome: yup.string().nullable().required("Campo obrigatório"),
            })
        )
        .min(1, "Deve ter no mínimo uma ficha")
        .required("Campo obrigatório"),
});

export const NovoProcesso = ({ isOpen, onClose, callback }) => {
    const [filtroImovel, setFiltroImovel] = useState("");
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

    const cadastrar = useMutation(imo7ApiService("processo").create);
    const onSubmit = async (data) => {
        try {
            await cadastrar.mutateAsync(data, {
                onSuccess(data, variables, context) {
                    callback(data.id);
                },
            });
            queryClient.invalidateQueries(["processos"]);
            onClose();
        } catch (error) {}
    };

    const { data: imoveis } = useQuery(
        ["imoveis", { linhas: 20, query: filtroImovel }],
        imo7ApiService("imovel").list,
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    const campos = [
        {
            nome: "valor",
            label: "Valor Negociado",
        },
    ];
    const { data: modelos } = useQuery(["modelosFichas"], listarFichas, {
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    const { data: usuarios } = useQuery(
        ["listaUsuarios", { admImobiliaria: true, status: true }],
        listarUsuarios,
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    useEffect(() => {
        reset();
    }, []);
    const { fields, append, remove } = useFieldArray({
        control,
        name: "fichas",
    });

    const onCallbackImovel = async (imovelId) => {
        await queryClient.invalidateQueries(["imoveis"]);
        reset({ ...watch(), imovelId });
    };
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="3xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Novo Processo <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Flex
                            as="form"
                            id="novoProcesso"
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
                                            label="Tipo de Processo"
                                            placeholder="Selecione..."
                                            {...register("tipoProcesso")}
                                            error={
                                                errors?.tipoProcesso?.message
                                            }
                                        >
                                            <option value="LOCACAO">
                                                Locação
                                            </option>
                                            <option value="VENDA">Venda</option>
                                            <option value="COMPRA">
                                                Compra
                                            </option>
                                        </FormSelect>
                                    </GridItem>
                                    {watch("tipoProcesso") == "LOCACAO" && (
                                        <GridItem>
                                            <FormSelect
                                                size="sm"
                                                placeholder="Selecione..."
                                                label="Tipo de Garantia"
                                                {...register("tipoGarantia")}
                                                error={
                                                    errors?.tipoGarantia
                                                        ?.message
                                                }
                                            >
                                                <option value="NENHUMA">
                                                    Nenhuma
                                                </option>
                                                <option value="PAGA">
                                                    Garatia Paga
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
                                                        imoveis?.data?.data
                                                    }
                                                    isClearable
                                                    formatOptionLabel={(i) => (
                                                        <Box>
                                                            <Text>
                                                                <Text
                                                                    fontSize="xs"
                                                                    as="span"
                                                                    fontWeight="bold"
                                                                >
                                                                    Código:
                                                                </Text>{" "}
                                                                {i.codigo}
                                                                <Text
                                                                    as="span"
                                                                    fontSize="xs"
                                                                >{` - ${i.endereco}, ${i.bairro},${i.cidade}`}</Text>
                                                            </Text>
                                                        </Box>
                                                    )}
                                                    getOptionLabel={(i) =>
                                                        `Codigo: ${i.codigo} -  ${i.endereco}, ${i.bairro},${i.cidade}`
                                                    }
                                                    getOptionValue={(i) => i.id}
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
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e?.id ? e.id : null
                                                        )
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
                                                        usuarios.data?.data
                                                    }
                                                    getOptionLabel={(e) =>
                                                        e.nome
                                                    }
                                                    getOptionValue={(e) => e.id}
                                                    placeholder="Selecione o responsável"
                                                    onChange={(e) =>
                                                        field.onChange(e.id)
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
                                                        errors?.responsavelId
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
                                            <Text fontSize="xs" color="gray">
                                                Valor de Venda
                                            </Text>
                                            <Text>
                                                {formatoValor(
                                                    imoveis?.data?.data?.find(
                                                        (i) =>
                                                            i.id ==
                                                            watch("imovelId")
                                                    )?.valorVenda
                                                )}
                                            </Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text fontSize="xs" color="gray">
                                                Valor de Locação
                                            </Text>{" "}
                                            <Text>
                                                {formatoValor(
                                                    imoveis?.data?.data?.find(
                                                        (i) =>
                                                            i.id ==
                                                            watch("imovelId")
                                                    )?.valorAluguel
                                                )}
                                            </Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text fontSize="xs" color="gray">
                                                Valor IPTU
                                            </Text>{" "}
                                            <Text>
                                                {formatoValor(
                                                    imoveis?.data?.data?.find(
                                                        (i) =>
                                                            i.id ==
                                                            watch("imovelId")
                                                    )?.valorIPTU
                                                )}
                                            </Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text fontSize="xs" color="gray">
                                                Valor Condominio
                                            </Text>
                                            <Text>
                                                {formatoValor(
                                                    imoveis?.data?.data?.find(
                                                        (i) =>
                                                            i.id ==
                                                            watch("imovelId")
                                                    )?.valorCondominio
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
                                        <GridItem key={item.nome}>
                                            <Controller
                                                control={control}
                                                name={`campos[${key}].${item.nome}`}
                                                render={({ field }) => (
                                                    <FormInputCurrency
                                                        size="sm"
                                                        label={item.label}
                                                        value={field.value}
                                                        onValueChange={(v) =>
                                                            field.onChange(v)
                                                        }
                                                    />
                                                )}
                                            />
                                        </GridItem>
                                    ))}
                                </Grid>
                            </Box>
                            <Box>
                                <Flex align="center" justify="space-between">
                                    <Heading size="sm" color="gray.700">
                                        Fichas Cadastrais
                                    </Heading>
                                    <Tooltip label="Adicionar ficha">
                                        <Button
                                            leftIcon={<FiPlus />}
                                            colorScheme="blue"
                                            rounded="full"
                                            size="xs"
                                            icon={<FiPlus />}
                                            onClick={() => append()}
                                            variant="outline"
                                        >
                                            Adicionar Ficha
                                        </Button>
                                    </Tooltip>
                                </Flex>{" "}
                                {errors?.fichas?.message && (
                                    <Alert
                                        rounded="full"
                                        my={2}
                                        status="warning"
                                    >
                                        <AlertIcon />
                                        {errors?.fichas?.message}
                                    </Alert>
                                )}
                                <Divider my={2} />
                                <Grid gap={4}>
                                    {fields.map((f, k) => (
                                        <Flex key={f.id} gap={1}>
                                            <Controller
                                                control={control}
                                                name={`fichas[${k}].modelo`}
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        size="sm"
                                                        options={modelos?.data}
                                                        placeholder="Modelo da Ficha..."
                                                        error={
                                                            errors?.fichas &&
                                                            errors?.fichas[k]
                                                                ?.modelo
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
                                            <FormInput
                                                size="sm"
                                                placeholder="Digite o nome..."
                                                {...register(
                                                    `fichas[${k}].nome`
                                                )}
                                                error={
                                                    errors?.fichas &&
                                                    errors?.fichas[k]?.nome
                                                        ?.message
                                                }
                                            />
                                            <IconButton
                                                size="sm"
                                                icon={<FiTrash />}
                                                onClick={() => remove(k)}
                                            />
                                        </Flex>
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
                            form="novoProcesso"
                            size="sm"
                            leftIcon={<MdSave />}
                            colorScheme="blue"
                            isLoading={isSubmitting}
                        >
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <ModalImovel
                ref={modalImovel}
                callback={(data) => onCallbackImovel(data)}
            />
        </>
    );
};
