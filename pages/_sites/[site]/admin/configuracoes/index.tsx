import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { Envio } from "@/components/Pages/Admin/Configuracoes/Envio";
import { FichasCadastrais } from "@/components/Pages/Admin/Configuracoes/FichasCadastrais";
import { convertToBase64, getFileExtension } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import { show, update } from "@/services/models/imobiliaria";
import { withSSRAuth } from "@/utils/withSSRAuth";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Image,
    List,
    ListItem,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { FiTrash } from "react-icons/fi";
import { useMutation } from "react-query";
import * as yup from "yup";
const schema = yup.object().shape({
    razaoSocial: yup.string().required("Campo obrigatório"),
    nomeFantasia: yup.string().required("Campo obrigatório"),
    cnpj: yup.string().required("Campo obrigatório"),
});
const Configuracoes = () => {
    const router = useRouter();
    const [tab, setTab] = useState(0);
    const [logo, setLogo] = useState([]);
    const [bg, setBg] = useState([]);
    const toast = useToast();
    const { usuario } = useAuth();
    const {
        setValue,
        watch,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [error, setError] = useState(null);
    const buscar = useMutation(show, {
        onSuccess: (data) => {
            reset({ ...data });
        },
    });
    const atualizar = useMutation(update);
    const onSubmit = async (data) => {
        try {
            setError(null);
            // const formData = new FormData();
            // Object.entries(data).map((i) => formData.append(i[0], i[1]));
            let base64StringLogo = null;
            let fileExtensionLogo = null;
            let base64StringBg = null;
            let fileExtensionBg = null;
            if (logo && logo?.length) {
                base64StringLogo = await convertToBase64(logo[0]);
                fileExtensionLogo = getFileExtension(logo[0].name);
            }
            if (bg && bg?.length) {
                base64StringBg = await convertToBase64(bg[0]);
                fileExtensionBg = getFileExtension(bg[0].name);
            }

            await atualizar.mutateAsync({
                id: data.id,
                data: {
                    ...data,
                    logo: logo
                        ? {
                              base64: base64StringLogo,
                              extensao: fileExtensionLogo,
                          }
                        : null,
                    bg: bg
                        ? { base64: base64StringBg, extensao: fileExtensionBg }
                        : null,
                },
            });
            toast({
                title: "Dados atualizados",
                status: "success",
                containerStyle: {
                    zIndex: 999999,
                },
                position: "bottom-right",
            });
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        buscar.mutate(usuario.imobiliariaId);
    }, [usuario]);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        multiple: false,
        onDrop(acceptedFiles, fileRejections, event) {
            setLogo(acceptedFiles);
        },
    });
    const {
        acceptedFiles: acceptedFilesBg,
        getRootProps: getRootPropsBg,
        getInputProps: getInputPropsBg,
    } = useDropzone({
        multiple: false,
        onDrop(acceptedFiles, fileRejections, event) {
            setBg(acceptedFiles);
        },
    });
    const logos = logo.map((file) => (
        <ListItem key={file.path}>
            {file.path} - {file.size} bytes
        </ListItem>
    ));
    const bgs = bg.map((file) => (
        <ListItem key={file.path}>
            {file.path} - {file.size} bytes
        </ListItem>
    ));
    const tabIndex = (value) => {
        switch (value) {
            case "dados":
                return 0;
            case "contato":
                return 1;
            case "endereco":
                return 2;
            case "envio":
                return 3;
            case "segundaVia":
                return 4;
            case "fichas":
                return 5;
            default:
                return 0;
        }
    };
    useEffect(() => {
        if (router.query.tab) {
            setTab(tabIndex(router.query.tab));
        }
    }, [router.query]);
    return (
        <>
            <Layout title="Configurações">
                <Box p={5}>
                    <Box p={5}>
                        <Tabs
                            size="sm"
                            colorScheme="blue"
                            index={tab}
                            onChange={setTab}
                            variant="solid-rounded"
                        >
                            <TabList>
                                <Tab value="dados">Dados</Tab>
                                <Tab value="envio">Envio</Tab>
                                <Tab value="segundaVia">2º Via de boletos</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel px={0}>
                                    <Flex
                                        flexDir="column"
                                        gap={4}
                                        as="form"
                                        id="formImobiliaria"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <Box bg="white" p={4}>
                                            <Flex
                                                align="center"
                                                justify="space-between"
                                                mb={4}
                                            >
                                                <Box>
                                                    <Heading size="md">
                                                        Dados da Imobiliária
                                                    </Heading>
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray"
                                                    >
                                                        Informe os dados
                                                        cadastrais da
                                                        imobiliária
                                                    </Text>
                                                </Box>
                                                <Button
                                                    type="submit"
                                                    isLoading={isSubmitting}
                                                    size="sm"
                                                    form="formImobiliaria"
                                                    colorScheme="blue"
                                                >
                                                    Salvar
                                                </Button>
                                            </Flex>
                                            <Grid gap={5}>
                                                <GridItem>
                                                    <Grid gridTemplateColumns="repeat(2,1fr)">
                                                        <GridItem
                                                            as={Flex}
                                                            align="center"
                                                        >
                                                            <Text>
                                                                Razão Social
                                                            </Text>
                                                        </GridItem>
                                                        <GridItem>
                                                            <FormInput
                                                                size="sm"
                                                                placeholder="digite a razão social..."
                                                                bg="white"
                                                                {...register(
                                                                    "razaoSocial"
                                                                )}
                                                                error={
                                                                    errors
                                                                        .razaoSocial
                                                                        ?.message
                                                                }
                                                            />
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                                <GridItem>
                                                    <Grid gridTemplateColumns="repeat(2,1fr)">
                                                        <GridItem
                                                            as={Flex}
                                                            align="center"
                                                        >
                                                            <Text>
                                                                Nome Fantasia
                                                            </Text>
                                                        </GridItem>
                                                        <GridItem>
                                                            <FormInput
                                                                size="sm"
                                                                placeholder="digite o nome fantasia..."
                                                                bg="white"
                                                                {...register(
                                                                    "nomeFantasia"
                                                                )}
                                                                error={
                                                                    errors
                                                                        .nomeFantasia
                                                                        ?.message
                                                                }
                                                            />
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                                <GridItem>
                                                    <Grid gridTemplateColumns="repeat(2,1fr)">
                                                        <GridItem
                                                            as={Flex}
                                                            align="center"
                                                        >
                                                            <Text>CNPJ </Text>
                                                        </GridItem>
                                                        <GridItem>
                                                            <FormInput
                                                                size="sm"
                                                                placeholder="digite o CNPJ..."
                                                                bg="white"
                                                                {...register(
                                                                    "cnpj"
                                                                )}
                                                                error={
                                                                    errors.cnpj
                                                                        ?.message
                                                                }
                                                            />
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                                <GridItem>
                                                    <Grid gridTemplateColumns="repeat(2,1fr)">
                                                        <GridItem
                                                            as={Flex}
                                                            align="center"
                                                        >
                                                            <Text>
                                                                Inscrição
                                                                Estadual{" "}
                                                            </Text>
                                                        </GridItem>
                                                        <GridItem>
                                                            <FormInput
                                                                size="sm"
                                                                placeholder="digite a sua inscrição estadual..."
                                                                bg="white"
                                                                {...register(
                                                                    "ie"
                                                                )}
                                                                error={
                                                                    errors.ie
                                                                        ?.message
                                                                }
                                                            />
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                            </Grid>

                                            <Grid gridTemplateColumns="repeat(2,1fr)">
                                                <GridItem
                                                    as={Flex}
                                                    align="center"
                                                >
                                                    <Text>Logo</Text>
                                                </GridItem>
                                                <GridItem>
                                                    {watch("logo") && (
                                                        <Box pos="relative">
                                                            <IconButton
                                                                top={0}
                                                                colorScheme="red"
                                                                pos="absolute"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiTrash
                                                                        }
                                                                    />
                                                                }
                                                                zIndex={0}
                                                                onClick={() => {
                                                                    setValue(
                                                                        "removerlogo",
                                                                        true
                                                                    );
                                                                    setValue(
                                                                        "logo",
                                                                        null
                                                                    );
                                                                }}
                                                            />
                                                            <Image
                                                                src={watch(
                                                                    "logo"
                                                                )}
                                                            />
                                                        </Box>
                                                    )}
                                                    <Flex
                                                        mt={4}
                                                        p={12}
                                                        borderWidth={2}
                                                        borderStyle="dashed"
                                                        align="center"
                                                        {...getRootProps({
                                                            className:
                                                                "dropzone",
                                                        })}
                                                        justify="center"
                                                    >
                                                        <input
                                                            {...getInputProps()}
                                                        />
                                                        <Text color="gray">
                                                            Arraste o arquivo ou
                                                            clique aqui
                                                        </Text>
                                                    </Flex>
                                                    <Box mt={4}>
                                                        <List>{logos}</List>
                                                    </Box>
                                                </GridItem>
                                                <GridItem
                                                    as={Flex}
                                                    align="center"
                                                >
                                                    <Text>
                                                        Background Login
                                                    </Text>
                                                </GridItem>
                                                <GridItem>
                                                    {watch("bg") && (
                                                        <Box pos="relative">
                                                            <IconButton
                                                                top={0}
                                                                colorScheme="red"
                                                                pos="absolute"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiTrash
                                                                        }
                                                                    />
                                                                }
                                                                zIndex={0}
                                                                onClick={() => {
                                                                    setValue(
                                                                        "removerBg",
                                                                        true
                                                                    );
                                                                    setValue(
                                                                        "bg",
                                                                        null
                                                                    );
                                                                }}
                                                            />
                                                            <Image
                                                                src={watch(
                                                                    "bg"
                                                                )}
                                                            />
                                                        </Box>
                                                    )}
                                                    <Flex
                                                        mt={4}
                                                        p={12}
                                                        borderWidth={2}
                                                        borderStyle="dashed"
                                                        align="center"
                                                        {...getRootPropsBg({
                                                            className:
                                                                "dropzone",
                                                        })}
                                                        justify="center"
                                                    >
                                                        <input
                                                            {...getInputPropsBg()}
                                                        />
                                                        <Text color="gray">
                                                            Arraste o arquivo ou
                                                            clique aqui
                                                        </Text>
                                                    </Flex>
                                                    <Box mt={4}>
                                                        <List>{bgs}</List>
                                                    </Box>
                                                </GridItem>
                                            </Grid>
                                        </Box>
                                        <Box>
                                            <Box bg="white" p={5}>
                                                <Flex
                                                    align="center"
                                                    justify="space-between"
                                                    mb={4}
                                                >
                                                    <Box>
                                                        <Heading size="md">
                                                            Contato
                                                        </Heading>
                                                        <Text
                                                            fontSize="sm"
                                                            color="gray"
                                                        >
                                                            Informe os dados de
                                                            contato
                                                        </Text>
                                                    </Box>
                                                    <Button
                                                        type="submit"
                                                        isLoading={isSubmitting}
                                                        size="sm"
                                                        form="formImobiliaria"
                                                        colorScheme="blue"
                                                    >
                                                        Salvar
                                                    </Button>
                                                </Flex>
                                                <Grid
                                                    gap={5}
                                                    templateColumns={{
                                                        sm: "repeat(1, 1fr)",
                                                        md: "repeat(2, 1fr)",
                                                        lg: "repeat(3, 1fr)",
                                                    }}
                                                >
                                                    <GridItem>
                                                        <FormInput
                                                            label="Email para contato"
                                                            placeholder="digite o email para o contato..."
                                                            bg="white"
                                                            {...register(
                                                                "email"
                                                            )}
                                                            error={
                                                                errors.email
                                                                    ?.message
                                                            }
                                                        />
                                                    </GridItem>
                                                    <GridItem>
                                                        <FormInput
                                                            label="Site"
                                                            placeholder="endereço do seu site..."
                                                            bg="white"
                                                            {...register(
                                                                "site"
                                                            )}
                                                            error={
                                                                errors.site
                                                                    ?.message
                                                            }
                                                        />
                                                    </GridItem>
                                                    <GridItem>
                                                        <FormInput
                                                            label="Telefone"
                                                            placeholder="ex: (99) 99999-9999..."
                                                            bg="white"
                                                            {...register(
                                                                "telefone"
                                                            )}
                                                            error={
                                                                errors.telefone
                                                                    ?.message
                                                            }
                                                        />
                                                    </GridItem>
                                                </Grid>
                                            </Box>
                                        </Box>{" "}
                                        <Box>
                                            <Box bg="white" p={5}>
                                                <Flex
                                                    align="center"
                                                    justify="space-between"
                                                    mb={4}
                                                >
                                                    <Box>
                                                        <Heading size="md">
                                                            Endereço
                                                        </Heading>
                                                        <Text
                                                            fontSize="sm"
                                                            color="gray"
                                                        >
                                                            Informe o endereço
                                                            da imobiliária
                                                        </Text>
                                                    </Box>
                                                    <Button
                                                        type="submit"
                                                        isLoading={isSubmitting}
                                                        size="sm"
                                                        form="formImobiliaria"
                                                        colorScheme="blue"
                                                    >
                                                        Salvar
                                                    </Button>
                                                </Flex>
                                                <Grid
                                                    gap={5}
                                                    templateColumns={{
                                                        sm: "repeat(1, 1fr)",
                                                        md: "repeat(2, 1fr)",
                                                        lg: "repeat(3, 1fr)",
                                                    }}
                                                >
                                                    <GridItem>
                                                        <FormInput
                                                            label="CEP"
                                                            placeholder="ex: 13-386-092..."
                                                            bg="white"
                                                            {...register("cep")}
                                                            error={
                                                                errors.cep
                                                                    ?.message
                                                            }
                                                        />
                                                    </GridItem>
                                                    <GridItem>
                                                        <FormInput
                                                            label="Rua"
                                                            placeholder="digite o nome da rua..."
                                                            bg="white"
                                                            {...register(
                                                                "endereco"
                                                            )}
                                                            error={
                                                                errors.endereco
                                                                    ?.message
                                                            }
                                                        />
                                                    </GridItem>
                                                    <GridItem>
                                                        <FormInput
                                                            label="Número"
                                                            placeholder="digite o número da casa..."
                                                            bg="white"
                                                            {...register(
                                                                "numero"
                                                            )}
                                                            error={
                                                                errors.numero
                                                                    ?.message
                                                            }
                                                        />
                                                    </GridItem>
                                                    <GridItem>
                                                        <FormInput
                                                            label="Bairro"
                                                            placeholder="digite o nome do bairro..."
                                                            bg="white"
                                                            {...register(
                                                                "bairro"
                                                            )}
                                                            error={
                                                                errors.bairro
                                                                    ?.message
                                                            }
                                                        />
                                                    </GridItem>
                                                    <GridItem>
                                                        <FormInput
                                                            label="Cidade"
                                                            placeholder="digite o nome da cidade..."
                                                            bg="white"
                                                            {...register(
                                                                "cidade"
                                                            )}
                                                            error={
                                                                errors.cidade
                                                                    ?.message
                                                            }
                                                        />
                                                    </GridItem>
                                                    <GridItem>
                                                        <FormInput
                                                            label="Estado"
                                                            placeholder="digite o nome do estado..."
                                                            bg="white"
                                                            {...register(
                                                                "estado"
                                                            )}
                                                            error={
                                                                errors.estado
                                                                    ?.message
                                                            }
                                                        />
                                                    </GridItem>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </Flex>
                                </TabPanel>
                                <TabPanel>
                                    <Envio />
                                </TabPanel>
                                <TabPanel px={0}>
                                    <Flex
                                        flexDir="column"
                                        gap={4}
                                        as="form"
                                        id="formImobiliaria"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <Box bg="white" p={4}>
                                            <Flex
                                                align="center"
                                                justify="space-between"
                                                mb={4}
                                            >
                                                <Box>
                                                    <Heading size="md">
                                                        2ª Via de Boletos
                                                    </Heading>
                                                </Box>
                                                <Button
                                                    type="submit"
                                                    isLoading={isSubmitting}
                                                    size="sm"
                                                    form="formImobiliaria"
                                                    colorScheme="blue"
                                                >
                                                    Salvar
                                                </Button>
                                            </Flex>
                                            <Grid gap={5}>
                                                <GridItem>
                                                    <Grid gridTemplateColumns="repeat(2,1fr)">
                                                        <GridItem>
                                                            <Text
                                                                fontWeight="bold"
                                                                fontSize="sm"
                                                            >
                                                                Disponibilidade
                                                                para download
                                                            </Text>
                                                            <Text
                                                                fontSize="xs"
                                                                color="gray"
                                                            >
                                                                Quantos dias o
                                                                boleto ficará
                                                                disponível para
                                                                download após o
                                                                vencimento?
                                                            </Text>
                                                        </GridItem>
                                                        <GridItem>
                                                            <FormInput
                                                                size="sm"
                                                                placeholder="Informe a quantidade de dias para download do boleto..."
                                                                bg="white"
                                                                {...register(
                                                                    "diasDownloadBoleto"
                                                                )}
                                                                error={
                                                                    errors
                                                                        .razaoSocial
                                                                        ?.message
                                                                }
                                                            />
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>
                                            </Grid>
                                        </Box>
                                    </Flex>
                                </TabPanel>
                                <TabPanel>
                                    <FichasCadastrais />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </Box>
            </Layout>
        </>
    );
};
export default Configuracoes;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
