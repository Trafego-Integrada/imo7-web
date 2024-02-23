import { TabelaUsuarios } from "@/components/Tabelas/Usuarios";
import { useAuth } from "@/hooks/useAuth";
import { listarContas } from "@/services/models/conta";
import { show, store, update } from "@/services/models/imobiliaria";
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
    ModalCloseButton,
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
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { FormInput } from "../Form/FormInput";
import { FormSelect } from "../Form/FormSelect";

const schema = yup.object().shape({
    codigo: yup.string().required("O Código é obrigatório"),
    razaoSocial: yup.string().required("A Razão Social é obrigatório"),
    cnpj: yup.string().required("O CNPJ é obrigatório"),
    email: yup.string().required("O E-mail é obrigatório"),
    telefone: yup.string().required("O Telefone é obrigatório"),
    url: yup.string().required("O URL é obrigatório"),
    contaId: yup.string().required("A Conta é obrigatório"),
});

const DrawerBase = ({}, ref) => {
    const toast = useToast();
    const { usuario } = useAuth();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const showData = useMutation(show, {
        onSuccess: (data) => {
            reset(data);
            onOpen();
        },
    });
    const atualizar = useMutation(update);
    const cadastrar = useMutation(store);

    const { mutateAsync: buscarCep, isLoading } = useMutation(
        async (cep) => {
            const { data } = await axios.get(
                "https://viacep.com.br/ws/" + cep + "/json/"
            );
            return data;
        },
        {
            onSuccess: (data) => {
                reset({
                    ...watch(),
                    endereco: data.logradouro,
                    bairro: data.bairro,
                    estado: data.uf,
                    cidade: data.localidade,
                });
            },
        }
    );

    const handleBuscarCep = (cep) => {
        if (cep.length === 9) {
            buscarCep(cep);
        }
    };

    const onSubmit = async (data) => {
        if (data.id) {
            // const formData = new FormData();
            // Object.entries(data).map((i) => formData.append(i[0], i[1]));
            await atualizar.mutateAsync(
                {
                    id: data.id,
                    data: {
                        ...data,
                    },
                },
                {
                    onSuccess: () => {
                        reset();
                        onClose();
                        toast({
                            title: "Sucesso!",
                            description: "Imobiliária atualizada com sucesso!",
                            status: "success",
                        });
                        queryClient.invalidateQueries("imobiliarias");
                    },
                }
            );
        } else {
            await cadastrar.mutateAsync(data, {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast({
                        title: "Sucesso!",
                        description: "Imobiliária cadastrada com sucesso!",
                        status: "success",
                    });
                    queryClient.invalidateQueries("imobiliarias");
                },
            });
        }
    };

    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            reset({});
            if (id) {
                showData.mutate(id);
            } else {
                onOpen();
            }
        },
    }));
    //console.log("Dados", watch());
    const { data: contas } = useQuery(["contas"], listarContas);
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Imobiliária
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody
                    as="form"
                    id="imob-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Tabs size="sm">
                        <TabList>
                            <Tab>Informações Gerais</Tab>
                            {watch("id") && (
                                <>
                                    <Tab>Usuários</Tab>
                                    <Tab>Imóveis</Tab>
                                    <Tab>Proprietários</Tab>
                                    <Tab>Inquilinos</Tab>
                                    <Tab>Contratos</Tab>
                                </>
                            )}
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Box>
                                    <Grid
                                        gridTemplateColumns="repeat(4, 1fr)"
                                        gap={4}
                                    >
                                        <GridItem colSpan={2}>
                                            <FormInput
                                                size="sm"
                                                label="Código (Identificador único da imobiliária)"
                                                {...register("codigo1")}
                                                error={errors.codigo1?.message}
                                            />
                                        </GridItem>
                                        <GridItem colStart={1} colSpan={2}>
                                            <FormInput
                                                size="sm"
                                                label="Razão Social"
                                                {...register("razaoSocial")}
                                                error={
                                                    errors.razaoSocial?.message
                                                }
                                            />
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormInput
                                                size="sm"
                                                label="Nome Fantasia"
                                                {...register("nome")}
                                                error={errors.nome?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                size="sm"
                                                label="CNPJ"
                                                as={InputMask}
                                                mask="99.999.999/9999-99"
                                                maskChar={null}
                                                {...register("cnpj")}
                                                error={errors.cnpj?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                size="sm"
                                                label="Inscrição Estadual"
                                                {...register("ie")}
                                                error={errors.ie?.message}
                                            />
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormInput
                                                size="sm"
                                                label="E-mail para contato"
                                                {...register("email")}
                                                error={errors.email?.message}
                                            />
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormInput
                                                size="sm"
                                                label="Site"
                                                {...register("site")}
                                                error={errors.site?.message}
                                            />
                                        </GridItem>

                                        <GridItem>
                                            <FormInput
                                                size="sm"
                                                label="Telefone"
                                                {...register("telefone")}
                                                as={InputMask}
                                                mask={
                                                    watch("telefone") &&
                                                    watch("telefone").length ==
                                                        15
                                                        ? "(99) 9 9999-9999"
                                                        : "(99) 9999-99999"
                                                }
                                                maskChar={null}
                                                error={errors.telefone?.message}
                                            />
                                        </GridItem>
                                    </Grid>
                                    <Heading size="md" mt={4} mb={2}>
                                        Endereço
                                    </Heading>
                                    <Grid
                                        gridTemplateColumns="repeat(4, 1fr)"
                                        gap={4}
                                    >
                                        <GridItem
                                            as={Flex}
                                            gridGap={2}
                                            align="center"
                                            colStart={1}
                                        >
                                            <FormInput
                                                size="sm"
                                                label="CEP"
                                                as={InputMask}
                                                mask="99999-999"
                                                maskChar={null}
                                                onChangeCapture={(e) =>
                                                    handleBuscarCep(
                                                        e.target.value
                                                    )
                                                }
                                                {...register("cep")}
                                                error={errors.cep?.message}
                                            />
                                            {isLoading && <Spinner size="xs" />}
                                        </GridItem>
                                        <GridItem colStart={1} colSpan={3}>
                                            <FormInput
                                                size="sm"
                                                label="Endereço"
                                                {...register("endereco")}
                                                error={errors.endereco?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                size="sm"
                                                label="Número"
                                                {...register("numero")}
                                                error={errors.numero?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                size="sm"
                                                label="Complemento"
                                                {...register("complemento")}
                                                error={
                                                    errors.complemento?.message
                                                }
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                size="sm"
                                                label="Bairro"
                                                {...register("bairro")}
                                                error={errors.bairro?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                size="sm"
                                                label="Cidade"
                                                {...register("cidade")}
                                                error={errors.cidade?.message}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormSelect
                                                size="sm"
                                                label="Estado"
                                                {...register("estado")}
                                                error={errors.estado?.message}
                                            >
                                                <option value="AC">Acre</option>
                                                <option value="AL">
                                                    Alagoas
                                                </option>
                                                <option value="AP">
                                                    Amapá
                                                </option>
                                                <option value="AM">
                                                    Amazonas
                                                </option>
                                                <option value="BA">
                                                    Bahia
                                                </option>
                                                <option value="CE">
                                                    Ceará
                                                </option>
                                                <option value="DF">
                                                    Distrito Federal
                                                </option>
                                                <option value="ES">
                                                    Espírito Santo
                                                </option>
                                                <option value="GO">
                                                    Goiás
                                                </option>
                                                <option value="MA">
                                                    Maranhão
                                                </option>
                                                <option value="MT">
                                                    Mato Grosso
                                                </option>
                                                <option value="MS">
                                                    Mato Grosso do Sul
                                                </option>
                                                <option value="MG">
                                                    Minas Gerais
                                                </option>
                                                <option value="PA">Pará</option>
                                                <option value="PB">
                                                    Paraíba
                                                </option>
                                                <option value="PR">
                                                    Paraná
                                                </option>
                                                <option value="PE">
                                                    Pernambuco
                                                </option>
                                                <option value="PI">
                                                    Piauí
                                                </option>
                                                <option value="RJ">
                                                    Rio de Janeiro
                                                </option>
                                                <option value="RN">
                                                    Rio Grande do Norte
                                                </option>
                                                <option value="RS">
                                                    Rio Grande do Sul
                                                </option>
                                                <option value="RO">
                                                    Rondônia
                                                </option>
                                                <option value="RR">
                                                    Roraima
                                                </option>
                                                <option value="SC">
                                                    Santa Catarina
                                                </option>
                                                <option value="SP">
                                                    São Paulo
                                                </option>
                                                <option value="SE">
                                                    Sergipe
                                                </option>
                                                <option value="TO">
                                                    Tocantins
                                                </option>
                                                <option value="EX">
                                                    Estrangeiro
                                                </option>
                                            </FormSelect>
                                        </GridItem>
                                    </Grid>
                                    <Heading size="md" mt={4} mb={2}>
                                        Acesso personalizado
                                    </Heading>
                                    <Grid
                                        gridTemplateColumns="repeat(4, 1fr)"
                                        gap={4}
                                    >
                                        <GridItem colSpan={2}>
                                            <FormInput
                                                size="sm"
                                                label="URL"
                                                {...register("url")}
                                                error={errors.url?.message}
                                            />
                                        </GridItem>
                                    </Grid>
                                    {!watch("id") && (
                                        <>
                                            <Heading size="md" mt={4} mb={2}>
                                                Administrador
                                            </Heading>
                                            <Grid
                                                gridTemplateColumns="repeat(3, 1fr)"
                                                gap={4}
                                            >
                                                <GridItem colSpan={1}>
                                                    <FormInput
                                                        size="sm"
                                                        label="Nome"
                                                        {...register(
                                                            "usuario.nome"
                                                        )}
                                                        error={
                                                            errors.usuario?.nome
                                                                ?.message
                                                        }
                                                    />
                                                </GridItem>
                                                <GridItem colSpan={1}>
                                                    <FormInput
                                                        size="sm"
                                                        label="CPF"
                                                        {...register(
                                                            "usuario.documento"
                                                        )}
                                                        error={
                                                            errors.usuario
                                                                ?.documento
                                                                ?.message
                                                        }
                                                    />
                                                </GridItem>
                                                <GridItem colSpan={1}>
                                                    <FormInput
                                                        size="sm"
                                                        label="E-mail"
                                                        {...register(
                                                            "usuario.email"
                                                        )}
                                                        error={
                                                            errors.usuario
                                                                ?.email?.message
                                                        }
                                                    />
                                                </GridItem>
                                            </Grid>
                                        </>
                                    )}
                                    {usuario &&
                                        usuario.cargos?.filter(
                                            (i) => i === "Admin"
                                        ) && (
                                            <>
                                                <Heading
                                                    size="md"
                                                    mt={4}
                                                    mb={2}
                                                >
                                                    Área restrita
                                                </Heading>
                                                <Grid
                                                    gridTemplateColumns="repeat(4, 1fr)"
                                                    gap={4}
                                                >
                                                    <GridItem colSpan={2}>
                                                        <FormSelect
                                                            size="sm"
                                                            label="Conta"
                                                            placeholder="É de qual conta?"
                                                            {...register(
                                                                "contaId"
                                                            )}
                                                            error={
                                                                errors.contaId
                                                                    ?.message
                                                            }
                                                        >
                                                            {contas &&
                                                                contas.map(
                                                                    (
                                                                        item,
                                                                        key
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                key
                                                                            }
                                                                            value={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            {
                                                                                item.nome
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                        </FormSelect>
                                                    </GridItem>
                                                </Grid>
                                            </>
                                        )}
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <TabelaUsuarios
                                    imobiliariaId={watch("id")}
                                    admImobiliaria={true}
                                />
                            </TabPanel>
                            <TabPanel></TabPanel>
                            <TabPanel></TabPanel>
                            <TabPanel></TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button
                        type="submit"
                        form="imob-form"
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

export const ImobiliariaDrawer = forwardRef(DrawerBase);
