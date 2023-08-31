import { FormInput } from "@/components/Form/FormInput";
import { FormInputCurrency } from "@/components/Form/FormInputCurrency";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { useAuth } from "@/hooks/useAuth";
import { imo7ApiService } from "@/services/apiServiceUsage";
import { listarFichas } from "@/services/models/modeloFicha";
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
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { MdClose, MdSave } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { FichasCadastrais } from "./Fichas";
import { queryClient } from "@/services/queryClient";
import { formatoValor } from "@/helpers/helpers";

export const EditarProcesso = ({ id, isOpen, onClose }) => {
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
    const buscar = useMutation(imo7ApiService("processo").get, {
        onSuccess(data, variables, context) {
            reset({ ...data });
        },
    });
    const atualizar = useMutation(imo7ApiService("processo").update);
    const onSubmit = async (data) => {
        try {
            await atualizar.mutateAsync(data);
            queryClient.invalidateQueries(["processos"]);
            onClose();
        } catch (error) {}
    };

    const { data: imoveis } = useQuery(
        ["imoveis", { noIncludes: true }],
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
    console.log(watch());
    const { fields, append, remove } = useFieldArray({
        control,
        name: "fichas",
    });
    useEffect(() => {
        buscar.mutate(id);
    }, [id]);
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Processo Nº {watch("codigo")} <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Tabs>
                        <TabList>
                            <Tab>Dados do Processo</Tab>
                            <Tab>
                                Fichas{" "}
                                <Tag ml={2} size="sm" colorScheme="blue">
                                    {watch("fichas")?.length}
                                </Tag>
                            </Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
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
                                                    {...register(
                                                        "tipoProcesso"
                                                    )}
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
                                                                                : "Cadatrar Imóvel"
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
                                                                    e.id
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
                                                        />
                                                    )}
                                                />
                                            </GridItem>
                                        </Grid>
                                    </Box>{" "}
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
