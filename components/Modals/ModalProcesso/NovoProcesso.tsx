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
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FiPlus, FiTrash } from "react-icons/fi";
import { MdClose, MdSave } from "react-icons/md";
import { useMutation, useQuery } from "react-query";

export const NovoProcesso = ({ isOpen, onClose, callback }) => {
    const { usuario } = useAuth();
    const toast = useToast();
    const {
        control,
        reset,
        watch,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

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
        ["imoveis", { linhas: 20 }],
        imo7ApiService("imovel").list
    );
    const campos = [
        {
            nome: "valor",
            label: "Valor Negociado",
        },
    ];
    const { data: modelos } = useQuery(["modelosFichas"], listarFichas);

    const { data: usuarios } = useQuery(
        ["listaUsuarios", { admImobiliaria: true }],
        listarUsuarios
    );
    useEffect(() => {
        reset();
    }, []);
    const { fields, append, remove } = useFieldArray({
        control,
        name: "fichas",
    });
    return (
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
                                gridTemplateColumns={{ lg: "repeat(2,1fr)" }}
                                gap={4}
                            >
                                <GridItem colStart={{ lg: 1 }}>
                                    <FormSelect
                                        size="sm"
                                        label="Tipo de Processo"
                                        {...register("tipoProcesso")}
                                    >
                                        <option value="LOCACAO">Locação</option>
                                        <option value="VENDA">Venda</option>
                                        <option value="COMPRA">Compra</option>
                                    </FormSelect>
                                </GridItem>
                                <GridItem colStart={{ lg: 1 }}>
                                    <Controller
                                        control={control}
                                        name="imovelId"
                                        render={({ field }) => (
                                            <FormMultiSelect
                                                size="sm"
                                                label="Imóvel"
                                                options={imoveis?.data?.data}
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
                                                getOptionValue={(i) => i.id}
                                                rightAddon={
                                                    <Box p={0}>
                                                        <Tooltip label="Cadastrar Imóvel">
                                                            <IconButton
                                                                rounded="none"
                                                                colorScheme="blue"
                                                                size="sm"
                                                                icon={
                                                                    <FiPlus />
                                                                }
                                                                isDisabled
                                                            />
                                                        </Tooltip>
                                                    </Box>
                                                }
                                                onChange={(e) =>
                                                    field.onChange(e.id)
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
                                                getOptionLabel={(e) => e.nome}
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
                                            />
                                        )}
                                    />
                                </GridItem>
                            </Grid>
                        </Box>
                        <Box>
                            <Heading size="sm" color="gray.700">
                                Condições
                            </Heading>
                            <Divider my={2} />
                            <Grid
                                gap={4}
                                gridTemplateColumns={{ lg: "repeat(2,1fr)" }}
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
                                    <IconButton
                                        colorScheme="blue"
                                        rounded="full"
                                        size="xs"
                                        icon={<FiPlus />}
                                        onClick={() => append()}
                                        variant="outline"
                                    />
                                </Tooltip>
                            </Flex>
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
                                                        errors.modelo?.message
                                                    }
                                                    getOptionLabel={(e) =>
                                                        `${e.tipo} - ${e.nome}`
                                                    }
                                                    getOptionValue={(e) => e.id}
                                                />
                                            )}
                                        />
                                        <FormInput
                                            size="sm"
                                            placeholder="Digite o nome..."
                                            {...register(`fichas[${k}].nome`)}
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
    );
};
