import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { FichasCadastrais } from "@/components/Pages/Admin/Configuracoes/FichasCadastrais";
import { useAuth } from "@/hooks/useAuth";
import { show, update } from "@/services/models/imobiliaria";
import { withSSRAuth } from "@/utils/withSSRAuth";
import {
    Box,
    Button,
    Checkbox,
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
import { Envio } from "./envio";
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
            const formData = new FormData();
            Object.entries(data).map((i) => formData.append(i[0], i[1]));
            if (logos) formData.append("logo", logo[0]);
            if (bgs) formData.append("bg", bg[0]);
            await atualizar.mutateAsync({ id: data.id, data: formData });
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
    console.log(router);
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
                                <Tab value="fichas">Fichas Cadastrais</Tab>
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
                                                    id="formImobiliaria"
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
                                                        id="formImobiliaria"
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
                                                        id="formImobiliaria"
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

                                <TabPanel>
                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        >
                                            Regras para emissão de 2º Via
                                            boletos
                                        </Text>
                                        <Box bg="white" p={5}>
                                            <FormSelect
                                                bg="white"
                                                label="Tipo de emissão"
                                                placeholder="selecione..."
                                            >
                                                <option value="">
                                                    Utilizando CPF & Nº contrato
                                                </option>
                                            </FormSelect>
                                        </Box>
                                    </Box>
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
