import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import prisma from "@/lib/prisma";
import {
    atualizarAnexosFicha,
    atualizarFicha,
} from "@/services/models/fichaCadastral";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    Image,
    Text,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiEye } from "react-icons/fi";
import { useMutation } from "react-query";

const FichaCadastral = ({ ficha, campos, modelo }) => {
    console.log(ficha);
    const toast = useToast();
    const {
        watch,
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm({
        defaultValues: {
            ...ficha,
        },
    });
    const atualizar = useMutation(atualizarFicha);
    const atualizarAnexos = useMutation(atualizarAnexosFicha);
    const onSubmit = async (data) => {
        try {
            console.log(data);
            await atualizar.mutateAsync(data);

            const formData = new FormData();
            await Promise.all(
                Object.entries(data.arquivos).map((item) => {
                    var files = item[1].length;
                    for (var x = 0; x < files; x++) {
                        formData.append(item[0], item[1][x]);
                    }
                })
            );
            await atualizarAnexos.mutateAsync({ id: data.id, formData });
            toast({ title: "Ficha salva", status: "success" });
        } catch (e) {
            toast({ title: "Houve um problema", status: "error" });
        }
    };
    return (
        <Box
            bg="gray.200"
            minH="100vh"
            as="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container maxW="container.lg">
                <Flex align="center" py={8}>
                    <Box>
                        <Image w={150} src={ficha.imobiliaria.logo} />
                    </Box>
                    <Box>
                        <Text>
                            <Text as="span" fontWeight="bold">
                                {ficha.imobiliaria.razaoSocial}
                            </Text>{" "}
                            • CNPJ: {ficha.imobiliaria.cnpj}
                        </Text>
                        <Text fontSize="sm">
                            {ficha.imobiliaria.endereco},
                            {ficha.imobiliaria.bairro},
                            {ficha.imobiliaria.cidade}/
                            {ficha.imobiliaria.estado} - CEP:{" "}
                            {ficha.imobiliaria.cep}
                        </Text>
                        <Text fontSize="sm">
                            <Text as="span" fontWeight="bold">
                                Fixo:
                            </Text>{" "}
                            {ficha.imobiliaria.telefone} •{" "}
                            <Text as="span" fontWeight="bold">
                                E-mail:
                            </Text>{" "}
                            {ficha.imobiliaria.email} •{" "}
                            <Text as="span" fontWeight="bold">
                                Site:
                            </Text>{" "}
                            {ficha.imobiliaria.site}
                        </Text>
                    </Box>
                </Flex>
                <Box py={8}>
                    <Heading size="md" textAlign="center">
                        {modelo.nome}
                    </Heading>
                    <Text textAlign="center" fontSize="sm" color="gray">
                        {modelo.descricao}
                    </Text>
                    {ficha.status == "aprovada" && (
                        <Alert status="success" my={2}>
                            <AlertIcon />
                            <AlertTitle>Ficha Aprovada</AlertTitle>
                        </Alert>
                    )}
                    {ficha.status == "reprovada" && (
                        <Alert status="error" my={2}>
                            <AlertIcon />
                            <AlertTitle>Ficha reprovada</AlertTitle>
                            <AlertDescription>
                                {ficha.motivoReprovacao}
                            </AlertDescription>
                        </Alert>
                    )}
                </Box>
                <Grid gap={4}>
                    {campos.map((item) => (
                        <Box key={item.id} bg="white" p={4}>
                            <Heading size="sm" mb={6}>
                                {item.nome}
                            </Heading>
                            <Grid
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(5,1fr)",
                                }}
                                gap={2}
                            >
                                {item.campos.map((campo) => (
                                    <GridItem
                                        key={campo.id}
                                        colSpan={{ lg: campo.colSpan }}
                                    >
                                        {campo.tipoCampo == "text" ? (
                                            <FormInput
                                                size="sm"
                                                label={campo.nome}
                                                {...register(
                                                    "preenchimento." +
                                                        campo.codigo
                                                )}
                                            />
                                        ) : campo.tipoCampo == "file" ? (
                                            <Flex align="flex-end">
                                                <FormInput
                                                    size="sm"
                                                    type="file"
                                                    label={campo.nome}
                                                    {...register(
                                                        "arquivos." +
                                                            campo.codigo
                                                    )}
                                                />
                                                {watch(
                                                    "preenchimento." +
                                                        campo.codigo
                                                ) && (
                                                    <Link
                                                        href={watch(
                                                            "preenchimento." +
                                                                campo.codigo
                                                        )}
                                                        target="_parent"
                                                    >
                                                        <Button
                                                            size="sm"
                                                            borderLeftRadius={0}
                                                            leftIcon={
                                                                <Icon
                                                                    as={FiEye}
                                                                />
                                                            }
                                                            px={6}
                                                        >
                                                            Visualizar
                                                        </Button>
                                                    </Link>
                                                )}
                                            </Flex>
                                        ) : campo.tipoCampo == "files" ? (
                                            <FormInput
                                                size="sm"
                                                type="file"
                                                multiple="multiple"
                                                label={campo.nome}
                                                {...register(
                                                    "arquivos." + campo.codigo
                                                )}
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </GridItem>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </Grid>
                <Flex py={4} justify="flex-end">
                    {ficha.status == "reprovada" ||
                        (ficha.status == "aguardando" && (
                            <Button
                                colorScheme="blue"
                                type="submit"
                                isLoading={isSubmitting}
                            >
                                Salvar
                            </Button>
                        ))}
                </Flex>
            </Container>
        </Box>
    );
};

export default FichaCadastral;

export const getServerSideProps = async (ctx) => {
    const { id } = ctx.query;
    let ficha = await prisma.fichaCadastral.findUnique({
        where: { id },
        include: {
            imobiliaria: true,
            modelo: true,
            preenchimento: {
                include: {
                    campo: true,
                },
            },
        },
    });
    const modelo = await prisma.modeloFichaCadastral.findUnique({
        where: {
            id: ficha?.modeloFichaCadastralId,
        },
    });
    const campos = await prisma.categoriaCampoFichaCadastral.findMany({
        where: {
            campos: {
                some: {
                    tipoFicha: ficha?.modelo.tipo,
                },
            },
        },
        orderBy: {
            ordem: "asc",
        },
        include: {
            campos: {
                orderBy: {
                    ordem: "asc",
                },
            },
        },
    });
    let newObj = {};
    let newArq = {};
    ficha.preenchimento.map((item) => {
        newObj[item.campoFichaCadastralCodigo] = item.valor;
    });
    ficha.preenchimento = newObj;
    return {
        props: {
            ficha: JSON.parse(JSON.stringify(ficha)),
            modelo: JSON.parse(JSON.stringify(modelo)),
            campos: JSON.parse(JSON.stringify(campos)),
        },
    };
};
