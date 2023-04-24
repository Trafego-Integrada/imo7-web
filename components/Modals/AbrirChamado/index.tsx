import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { Input } from "@/components/Forms/Input";
import { Select } from "@/components/Forms/Select";
import { buscarEndereco } from "@/lib/buscarEndereco";
import { listarAssuntos } from "@/services/models/assunto";
import {
    atualizarChamado,
    buscarChamado,
    cadastrarChamado,
    iniciarConversaChamado,
} from "@/services/models/chamado";
import {
    listarContratos,
    listarParticipantesContratos,
} from "@/services/models/contrato";
import { listarDepartamentos } from "@/services/models/departamento";
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
    Spinner,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
const schema = yup.object({
    departamentoId: yup.string().required("Campo Obrigatório"),
    assuntoId: yup.string().required("Campo Obrigatório"),
    titulo: yup.string().required("Campo Obrigatório"),
});
const ModalBase = ({ callback }, ref) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast();
    const router = useRouter();
    const {
        setValue,
        register,
        control,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const buscar = useMutation(buscarChamado);
    const cadastrar = useMutation(cadastrarChamado);
    const atualizar = useMutation(atualizarChamado);
    const onSubmit = async (data) => {
        try {
            if (data.id) {
                const response = await atualizar.mutateAsync({
                    ...data,
                    contratoId: data.contrato?.id,
                });
                onClose();
                toast({ title: "Chamado atualizado", status: "success" });
                callback && callback();
            } else {
                const response = await cadastrar.mutateAsync({
                    ...data,
                    contratoId: data.contrato?.id,
                });
                onClose();
                toast({ title: "Chamado aberto", status: "success" });
            }
            queryClient.invalidateQueries(["chamados"]);
        } catch (error) {
            console.log(error);
        }
    };
    const { data: departamentos } = useQuery(
        ["departamentos"],
        listarDepartamentos,
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    const { data: assuntos } = useQuery(
        ["assuntos", { departamentoId: watch("departamentoId") }],
        listarAssuntos,
        {
            enabled: !!watch("departamentoId"),
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    const { data: contratos } = useQuery(["contratos"], listarContratos);
    const { data: participantes } = useQuery(
        [
            "participantesContrato",
            {
                contratoId: watch("contrato")?.id,
            },
        ],
        listarParticipantesContratos,
        {
            enabled: !!watch("contrato")?.id,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    useImperativeHandle(ref, () => ({
        onOpen: async (id = null) => {
            reset({});
            if (id) {
                await buscar.mutateAsync(id, {
                    onSuccess: (data) => {
                        reset({
                            ...data,
                            departamentoId: data.assunto.departamento.id,
                        });
                    },
                });
                onOpen();
            } else {
                onOpen();
            }
        },
    }));

    const [buscandoCep, setBuscandoCep] = useState(false);
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

    useEffect(() => {}, []);
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Chamado</ModalHeader>
                <ModalBody
                    id="formAbrirChamado"
                    as="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box bg="white" p={4} rounded="lg">
                        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
                            <GridItem>
                                <Select
                                    size="sm"
                                    placeholder="Departamento"
                                    error={errors.departamentoId?.message}
                                    {...register("departamentoId")}
                                >
                                    {departamentos?.data?.data?.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.titulo}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>
                            <GridItem>
                                <Select
                                    size="sm"
                                    placeholder="Assunto"
                                    error={errors.assunto?.message}
                                    {...register("assuntoId")}
                                    isDisabled={
                                        watch("departamentoId") ? false : true
                                    }
                                >
                                    {assuntos?.data?.data?.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.titulo}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>
                            <GridItem colSpan={2}>
                                <FormInput
                                    size="sm"
                                    placeholder="Titulo"
                                    error={errors.titulo?.message}
                                    {...register("titulo")}
                                />
                            </GridItem>
                        </Grid>

                        <Box mt={4}>
                            <Heading size="md">
                                Associe um contrato{" "}
                                <Text as="span" color="gray" fontSize="sm">
                                    (Opcional)
                                </Text>
                            </Heading>
                            <Text fontSize="sm" color="gray" mb={4}>
                                Facilita a ligação e identificação da ficha com
                                um contrato
                            </Text>
                            <Grid
                                gridTemplateColumns={{
                                    base: "repeat(1, 1fr)",
                                    lg: "repeat(4, 1fr)",
                                }}
                                gap={4}
                            >
                                <GridItem colSpan={2}>
                                    <Controller
                                        control={control}
                                        name="contrato"
                                        render={({ field }) => (
                                            <FormMultiSelect
                                                size="sm"
                                                {...field}
                                                isClearable
                                                onChange={(e) => {
                                                    setValue(
                                                        "codigoContrato",
                                                        e?.codigo
                                                            ? e?.codigo
                                                            : ""
                                                    );
                                                    field.onChange(e);
                                                }}
                                                options={contratos?.data?.data}
                                                placeholder="Contrato"
                                                error={errors.contrato?.message}
                                                getOptionLabel={(e) =>
                                                    `${e.codigo} - ${e.imovel?.endereco}`
                                                }
                                                getOptionValue={(e) => e.id}
                                            />
                                        )}
                                    />
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <Controller
                                        control={control}
                                        name="participantes"
                                        render={({ field }) => (
                                            <FormMultiSelect
                                                size="sm"
                                                {...field}
                                                isMulti
                                                options={
                                                    participantes &&
                                                    participantes
                                                }
                                                getOptionLabel={(e) =>
                                                    e.nome +
                                                    (e.contratosInquilino.length
                                                        ? " (Inquilino)"
                                                        : e
                                                              .contratosProprietario
                                                              .length
                                                        ? " (Proproprietário)"
                                                        : e.contratosFiador
                                                              .length
                                                        ? " (Fiador)"
                                                        : "?")
                                                }
                                                getOptionValue={(e) => e.id}
                                                placeholder="Selecione os participantes"
                                                error={
                                                    errors.participantes
                                                        ?.message
                                                }
                                                disabled={
                                                    watch("contrato")
                                                        ? false
                                                        : true
                                                }
                                            />
                                        )}
                                    />
                                </GridItem>
                            </Grid>
                        </Box>
                        <Box mt={4}>
                            <Heading size="md">
                                Associe um imóvel{" "}
                                <Text as="span" color="gray" fontSize="sm">
                                    (Opcional)
                                </Text>
                            </Heading>
                            <Text fontSize="sm" color="gray" mb={4}>
                                Facilita a ligação e identificação da ficha com
                                um imóvel
                            </Text>
                            <Grid
                                gridTemplateColumns={{
                                    base: "repeat(1, 1fr)",
                                    lg: "repeat(4, 1fr)",
                                }}
                                gap={4}
                            >
                                <GridItem colStart={{ base: 1, lg: 1 }}>
                                    <FormInput
                                        size="sm"
                                        label="Código do Contrato"
                                        placeholder="Digite o código"
                                        {...register("codigoContrato")}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Código do Imóvel"
                                        placeholder="Digite o código"
                                        {...register("codigoImovel")}
                                    />
                                </GridItem>
                                <GridItem
                                    as={Flex}
                                    colStart={{ base: 1, lg: 1 }}
                                    colSpan={{ base: 1, lg: 1 }}
                                >
                                    <Controller
                                        control={control}
                                        name="cepImovel"
                                        render={({ field }) => (
                                            <FormInput
                                                {...field}
                                                size="sm"
                                                mask={"99999-999"}
                                                label="CEP do Imóvel"
                                                placeholder="Digite o cep"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleBuscarCep(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        )}
                                    />

                                    {buscandoCep && <Spinner />}
                                </GridItem>
                                <GridItem colSpan={{ base: 1, lg: 3 }}>
                                    <FormInput
                                        size="sm"
                                        label="Endereço do Imóvel"
                                        placeholder="Digite o endereço"
                                        {...register("enderecoImovel")}
                                    />
                                </GridItem>
                                <GridItem colSpan={{ base: 1, lg: 1 }}>
                                    <FormInput
                                        size="sm"
                                        label="Número do Imóvel"
                                        placeholder="Digite o Número"
                                        {...register("numeroImovel")}
                                    />
                                </GridItem>
                                <GridItem colSpan={{ base: 1, lg: 3 }}>
                                    <FormInput
                                        size="sm"
                                        label="Complemento do Imóvel"
                                        placeholder="Digite o Complemento"
                                        {...register("complementoImovel")}
                                    />
                                </GridItem>
                                <GridItem colSpan={{ base: 1, lg: 2 }}>
                                    <FormInput
                                        size="sm"
                                        label="Bairro do Imóvel"
                                        placeholder="Digite o bairro"
                                        {...register("bairroImovel")}
                                    />
                                </GridItem>
                                <GridItem colSpan={{ base: 1, lg: 1 }}>
                                    <FormInput
                                        size="sm"
                                        label="Cidade do Imóvel"
                                        placeholder="Digite o endereço"
                                        {...register("cidadeImovel")}
                                    />
                                </GridItem>
                                <GridItem colSpan={{ base: 1, lg: 1 }}>
                                    <FormInput
                                        size="sm"
                                        label="Estado do Imóvel"
                                        placeholder="Digite o estado"
                                        {...register("estadoImovel")}
                                    />
                                </GridItem>
                            </Grid>
                        </Box>
                    </Box>
                </ModalBody>
                <ModalFooter gridGap={4}>
                    <Button onClick={() => onClose()}>Desistir</Button>
                    <Button
                        colorScheme="blue"
                        variant="solid"
                        isLoading={isSubmitting}
                        type="submit"
                        form="formAbrirChamado"
                    >
                        {watch("id") ? "Atualizar Chamado" : "Abrir Chamado"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const ModalAbrirChamado = forwardRef(ModalBase);
