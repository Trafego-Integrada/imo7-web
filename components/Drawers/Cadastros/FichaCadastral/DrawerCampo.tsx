import { FormAutocomplete } from "@/components/Form/FormAutocomplete";
import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { listarCampos } from "@/services/models/campo";
import {
    atualizarCampoFicha,
    buscarCampoFicha,
    cadastrarCampoFicha,
} from "@/services/models/campoFicha";
import { listarCategoriaCampoFichas } from "@/services/models/categoriaCampoFicha";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Checkbox,
    Grid,
    GridItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

const schema = yup.object().shape({
    nome: yup.string().required("Campo obrigatório"),
    ordem: yup.string().required("Campo obrigatório"),
});

const ModalBase = ({}, ref) => {
    const toast = useToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const showData = useMutation(buscarCampoFicha);
    const atualizar = useMutation(atualizarCampoFicha);
    const cadastrar = useMutation(cadastrarCampoFicha);

    const onShow = async (id) => {
        await showData.mutateAsync(id, {
            onSuccess: (data) => {
                reset(data);
            },
        });
    };

    const onSubmit = async (data) => {
        if (data.id) {
            await atualizar.mutateAsync(data, {
                onSuccess: () => {
                    toast({
                        title: "Sucesso!",
                        description: "Campo cadastrado com sucesso!",
                        status: "success",
                    });
                    queryClient.invalidateQueries(["campos"]);
                },
            });
        } else {
            await cadastrar.mutateAsync(data, {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast({
                        title: "Sucesso!",
                        description: "Campo cadastrado com sucesso!",
                        status: "success",
                    });
                    queryClient.invalidateQueries(["campos"]);
                },
            });
        }
    };

    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            reset({});
            if (id) {
                onShow(id);
            }
            reset();
            onOpen();
        },
    }));
    const { data: categorias } = useQuery(
        ["listaCategorias", {}],
        listarCategoriaCampoFichas
    );
    const { data: campos } = useQuery(["listaCampos", {}], listarCampos);
    //console.log(watch());
    return (
        <Modal isOpen={isOpen} onClose={onClose} placement="right" size="3xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Cadastro de Campo
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody
                    as="form"
                    id="categoria-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box>
                        <Grid
                            gridTemplateColumns={{ lg: "repeat(3, 1fr)" }}
                            gap={4}
                        >
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Ordem de Exibição"
                                    {...register("ordem")}
                                    error={errors.ordem?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormSelect
                                    size="sm"
                                    label="Tipo de Ficha"
                                    {...register("tipoFicha")}
                                    error={errors.tipoFicha?.message}
                                >
                                    <option value="inquilino">Inquilino</option>
                                    <option value="proprietario">
                                        Proprietário
                                    </option>
                                    <option value="fiador">Fiador</option>
                                    <option value="imovel">Imóvel</option>
                                    <option value="comprador">comprador</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="visita">Visita</option>
                                </FormSelect>
                            </GridItem>
                            <GridItem>
                                <Controller
                                    control={control}
                                    name="categoria"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            {...field}
                                            size="sm"
                                            label="Categoria"
                                            placeholder="Selecione..."
                                            options={categorias?.data}
                                            getOptionLabel={(e) => e.nome}
                                            getOptionValue={(e) => e.id}
                                        />
                                    )}
                                />
                            </GridItem>
                            <GridItem>
                                <FormSelect
                                    size="sm"
                                    label="Tipo de Campo"
                                    {...register("tipoCampo")}
                                    error={errors.tipoCampo?.message}
                                >
                                    <option value="cpf">CPF</option>
                                    <option value="cnpj">CNPJ</option>
                                    <option value="number">Number</option>
                                    <option value="text">Text</option>
                                    <option value="qrcode">
                                        Text (QRCode)
                                    </option>
                                    <option value="textarea">Textarea</option>
                                    <option value="select">Select</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="file">Arquivo</option>
                                    <option value="files">
                                        Multiplos Arquivos
                                    </option>
                                    <option value="image">Imagem</option>
                                    <option value="datetime-local">
                                        Data e Hora
                                    </option>
                                    <option value="date">Data</option>
                                    <option value="time">Hora</option>
                                </FormSelect>
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Codigo"
                                    {...register("codigo")}
                                    error={errors.codigo?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="Nome"
                                    {...register("nome")}
                                    error={errors.nome?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormTextarea
                                    size="sm"
                                    label="Descrição"
                                    {...register("descricao")}
                                    error={errors.descricao?.message}
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    size="sm"
                                    label="ColSpan"
                                    {...register("colSpan")}
                                    error={errors.colSpan?.message}
                                />
                            </GridItem>
                            {(watch("tipoCampo") == "select" ||
                                watch("tipoCampo") == "radio") && (
                                <>
                                    <GridItem>
                                        <Controller
                                            control={control}
                                            name="opcoes"
                                            render={({ field }) => (
                                                <FormAutocomplete
                                                    label="Opções"
                                                    {...field}
                                                    multiple
                                                    items={[]}
                                                />
                                            )}
                                        />
                                    </GridItem>
                                </>
                            )}
                            {(watch("tipoCampo") == "text" ||
                                watch("tipoCampo") == "cpf" ||
                                watch("tipoCampo") == "cnpj") && (
                                <>
                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            label="Mascara"
                                            {...register("mask")}
                                            error={errors.mask?.message}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Checkbox
                                            size="sm"
                                            isChecked={watch("cep")}
                                            {...register("cep")}
                                            isInvalid={errors.cep?.message}
                                        >
                                            Campo de CEP
                                        </Checkbox>
                                    </GridItem>
                                    {watch("cep") && (
                                        <GridItem>
                                            <Controller
                                                control={control}
                                                name="camposEndereco.endereco"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        size="sm"
                                                        label="Campo Endereço"
                                                        placeholder="Selecione..."
                                                        options={campos?.data}
                                                        getOptionLabel={(e) =>
                                                            e.codigo +
                                                            " - " +
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                    />
                                                )}
                                            />
                                            <Controller
                                                control={control}
                                                name="camposEndereco.bairro"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        size="sm"
                                                        label="Campo Bairro"
                                                        placeholder="Selecione..."
                                                        options={campos?.data}
                                                        getOptionLabel={(e) =>
                                                            e.codigo +
                                                            " - " +
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                    />
                                                )}
                                            />
                                            <Controller
                                                control={control}
                                                name="camposEndereco.cidade"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        size="sm"
                                                        label="Campo Cidade"
                                                        placeholder="Selecione..."
                                                        options={campos?.data}
                                                        getOptionLabel={(e) =>
                                                            e.codigo +
                                                            " - " +
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                    />
                                                )}
                                            />
                                            <Controller
                                                control={control}
                                                name="camposEndereco.estado"
                                                render={({ field }) => (
                                                    <FormMultiSelect
                                                        {...field}
                                                        size="sm"
                                                        label="Campo Estado"
                                                        placeholder="Selecione..."
                                                        options={campos?.data}
                                                        getOptionLabel={(e) =>
                                                            e.codigo +
                                                            " - " +
                                                            e.nome
                                                        }
                                                        getOptionValue={(e) =>
                                                            e.id
                                                        }
                                                    />
                                                )}
                                            />
                                        </GridItem>
                                    )}
                                </>
                            )}{" "}
                            <GridItem colSpan={{ lg: 2 }} colStart={{ lg: 1 }}>
                                <Controller
                                    control={control}
                                    name="dependencia"
                                    render={({ field }) => (
                                        <FormMultiSelect
                                            {...field}
                                            size="sm"
                                            label="Dependencia"
                                            placeholder="Selecione..."
                                            options={campos?.data}
                                            getOptionLabel={(e) => e.nome}
                                            getOptionValue={(e) => e.id}
                                            description="Informe o campo que deve estar preenchido para que este campo seja ativado"
                                        />
                                    )}
                                />
                            </GridItem>
                            {watch("dependencia.opcoes")?.length > 0 && (
                                <GridItem colSpan={{ lg: 1 }}>
                                    <Controller
                                        control={control}
                                        name="dependenciaValor"
                                        render={({ field }) => (
                                            <FormMultiSelect
                                                size="sm"
                                                isMulti
                                                options={
                                                    watch("dependencia.opcoes")
                                                        .length > 0
                                                        ? watch(
                                                              "dependencia.opcoes"
                                                          ).map((i) => ({
                                                              label: i,
                                                              value: i,
                                                          }))
                                                        : []
                                                }
                                                value={
                                                    field.value
                                                        ? watch(
                                                              "dependencia.opcoes"
                                                          )
                                                              ?.filter((i) =>
                                                                  field.value.includes(
                                                                      i
                                                                  )
                                                              )
                                                              .map((i) => ({
                                                                  label: i,
                                                                  value: i,
                                                              }))
                                                        : null
                                                }
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e
                                                            ? e.map(
                                                                  (i) => i.value
                                                              )
                                                            : null
                                                    )
                                                }
                                                label="Opção requerida"
                                                placeholder="Selecione..."
                                            />
                                        )}
                                    />
                                </GridItem>
                            )}
                        </Grid>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button
                        type="submit"
                        form="categoria-form"
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

export const ModalCampo = forwardRef(ModalBase);
