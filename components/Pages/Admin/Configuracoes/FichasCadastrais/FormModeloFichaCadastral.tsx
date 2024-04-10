import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { listarCampos } from "@/services/models/campo";
import { listarCategoriaCampoFichas } from "@/services/models/categoriaCampoFicha";
import {
    atualizarFicha,
    buscarFicha,
    cadastrarFicha,
} from "@/services/models/modeloFicha";
import {
    Box,
    Button,
    Flex,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Switch,
    Table,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiPlus, FiTrash } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
export const FormModeloFichaCadastral = ({ id = null }) => {
    const router = useRouter();
    const toast = useToast();

    const {
        control,
        reset,
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            instrucoes: "",
        },
    });
    const buscar = useMutation(buscarFicha, {
        onSuccess: (data) => {
            reset({ ...data });
        },
    });
    const cadastrar = useMutation(cadastrarFicha);
    const atualizar = useMutation(atualizarFicha);
    const onSubmit = async (data) => {
        try {
            if (data.id) {
                await atualizar.mutateAsync(data, {
                    onSuccess: (data) => {
                        toast({
                            title: "Ficha atualizada com sucesso",
                            status: "success",
                        });
                    },
                });
            } else {
                await cadastrar.mutateAsync(data, {
                    onSuccess: (data) => {
                        toast({
                            title: "Ficha cadastrada com sucesso",
                            status: "success",
                        });
                        router.back();
                    },
                });
            }
        } catch (error) {}
    };
    const { data: categorias } = useQuery(
        [
            "categorias",
            {
                tipoFicha: watch("tipo"),
            },
        ],
        listarCategoriaCampoFichas
    );
    const { data: campos } = useQuery(
        [
            "campos",
            {
                tipoFicha: watch("tipo"),
            },
        ],
        listarCampos
    );
    useEffect(() => {
        buscar.mutate(id);
    }, [id]);
    return (
        <Box p={4} as="form" onSubmit={handleSubmit(onSubmit)}>
            <Box mb={6}>
                <Heading size="md" color="gray.600">
                    Modelo de Ficha Cadastral
                </Heading>
                <Text color="gray" fontSize="sm" fontStyle="italic">
                    Cadastre e edite os modelos de fichas cadastrais de sua
                    imobiliária
                </Text>
            </Box>

            <Grid
                bg="white"
                p={4}
                gridTemplateColumns={{
                    base: "repeat(1,1fr)",
                    lg: "repeat(12,1fr)",
                }}
                gap={4}
            >
                <GridItem colSpan={{ base: 1, lg: 1 }}>
                    <FormLabel fontSize="sm">Status</FormLabel>
                    <Switch
                        size="sm"
                        {...register(`status`)}
                        isChecked={watch("status")}
                    />
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 2 }}>
                    <FormSelect label="Tipo" {...register("tipo")} size="sm">
                        <option value="inquilino">Cadastro de Inquilino</option>
                        <option value="proprietario">
                            Cadastro de Proprietário
                        </option>
                        <option value="fiador">Cadastro de Fiador</option>
                        <option value="imovel">Cadastro de Imóvel</option>
                        <option value="comprador">Cadastro de Comprador</option>
                        <option value="vendedor">Cadastro de Vendedor</option>
                        <option value="visita">Cadastro de Visita</option>
                    </FormSelect>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 9 }}>
                    <FormInput label="Nome" {...register("nome")} size="sm" />
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                    <FormInput
                        label="Descrição"
                        {...register("descricao")}
                        size="sm"
                    />
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                    <Box>
                        <Text fontSize="sm" mb={2}>
                            Instruções
                        </Text>
                        <Controller
                            control={control}
                            name="instrucoes"
                            render={({ field }) => (
                                <Editor {...field} theme="snow" />
                            )}
                        />
                    </Box>
                </GridItem>
            </Grid>
            <Grid
                py={4}
                gridTemplateColumns={{
                    base: "repeat(1,1fr)",
                    lg: "repeat(2,1fr)",
                }}
                gap={4}
            >
                <GridItem bg="white" p={4}>
                    <Grid gap={4}>
                        {categorias &&
                            categorias?.data?.map(
                                (item: any, index: number) => (
                                    <GridItem key={index}>
                                        <Heading size="sm">{item.nome}</Heading>
                                        <Table size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th></Th>
                                                    <Th w={24}>Exibir</Th>
                                                    <Th w={24}>Obrigatório</Th>
                                                </Tr>
                                            </Thead>
                                            {item?.campos.map((i, key) => (
                                                <Tr key={i.id}>
                                                    <Td>{i.nome}</Td>
                                                    <Td>
                                                        <Switch
                                                            size="sm"
                                                            {...register(
                                                                `campos.${i.codigo}.exibir`
                                                            )}
                                                        />
                                                    </Td>
                                                    <Td>
                                                        <Switch
                                                            size="sm"
                                                            {...register(
                                                                `campos.${i.codigo}.obrigatorio`
                                                            )}
                                                        />
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Table>
                                    </GridItem>
                                )
                            )}
                    </Grid>
                </GridItem>
                <GridItem as={Grid} gap={4}>
                    {/* <GridItem bg="white" p={4}>
                        <Heading size="sm">Arquivos</Heading>
                        <Table size="sm">
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th w={24}>Exibir</Th>
                                    <Th w={24}>Obrigatório</Th>
                                </Tr>
                            </Thead>
                            {campos?.data
                                ?.filter(
                                    (i) =>
                                        i.tipoCampo == "files" ||
                                        i.tipoCampo == "file"
                                )
                                .map((item, key) => (
                                    <Tr key={item.id}>
                                        <Td>{item.nome}</Td>
                                        <Td>
                                            <Switch
                                                size="sm"
                                                {...register(
                                                    `campos.${item.codigo}.exibir`
                                                )}
                                            />
                                        </Td>
                                        <Td>
                                            <Switch
                                                size="sm"
                                                {...register(
                                                    `campos.${item.codigo}.obrigatorio`
                                                )}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                        </Table>
                    </GridItem> */}
                    <GridItem bg="white" p={4}>
                        <Flex justify="space-between" align="center">
                            <Box>
                                <Heading size="sm">Aceites</Heading>
                                <Text fontSize="xs" color="gray">
                                    Adicione aceites às fichas cadastrais
                                </Text>
                            </Box>
                            <IconButton
                                icon={<Icon as={FiPlus} />}
                                colorScheme="blue"
                                variant="ghost"
                                rounded="full"
                                onClick={() => {
                                    let arr = watch("checkbox");
                                    if (arr && arr.length) {
                                        arr.push("");
                                    } else {
                                        arr = [""];
                                    }
                                    reset({ ...watch(), checkbox: arr });
                                }}
                            />
                        </Flex>
                        <Flex mt={4} gap={4} flexDir="column">
                            {watch("checkbox")?.map((item, key) => (
                                <Box pos="relative">
                                    <FormTextarea
                                        key={key}
                                        size="sm"
                                        label={`Aceite nº ${key + 1}`}
                                        {...register(`checkbox.${key}`)}
                                    />
                                    <IconButton
                                        icon={<Icon as={FiTrash} />}
                                        pos="absolute"
                                        top={0}
                                        right={0}
                                        size="xs"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => {
                                            let arr = watch("checkbox");
                                            arr.splice(key, 1);
                                            reset({
                                                ...watch(),
                                                checkbox: arr,
                                            });
                                        }}
                                    />
                                </Box>
                            ))}
                        </Flex>
                    </GridItem>
                </GridItem>
            </Grid>
            <Flex justify="space-between">
                <Button
                    size="sm"
                    variant="outline"
                    colorScheme="gray"
                    onClick={() => router.back()}
                >
                    Voltar
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    colorScheme="blue"
                    size="sm"
                >
                    Salvar
                </Button>
            </Flex>
        </Box>
    );
};
