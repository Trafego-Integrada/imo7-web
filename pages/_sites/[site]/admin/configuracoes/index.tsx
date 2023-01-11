import {
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    GridItem,
    Heading,
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
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "react-query";
import { show, update } from "@/services/models/imobiliaria";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
const schema = yup.object().shape({
    razaoSocial: yup.string().required("Campo obrigatório"),
    nomeFantasia: yup.string().required("Campo obrigatório"),
    cnpj: yup.string().required("Campo obrigatório"),
});
const Configuracoes = () => {
    const [logo, setLogo] = useState([]);
    const [bg, setBg] = useState([]);
    const toast = useToast();
    const { usuario } = useAuth();
    const {
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
    return (
        <>
            <Layout title="Configurações">
                <Box as="form" onSubmit={handleSubmit(onSubmit)} p={5}>
                    <Flex justifyContent="flex-end" gap={3}>
                        <Button
                            colorScheme="blue"
                            isLoading={isSubmitting}
                            type="submit"
                        >
                            Atualizar
                        </Button>
                    </Flex>
                    <Box bg="graylight" p={5}>
                        <Tabs size="md" variant="enclosed">
                            <TabList>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "bluelight",
                                    }}
                                >
                                    Dados
                                </Tab>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "bluelight",
                                    }}
                                >
                                    Contato
                                </Tab>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "bluelight",
                                    }}
                                >
                                    Endereço
                                </Tab>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "bluelight",
                                    }}
                                >
                                    Envio
                                </Tab>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "bluelight",
                                    }}
                                >
                                    2º Via de boletos
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        >
                                            Detalhes da conta
                                        </Text>
                                        <Box bg="white" p={5}>
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
                                                        label="Razão Social"
                                                        placeholder="digite a razão social..."
                                                        bg="white"
                                                        {...register(
                                                            "razaoSocial"
                                                        )}
                                                        error={
                                                            errors.razaoSocial
                                                                ?.message
                                                        }
                                                    />
                                                </GridItem>
                                                <GridItem>
                                                    <FormInput
                                                        label="Nome Fantasia"
                                                        placeholder="digite o nome fantasia..."
                                                        bg="white"
                                                        {...register(
                                                            "nomeFantasia"
                                                        )}
                                                        error={
                                                            errors.razaoSocial
                                                                ?.message
                                                        }
                                                    />
                                                </GridItem>
                                                <GridItem>
                                                    <FormInput
                                                        label="CNPJ"
                                                        placeholder="digite o CNPJ..."
                                                        bg="white"
                                                        {...register("cnpj")}
                                                        error={
                                                            errors.cnpj?.message
                                                        }
                                                    />
                                                </GridItem>
                                                <GridItem>
                                                    <FormInput
                                                        label="IE"
                                                        placeholder="digite a sua inscrição estadual..."
                                                        bg="white"
                                                        {...register("ie")}
                                                        error={
                                                            errors.ie?.message
                                                        }
                                                    />
                                                </GridItem>
                                            </Grid>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        ></Text>
                                        <Box bg="white" p={5}>
                                            <Grid gridTemplateColumns="repeat(2,1fr)">
                                                <GridItem>Logo</GridItem>
                                                <GridItem>
                                                    {watch("logo") && (
                                                        <Image
                                                            src={watch("logo")}
                                                        />
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
                                                <GridItem>
                                                    Background Login
                                                </GridItem>
                                                <GridItem>
                                                    {watch("bg") && (
                                                        <Image
                                                            src={watch("bg")}
                                                        />
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
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        >
                                            Informações contato
                                        </Text>
                                        <Box bg="white" p={5}>
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
                                                        {...register("email")}
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
                                                        {...register("site")}
                                                        error={
                                                            errors.site?.message
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
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        >
                                            Informações do endereço
                                        </Text>
                                        <Box bg="white" p={5}>
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
                                                            errors.cep?.message
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
                                                        {...register("numero")}
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
                                                        {...register("bairro")}
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
                                                        {...register("cidade")}
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
                                                        {...register("estado")}
                                                        error={
                                                            errors.estado
                                                                ?.message
                                                        }
                                                    />
                                                </GridItem>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        >
                                            Informações de envio
                                        </Text>
                                        <Box bg="white" p={5}>
                                            <Checkbox size="lg">
                                                Enviar e-mail?
                                            </Checkbox>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        >
                                            Configurações dos boletos
                                        </Text>
                                        <Box bg="white" p={5}>
                                            <Grid
                                                d="flex"
                                                alignItems="flex-end"
                                                gap={5}
                                                templateColumns={{
                                                    sm: "repeat(1, 1fr)",
                                                    md: "repeat(2, 1fr)",
                                                    lg: "repeat(3, 1fr)",
                                                }}
                                            >
                                                <GridItem w="100%">
                                                    <FormInput
                                                        label='Deixar o boleto disponível para download por quantos dias após a data "não receber após"?'
                                                        placeholder="ex: 5..."
                                                        bg="white"
                                                    />
                                                </GridItem>
                                                <GridItem w="100%">
                                                    <FormInput
                                                        label="E-mail de envio (* Configurar no SMTP)"
                                                        placeholder="ex dev@trafegointegrada.com.br..."
                                                        bg="white"
                                                    />
                                                </GridItem>
                                                <GridItem w="100%">
                                                    <FormInput
                                                        label="Email de resposta"
                                                        placeholder="ex dev@trafegointegrada.com.br..."
                                                        bg="white"
                                                    />
                                                </GridItem>
                                            </Grid>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        >
                                            Configurações dos extratos
                                        </Text>
                                        <Box bg="white" p={5}>
                                            <Grid
                                                d="flex"
                                                alignItems="flex-end"
                                                gap={5}
                                                templateColumns={{
                                                    sm: "repeat(1, 1fr)",
                                                    md: "repeat(2, 1fr)",
                                                    lg: "repeat(3, 1fr)",
                                                }}
                                            >
                                                <GridItem w="100%">
                                                    <FormInput
                                                        label="Assunto dos emails"
                                                        placeholder="digite o assunto que ira aparecer..."
                                                        bg="white"
                                                    />
                                                </GridItem>
                                                <GridItem w="100%">
                                                    <FormInput
                                                        label="E-mail de envio (* Configurar no SMTP)"
                                                        placeholder="ex dev@trafegointegrada.com.br..."
                                                        bg="white"
                                                    />
                                                </GridItem>
                                                <GridItem w="100%">
                                                    <FormInput
                                                        label="Email de resposta"
                                                        placeholder="ex dev@trafegointegrada.com.br..."
                                                        bg="white"
                                                    />
                                                </GridItem>
                                            </Grid>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        >
                                            Configurações dos relatórios
                                        </Text>
                                        <Box bg="white" p={5}>
                                            <FormInput
                                                label="Email que recebem os relátorios (separados por vírgula)"
                                                placeholder="dev@trafegointegrada.com.br;"
                                                bg="white"
                                            />
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Text
                                            mb={5}
                                            mt={5}
                                            fontSize="2xl"
                                            fontWeight="500"
                                        >
                                            Acesso
                                        </Text>
                                        <Box bg="white" p={5}>
                                            <FormInput
                                                label="Url de acesso"
                                                bg="white"
                                                {...register("url")}
                                                error={errors.url?.message}
                                            />
                                        </Box>
                                    </Box>
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
