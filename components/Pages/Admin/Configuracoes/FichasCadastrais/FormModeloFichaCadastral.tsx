import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { listarCampos } from "@/services/models/campo";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Switch,
    Table,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import {
    atualizarFicha,
    buscarFicha,
    cadastrarFicha,
} from "@/services/models/modeloFicha";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const FormModeloFichaCadastral = ({ id = null }) => {
    const router = useRouter();
    const toast = useToast();

    const {
        reset,
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();
    const buscar = useMutation(buscarFicha, {
        onSuccess: (data) => {
            reset(data);
        },
    });
    const cadastrar = useMutation(cadastrarFicha);
    const atualizar = useMutation(atualizarFicha);
    const onSubmit = async (data) => {
        try {
            if (data.if) {
                await cadastrar.mutateAsync(data, {
                    onSuccess: (data) => {
                        toast({
                            title: "Ficha cadastrada com sucesso",
                            status: "success",
                        });
                        router.back();
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
                    lg: "repeat(3,1fr)",
                }}
                gap={4}
            >
                <GridItem>
                    <FormSelect label="Tipo" {...register("tipo")} size="sm">
                        <option value="inquilino">Cadastro de Inquilino</option>
                        <option value="proprietario">
                            Cadastro de Proprietário
                        </option>
                        <option value="fiador">Cadastro de Fiador</option>
                        <option value="imovel">Cadastro de Imóvel</option>
                    </FormSelect>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 2 }}>
                    <FormInput label="Nome" {...register("nome")} size="sm" />
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 3 }}>
                    <FormInput
                        label="Descrição"
                        {...register("descricao")}
                        size="sm"
                    />
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
                    <Heading size="sm">Campos</Heading>
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
                                    i.tipoCampo != "files" &&
                                    i.tipoCampo != "file"
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
                </GridItem>
                <GridItem bg="white" p={4}>
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
