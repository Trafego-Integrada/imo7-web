import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Head } from "@/components/Head";
import {
    convertToBase64,
    formatoValor,
    getFileExtension,
    verificarExtensaoImagem,
} from "@/helpers/helpers";
import { redirectToErrorPage } from '@/utils/redirectToErrorPage';
import { buscarEndereco } from "@/lib/buscarEndereco";
import prisma from "@/lib/prisma";
import {
    atualizarAnexosFicha,
    atualizarFicha,
    buscarFicha,
    excluirAnexoFicha,
} from "@/services/models/public/fichaCadastral";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Checkbox,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Progress,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Tab,
    TabList,
    Tabs,
    Tag,
    Text,
    Tooltip,
    useSteps,
    useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    FiAlertTriangle,
    FiFile,
    FiPlus,
    FiTrash,
    FiTrash2,
    FiUpload,
} from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useMutation } from "react-query";
import "react-quill/dist/quill.snow.css";

import { ModalPreview } from "@/components/Modals/Preview";
import { GetServerSideProps } from "next";
import { FileUpload } from "primereact/fileupload";
import { BiSave } from "react-icons/bi";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { totalFields, totalRequiredFields } from "@/utils/registerFormFieldsAuxiliar";
function validateCPF(value) {
    // Remove caracteres não numéricos
    const cleanedCPF = value.replace(/\D/g, "");

    // Verifica se o CPF possui 11 dígitos
    if (cleanedCPF.length !== 11) {
        return false;
    }

    // Verifica se todos os dígitos são iguais, o que invalida o CPF
    if (/^(\d)\1+$/.test(cleanedCPF)) {
        return false;
    }

    // Calcula os dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanedCPF.charAt(i)) * (10 - i);
    }

    let mod = sum % 11;
    const firstDigit = mod < 2 ? 0 : 11 - mod;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanedCPF.charAt(i)) * (11 - i);
    }

    mod = sum % 11;
    const secondDigit = mod < 2 ? 0 : 11 - mod;

    // Verifica se os dígitos verificadores são válidos
    if (
        parseInt(cleanedCPF.charAt(9)) !== firstDigit ||
        parseInt(cleanedCPF.charAt(10)) !== secondDigit
    ) {
        return false;
    }

    return true;
}

function Previews(props) {
    const preview = useRef();
    const buscar = useMutation(buscarFicha);
    const toast = useToast(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast({
            status: "info",
            title: "File Uploaded",
            position: "top-right",
        });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size < 0 ? 0 : totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 100000;
        const formatedValue =
            fileUploadRef && fileUploadRef.current
                ? fileUploadRef.current.formatSize(totalSize)
                : "0 B";

        return (
            <Flex
                alignItems="center"
                justify="space-between"
                flexDir="row"
                gap={2}
            >
                <Flex gap={4}>
                    {chooseButton}
                    {uploadButton}
                    {cancelButton}
                </Flex>
                <Flex align="center" flexDir="column" gap={1} ml="auto">
                    <Text fontSize="xs">{formatedValue} / 100 MB</Text>
                    <Progress
                        value={value}
                        max={100}
                        hasStripe
                        rounded="full"
                        w={44}
                    />
                </Flex>
            </Flex>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <Flex
                align="center"
                justify="space-between"
                flexWrap="wrap"
                pos="relative"
            >
                <Flex align="center">
                    <Image
                        alt={file.name}
                        role="presentation"
                        src={file.objectURL}
                        w={44}
                        h={44}
                        rounded="lg"
                    />
                </Flex>
                <Box as="span" flexDir="column" textAlign="center">
                    <Text fontSize="xs">{file.name}</Text>
                    <Tag size="sm" colorScheme="orange">
                        {props.formatSize}
                    </Tag>
                </Box>

                <IconButton
                    top={0}
                    right={0}
                    size="sm"
                    pos="absolute"
                    colorScheme="red"
                    variant="outline"
                    icon={<MdClose />}
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </Flex>
        );
    };

    const emptyTemplate = () => {
        return (
            <Flex align="center" flexDir="column" p={4}>
                <Icon as={FiFile} fontSize="2em" color="gray" />
                <Text fontSize="sm" color="gray">
                    Arraste e solte aqui
                </Text>
            </Flex>
        );
    };

    const atualizarAnexos = useMutation(atualizarAnexosFicha, {
        onSuccess: () => {
            props.buscar();
        },
    });
    const excluirAnexo = useMutation(excluirAnexoFicha, {
        onSuccess: () => {
            toast({
                title: "Arquivo excluído com sucesso",
                position: "top-right",
            });
            props.buscar();
        },
    });
    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        if (event.options?.props?.multiple) {
            const files = event.files;
            toast({
                title: "Upload sendo realizado, aguarde...",
                position: "top-right",
                status: "info",
            });
            for await (const item of files) {
                const base64String = await convertToBase64(item);
                const fileExtension = getFileExtension(item.name);

                await atualizarAnexos.mutateAsync(
                    {
                        id: props.id,
                        formData: {
                            arquivos: [
                                {
                                    nome: props.codigo,
                                    extensao: fileExtension,
                                    base64: base64String,
                                },
                            ],
                        },
                    },
                    {
                        onSuccess: () => {
                            toast({
                                title: "Upload realizado com sucesso",
                                position: "top-right",
                                status: "success",
                            });
                            props.buscar();
                            event.options.clear();
                        },
                    }
                );
            }
            setTimeout(() => {
                props.buscar();
            }, 1000);
        } else {
            const file = event.files[0];

            const base64String = await convertToBase64(file);
            const fileExtension = getFileExtension(file.name);

            await atualizarAnexos.mutateAsync(
                {
                    id: props.id,
                    formData: {
                        arquivos: [
                            {
                                nome: props.codigo,
                                extensao: fileExtension,
                                base64: base64String,
                            },
                        ],
                    },
                },
                {
                    onSuccess: () => {
                        toast({
                            title: "Upload realizado com sucesso",
                            position: "top-right",
                        });
                        event.options.clear();
                    },
                }
            );
        }
        setTimeout(() => {
            props.buscar();
        }, 1000);
    };
    return (
        <Flex
            flexDir="column"
            gap={4}
            borderWidth={props.error ? 3 : 1}
            p={4}
            rounded="lg"
            w="full"
            borderColor={props.error ? "red" : ""}
        >
            <Text fontSize="sm" fontWeight="medium">
                {props.nome}
            </Text>
            <FileUpload
                ref={fileUploadRef}
                nome={props.codigo}
                id={props.id}
                customUpload
                multiple={props.multiple}
                maxFileSize={100000000}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                uploadHandler={customBase64Uploader}
                mode="advanced"
                auto
                uploadOptions={{
                    icon: (
                        <Tooltip label="Upload">
                            <IconButton icon={<FiUpload />} />
                        </Tooltip>
                    ),
                    iconOnly: true,
                }}
                chooseOptions={{
                    icon: (props) => (
                        <Tooltip label="Selecionar arquivo">
                            <IconButton icon={<FiPlus />} {...props} />
                        </Tooltip>
                    ),
                    iconOnly: true,
                }}
                cancelOptions={{
                    icon: (
                        <Tooltip label="Cancelar">
                            <IconButton icon={<MdClose />} />
                        </Tooltip>
                    ),
                    iconOnly: true,
                }}
            />
            {props.data && (
                <Flex flexDir="column" gap={1}>
                    <Text fontSize="sm">Arquivos anexados</Text>
                    <Flex flexDir="row" gap={1} wrap="wrap">
                        {JSON.parse(props.data).map((item) => (
                            <Box pos="relative" key={item}>
                                <Popover>
                                    <PopoverTrigger>
                                        <IconButton
                                            icon={<FiTrash />}
                                            colorScheme="red"
                                            size="xs"
                                            pos="absolute"
                                            top={0}
                                            right={0}
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>
                                            Confirmação!
                                        </PopoverHeader>
                                        <PopoverBody>
                                            Deseja realmente excluir este
                                            arquivo? Não será possivel reverter
                                        </PopoverBody>
                                        <PopoverFooter>
                                            <Button
                                                size="xs"
                                                colorScheme="red"
                                                leftIcon={<FiTrash2 />}
                                                onClick={() =>
                                                    excluirAnexo.mutate({
                                                        id: props.id,
                                                        params: {
                                                            ...props,
                                                            arquivo: item,
                                                        },
                                                    })
                                                }
                                            >
                                                Excluir
                                            </Button>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </Popover>

                                {verificarExtensaoImagem(item).eImagem ? (
                                    <Image
                                        src={item}
                                        w={32}
                                        h={32}
                                        cursor="pointer"
                                        onClick={() =>
                                            preview.current.onOpen(item)
                                        }
                                    />
                                ) : (
                                    <Flex
                                        align="center"
                                        justify="center"
                                        h={32}
                                        w={32}
                                        bg="gray.700"
                                        cursor="pointer"
                                        onClick={() =>
                                            preview.current.onOpen(item)
                                        }
                                    >
                                        <Text color="white" fontSize="lg">
                                            {verificarExtensaoImagem(
                                                item
                                            ).extensao?.toLocaleUpperCase()}
                                        </Text>
                                    </Flex>
                                )}
                            </Box>
                        ))}
                    </Flex>
                </Flex>
            )}
            {props.error && (
                <Alert status="error" rounded="lg">
                    <AlertIcon />
                    <AlertTitle>{props.error}</AlertTitle>
                </Alert>
            )}
            <ModalPreview ref={preview} />
        </Flex>
    );
}

const FichaCadastral = ({ ficha, campos, modelo }) => {
    const [schema, setSchema] = useState({});
    const toast = useToast();
    const {
        control,
        reset,
        watch,
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        clearErrors,
        setError,
    } = useForm({
        defaultValues: {
            ...ficha,
        },
    });
    const buscar = useMutation(buscarFicha, {
        onSuccess: (data) => {
            reset(data);
        },
    });
    const atualizar = useMutation(atualizarFicha);
    const atualizarAnexos = useMutation(atualizarAnexosFicha); // Função para converter arquivo para base64
    console.log(watch());
    console.error("Erros", errors);

    const onFormSave = async (data: any) => {
        try {
            await atualizar.mutateAsync(data);

            toast({
                title: "Ficha salva",
                status: "success",
                position: "top-right",
            });
        } catch (e) {
            //console.log(e);
            toast({
                title: "Houve um problema",
                description: e.response?.data?.message,
                status: "error",
                position: "top-right",
            });
        }
    }

    const onSubmit = async (data: any) => {
        // Mapear campos e setar erros se não estiverem preenchidos

        if (activeStep != totalFields(campos, modelo, watch).length
        ) {
            setActiveStep(activeStep + 1);
        } else {
            const checkPreenchimento = await verificarPreenchimento()
            if (checkPreenchimento) {
                data = { ...data, status: "preenchida" };
                toast({
                    title: "Ficha preenchida e enviada",
                    position: "top-right",
                });
            }
        }
        
        await onFormSave(data);
    };

    const onSubmitIgnorandoErros = async (data) => {
        //console.log("veio aqui");
        try {
            //console.log("veio aqui");
            await atualizar.mutateAsync(data);

            toast({
                title: "Ficha salva automaticamente",
                status: "success",
                position: "top-right",
            });
        } catch (e) {
            //console.log(e);
            toast({
                title: "Houve um problema",
                description: e.response?.data?.message,
                status: "error",
                position: "top-right",
            });
        }
    };

    const buscarEnderecoPorCep = async (cep, camposEndereco) => {
        try {
            if (cep.length > 8) {
                const res = await buscarEndereco(cep);
                //console.log(res);
                let obj = {};
                Object.entries(camposEndereco).map((item) => {
                    if (item[0] == "endereco") {
                        obj[item[1].codigo] = res.logradouro;
                    } else if (item[0] == "bairro") {
                        obj[item[1].codigo] = res.bairro;
                    } else if (item[0] == "cidade") {
                        obj[item[1].codigo] = res.cidade;
                    } else if (item[0] == "estado") {
                        obj[item[1].codigo] = res.uf;
                    }
                });
                reset({
                    ...watch(),
                    preenchimento: {
                        ...watch("preenchimento"),
                        ...obj,
                    },
                });
            }
        } catch (e) {
            toast({
                title: "Endereço não encontrado",
                status: "warning",
                position: "top-right",
            });
        }
    };
    const { activeStep, setActiveStep, isIncompleteStep } = useSteps({
        index: 0,
        count: campos?.filter((i) =>
            i.campos.find((e) => modelo?.campos[e.codigo]?.exibir)
        ).length,
    });

    const verificarPreenchimento = async () => {
        var retorno = true;
        await Promise.all(
            campos.map((grupo) => {
                grupo.campos
                    .filter((i) =>
                        ["image", "file", "files"].includes(i.tipoCampo)
                    )
                    .map((campo) => {
                        console.log(JSON.stringify({
                            campo
                        }))
                        if (
                            modelo.campos[campo.codigo]?.obrigatorio &&
                            (!watch(`preenchimento.${campo.codigo}`) ||
                                (Array.isArray(
                                    watch(`preenchimento.${campo.codigo}`)
                                ) &&
                                    watch(`preenchimento.${campo.codigo}`)
                                        .length == 0)
                            )
                        ) {
                            retorno = false;
                            setError(`preenchimento.${campo.codigo}`, {
                                type: "custom",
                                message: `${campo.nome} - Campo obrigatório`,
                            });
                        }
                    });
            })
        );

        return retorno;
    };
    const onError = async (data) => {
        console.log("Adicionado");
        if (
            activeStep != totalFields(campos, modelo, watch).length
        ) {
            clearErrors();
            setActiveStep(activeStep + 1);
            await onFormSave(watch());
        } else {
            const checkPreenchimento = await verificarPreenchimento();
            if (checkPreenchimento) await onFormSave(watch());
        }
        return;
    };
    /*const totalRequiredFilled = () => {
        return campos.filter((item) => {
            return item.campos.find((element) => 
                item.campos.find(
                        (element) => modelo?.campos[element.codigo]?.exibir
                ) &&
                    //FLAG Elzio Lima
                item.campos.filter((item) => {
                    if ((modelo.campos[item.codigo] &&
                        modelo?.campos[item.codigo]?.exibir &&
                        !item.dependencia) ||
                        (modelo.campos[item.codigo] &&
                        modelo?.campos[item.codigo]?.exibir &&
                            ((item.dependencia?.codigo &&
                            !item.dependenciaValor &&
                            watch(`preenchimento.${item.dependencia?.codigo}`)) ||
                            (item.dependencia?.codigo &&
                            item.dependenciaValor &&
                            JSON.parse(item.dependenciaValor).includes(
                                watch(
                                    `preenchimento.${item.dependencia?.codigo}`
                                )
                            ))))
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }).length > 0
            )
        }).length
    }*/

    return (
        <Box
            bg="gray.100"
            minH="100vh"
            as="form"
            onSubmit={handleSubmit(onSubmit, onError)}
        >
            <Head
                title={ficha?.nome}
                description={`${modelo.nome} - ${modelo.descricao}`}
            />
            <Container maxW="container.xl">
                <Flex
                    align="center"
                    py={6}
                    gap={6}
                    flexDir={{ base: "row", lg: "row" }}
                >
                    <Box>
                        <Image
                            h={100}
                            objectFit="contain"
                            src={ficha.imobiliaria.logo}
                        />
                    </Box>
                    <Box>
                        <Text fontSize={{ base: "sm", lg: "md" }}>
                            <Text as="span" fontWeight="bold">
                                {ficha.imobiliaria.razaoSocial}
                            </Text>{" "}
                            • CNPJ: {ficha.imobiliaria.cnpj}
                        </Text>
                        <Text fontSize={{ base: "xx-small", lg: "sm" }}>
                            {ficha.imobiliaria.endereco}
                            {ficha.imobiliaria.numero &&
                                ` nº ${ficha.imobiliaria.numero}`}
                            ,{ficha.imobiliaria.bairro},
                            {ficha.imobiliaria.cidade}/
                            {ficha.imobiliaria.estado} - CEP:{" "}
                            {ficha.imobiliaria.cep}
                        </Text>
                        <Text fontSize={{ base: "xx-small", lg: "sm" }}>
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
                <Box py={4}>
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
                    {ficha.status != "aguardando" &&
                        ficha.status != "aprovada" &&
                        ficha.status != "reprovada" && (
                            <Alert status="info" my={2}>
                                <AlertIcon />
                                <AlertTitle>Ficha em análise</AlertTitle>
                                <AlertDescription>
                                    Não será possivel editar durante este
                                    status, caso seja necessário, entrar em
                                    contato com o administrador.
                                </AlertDescription>
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

                <Grid
                    gridTemplateColumns={{
                        base: "repeat(2,1fr)",
                        lg: "repeat(6,1fr)",
                    }}
                    gap={4}
                    my={2}
                >
                    <GridItem colSpan={{ base: 2, lg: 3 }}>
                        {ficha.imovel ? (
                            <Box p={4} bg="white">
                                <Text fontSize="sm" color="gray">
                                    Ficha referente ao imóvel:
                                </Text>
                                <Text>
                                    {ficha.imovel?.codigo} -{" "}
                                    {ficha.imovel?.endereco}, nº
                                    {ficha.imovel?.numero},
                                    {ficha?.imovel?.complemento &&
                                        ` ${ficha?.imovel?.complemento},`}{" "}
                                    {ficha.imovel?.bairro},{" "}
                                    {ficha.imovel?.cidade}/
                                    {ficha.imovel?.estado},
                                    {ficha.imovel?.estado}, CEP:{" "}
                                    {ficha.imove?.cep}
                                </Text>
                            </Box>
                        ) : ficha.codigoImovel ? (
                            <Box p={2} bg="white">
                                <Text fontSize="sm" color="gray">
                                    Ficha referente ao imóvel:
                                </Text>
                                <Text>
                                    {ficha.codigoImovel} -{" "}
                                    {ficha.enderecoImovel} nº{" "}
                                    {ficha.numeroImovel}{" "}
                                    {ficha.complementoImovel &&
                                        `(${ficha.complementoImovel})`}
                                    , {ficha.bairroImovel}, {ficha.cidadeImovel}
                                    /{ficha.estadoImovel}
                                </Text>
                            </Box>
                        ) : (
                            ""
                        )}
                    </GridItem>
                    {ficha.Processo?.campos?.find((e) => e.valor)?.valor && (
                        <GridItem p={4} bg="white">
                            <Text fontSize="sm" color="gray">
                                Valor Negociado
                            </Text>
                            <Text>
                                {
                                    ficha.Processo?.campos?.find((e) => e.valor)
                                        ?.valor
                                }
                            </Text>
                        </GridItem>
                    )}
                    {ficha.imovel?.valorAluguel && (
                        <GridItem p={4} bg="white">
                            <Text fontSize="sm" color="gray">
                                Valor Aluguel
                            </Text>
                            <Text>
                                {formatoValor(ficha.imovel?.valorAluguel)}
                            </Text>
                        </GridItem>
                    )}
                    {/* {ficha.imovel?.valorVenda && (
                        <GridItem p={4} bg="white">
                            <Text fontSize="sm" color="gray">
                                Valor Venda
                            </Text>
                            <Text>
                                {formatoValor(ficha.imovel?.valorVenda)}
                            </Text>
                        </GridItem>
                    )} */}

                    {ficha.imovel?.valorCondominio && (
                        <GridItem p={4} bg="white">
                            <Text fontSize="sm" color="gray">
                                Valor Condominio
                            </Text>
                            <Text>
                                {formatoValor(ficha.imovel?.valorCondominio)}
                            </Text>
                        </GridItem>
                    )}
                    {ficha.imovel?.valorIPTU && (
                        <GridItem p={4} bg="white">
                            <Text fontSize="sm" color="gray">
                                Valor IPTU
                            </Text>
                            <Text>{formatoValor(ficha.imovel?.valorIPTU)}</Text>
                        </GridItem>
                    )}
                </Grid>
                <Flex flexDir={{ base: "column", lg: "row" }}>
                    <Box w={{ base: "full", lg: "xs" }} overflow="auto">
                        <Stepper
                            size="xs"
                            index={activeStep}
                            orientation="vertical"
                            display={{ base: "none", lg: "flex" }}
                        >
                            {campos
                                .filter(
                                    (i) =>
                                        i.campos.find(
                                            (e) =>
                                                modelo?.campos[e.codigo]?.exibir
                                        ) &&
                                        i.campos.filter((i) => {
                                            //console.log(i);
                                            if (
                                                (modelo.campos[i.codigo] &&
                                                    modelo?.campos[i.codigo]
                                                        ?.exibir &&
                                                    !i.dependencia) ||
                                                (modelo.campos[i.codigo] &&
                                                    modelo?.campos[i.codigo]
                                                        ?.exibir &&
                                                    ((i.dependencia?.codigo &&
                                                        !i.dependenciaValor &&
                                                        watch(
                                                            `preenchimento.${i.dependencia?.codigo}`
                                                        )) ||
                                                        (i.dependencia
                                                            ?.codigo &&
                                                            i.dependenciaValor &&
                                                            JSON.parse(
                                                                i.dependenciaValor
                                                            ).includes(
                                                                watch(
                                                                    `preenchimento.${i.dependencia?.codigo}`
                                                                )
                                                            ))))
                                            ) {
                                                return true;
                                            } else {
                                                return false;
                                            }
                                        }).length > 0
                                )
                                .map((step, index) => (
                                    <Step
                                        key={index}
                                        onClick={() => setActiveStep(index)}
                                    >
                                        <StepIndicator>
                                            <StepStatus
                                                complete={<StepIcon />}
                                                incomplete={<StepNumber />}
                                                active={<StepNumber />}
                                            />
                                        </StepIndicator>

                                        <Box flexShrink="0">
                                            <StepTitle>{step.nome}</StepTitle>
                                            <StepDescription>
                                                {step.descricao}
                                            </StepDescription>
                                        </Box>

                                        <StepSeparator />
                                    </Step>
                                ))}
                            <Step
                                onClick={() =>
                                    setActiveStep(
                                        totalFields(campos, modelo, watch).length
                                    )
                                }
                            >
                                <StepIndicator>
                                    <StepStatus
                                        complete={<StepIcon />}
                                        incomplete={<StepNumber />}
                                        active={<StepNumber />}
                                    />
                                </StepIndicator>

                                <Box flexShrink="0">
                                    <StepTitle>Resumo</StepTitle>
                                    <StepDescription>
                                        Confira os dados informados
                                    </StepDescription>
                                </Box>

                                <StepSeparator />
                            </Step>
                        </Stepper>
                        <Box display={{ lg: "none" }} py={4}>
                            <Tabs
                                size="sm"
                                index={activeStep}
                                variant="solid-rounded"
                            >
                                <TabList>
                                    {totalFields(campos, modelo, watch)
                                        .map((step, index) => (
                                            <Tab
                                                key={index}
                                                onClick={() =>
                                                    setActiveStep(index)
                                                }
                                                bg={
                                                    step.campos.find((campo) =>
                                                        errors?.preenchimento &&
                                                        Object.keys(
                                                            errors?.preenchimento
                                                        ).find(
                                                            (e) =>
                                                                e ==
                                                                campo.codigo
                                                        )
                                                            ? true
                                                            : false
                                                    )
                                                        ? "orange"
                                                        : null
                                                }
                                                alignItems="center"
                                                gap={2}
                                            >
                                                {step.campos.find((campo) =>
                                                    errors?.preenchimento &&
                                                    Object.keys(
                                                        errors?.preenchimento
                                                    ).find(
                                                        (e) => e == campo.codigo
                                                    )
                                                        ? true
                                                        : false
                                                ) && (
                                                    <Icon
                                                        as={FiAlertTriangle}
                                                    />
                                                )}
                                                {step.nome}
                                            </Tab>
                                        ))}
                                    <Tab
                                        onClick={() =>
                                            setActiveStep(
                                                totalFields(campos, modelo, watch).length
                                            )
                                        }
                                    >
                                        Resumo
                                    </Tab>
                                </TabList>
                            </Tabs>
                        </Box>
                    </Box>
                    <Box w="full">
                        <Grid gap={4}>
                            {totalFields(campos, modelo, watch)
                                .map((item, index) => (
                                    <Box
                                        key={item.id}
                                        bg="white"
                                        p={4}
                                        hidden={activeStep != index}
                                        w="full"
                                        minH={96}
                                    >
                                        <Heading size="sm" mb={6}>
                                            {item.nome}
                                        </Heading>
                                        <Grid
                                            gridTemplateColumns={{
                                                base: "repeat(1,1fr)",
                                                lg: "repeat(6,1fr)",
                                            }}
                                            gap={2}
                                        >
                                            {item.campos
                                                .filter((i) => {
                                                    if (
                                                        (modelo.campos[
                                                            i.codigo
                                                        ] &&
                                                            modelo?.campos[
                                                                i.codigo
                                                            ]?.exibir &&
                                                            !i.dependencia) ||
                                                        (modelo.campos[
                                                            i.codigo
                                                        ] &&
                                                            modelo?.campos[
                                                                i.codigo
                                                            ]?.exibir &&
                                                            ((i.dependencia
                                                                ?.codigo &&
                                                                !i.dependenciaValor &&
                                                                watch(
                                                                    `preenchimento.${i.dependencia?.codigo}`
                                                                )) ||
                                                                (i.dependencia
                                                                    ?.codigo &&
                                                                    i.dependenciaValor &&
                                                                    JSON.parse(
                                                                        i.dependenciaValor
                                                                    ).includes(
                                                                        watch(
                                                                            `preenchimento.${i.dependencia?.codigo}`
                                                                        )
                                                                    ))))
                                                    ) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                })
                                                .map((campo, i) => (
                                                    <GridItem
                                                        key={campo.id}
                                                        colSpan={{
                                                            base: 1,
                                                            lg:
                                                                campo.tipoCampo ==
                                                                "file"
                                                                    ? 2
                                                                    : campo.colSpan +
                                                                      1,
                                                        }}
                                                        colStart={{
                                                            lg:
                                                                campo.tipoCampo ==
                                                                    "file" &&
                                                                item.campos.filter(
                                                                    (i) => {
                                                                        if (
                                                                            (modelo
                                                                                .campos[
                                                                                i
                                                                                    .codigo
                                                                            ] &&
                                                                                modelo
                                                                                    ?.campos[
                                                                                    i
                                                                                        .codigo
                                                                                ]
                                                                                    ?.exibir &&
                                                                                !i.dependencia) ||
                                                                            (modelo
                                                                                .campos[
                                                                                i
                                                                                    .codigo
                                                                            ] &&
                                                                                modelo
                                                                                    ?.campos[
                                                                                    i
                                                                                        .codigo
                                                                                ]
                                                                                    ?.exibir &&
                                                                                ((i
                                                                                    .dependencia
                                                                                    ?.codigo &&
                                                                                    !i.dependenciaValor &&
                                                                                    watch(
                                                                                        `preenchimento.${i.dependencia?.codigo}`
                                                                                    )) ||
                                                                                    (i
                                                                                        .dependencia
                                                                                        ?.codigo &&
                                                                                        JSON.parse(
                                                                                            i.dependenciaValor
                                                                                        ).includes(
                                                                                            watch(
                                                                                                `preenchimento.${i.dependencia?.codigo}`
                                                                                            )
                                                                                        ))))
                                                                        ) {
                                                                            return true;
                                                                        } else {
                                                                            return false;
                                                                        }
                                                                    }
                                                                )[i - 1]
                                                                    ?.tipoCampo !=
                                                                    "file"
                                                                    ? 1
                                                                    : "auto",
                                                        }}
                                                    >
                                                        {campo.tipoCampo ==
                                                            "checkbox" && (
                                                            <>
                                                                <Controller
                                                                    control={
                                                                        control
                                                                    }
                                                                    name={
                                                                        "preenchimento." +
                                                                        campo.codigo
                                                                    }
                                                                    rules={{
                                                                        required:
                                                                            {
                                                                                value: modelo
                                                                                    .campos[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.obrigatorio,
                                                                                message:
                                                                                    "Campo obrigatório",
                                                                            },
                                                                    }}
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <Checkbox
                                                                            {...field}
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                ) {
                                                                                    field.onChange(
                                                                                        "Sim"
                                                                                    );
                                                                                } else {
                                                                                    field.onChange(
                                                                                        "Não"
                                                                                    );
                                                                                }
                                                                            }}
                                                                            borderColor={
                                                                                watch(
                                                                                    "analise." +
                                                                                        campo.codigo
                                                                                )
                                                                                    ?.aprovado
                                                                                    ? "green"
                                                                                    : ""
                                                                            }
                                                                            borderWidth={
                                                                                watch(
                                                                                    "analise." +
                                                                                        campo.codigo
                                                                                )
                                                                                    ?.aprovado
                                                                                    ? 2
                                                                                    : ""
                                                                            }
                                                                            error={
                                                                                errors.preenchimento &&
                                                                                errors
                                                                                    .preenchimento[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.message
                                                                                    ? errors
                                                                                          .preenchimento[
                                                                                          campo
                                                                                              .codigo
                                                                                      ]
                                                                                          ?.message
                                                                                    : watch(
                                                                                          "analise." +
                                                                                              campo.codigo
                                                                                      )
                                                                                          ?.motivoReprovacao
                                                                                    ? "Campo reprovado: " +
                                                                                      watch(
                                                                                          "analise." +
                                                                                              campo.codigo
                                                                                      )
                                                                                          ?.motivoReprovacao
                                                                                    : ""
                                                                            }
                                                                        >
                                                                            {
                                                                                campo.nome
                                                                            }
                                                                        </Checkbox>
                                                                    )}
                                                                />
                                                            </>
                                                        )}
                                                        {campo.tipoCampo ==
                                                            "select" && (
                                                            <FormSelect
                                                                size="sm"
                                                                label={
                                                                    campo.nome
                                                                }
                                                                mask={
                                                                    campo.mask
                                                                }
                                                                placeholder={`Selecione ${campo.nome}`}
                                                                {...register(
                                                                    "preenchimento." +
                                                                        campo.codigo,
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: modelo
                                                                                    .campos[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.obrigatorio,
                                                                                message:
                                                                                    "Campo obrigatório",
                                                                            },
                                                                    }
                                                                )}
                                                                borderColor={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? "green"
                                                                        : ""
                                                                }
                                                                borderWidth={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? 2
                                                                        : ""
                                                                }
                                                                error={
                                                                    errors.preenchimento &&
                                                                    errors
                                                                        .preenchimento[
                                                                        campo
                                                                            .codigo
                                                                    ]?.message
                                                                        ? errors
                                                                              .preenchimento[
                                                                              campo
                                                                                  .codigo
                                                                          ]
                                                                              ?.message
                                                                        : watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        ? "Campo reprovado: " +
                                                                          watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        : ""
                                                                }
                                                            >
                                                                {campo.opcoes.map(
                                                                    (op) => (
                                                                        <option
                                                                            key={
                                                                                op
                                                                            }
                                                                            value={
                                                                                op
                                                                            }
                                                                        >
                                                                            {op}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </FormSelect>
                                                        )}
                                                        {campo.tipoCampo ==
                                                            "cnpj" ||
                                                        campo.tipoCampo ==
                                                            "cpf" ||
                                                        campo.tipoCampo ==
                                                            "text" ||
                                                        campo.tipoCampo ==
                                                            "number" ||
                                                        campo.tipoCampo ==
                                                            "qrcode" ? (
                                                            <FormInput
                                                                size="sm"
                                                                type={
                                                                    campo.tipoCampo
                                                                }
                                                                label={
                                                                    campo.nome
                                                                }
                                                                mask={
                                                                    campo.mask
                                                                }
                                                                inputMode={
                                                                    campo.tipoCampo ==
                                                                        "cnpj" ||
                                                                    campo.tipoCampo ==
                                                                        "cpf" ||
                                                                    campo.tipoCampo ==
                                                                        "number"
                                                                        ? "numeric"
                                                                        : "text"
                                                                }
                                                                {...register(
                                                                    "preenchimento." +
                                                                        campo.codigo,
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: modelo
                                                                                    .campos[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.obrigatorio,
                                                                                message:
                                                                                    "Campo obrigatório",
                                                                            },
                                                                        onChange:
                                                                            (
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    campo.cep
                                                                                ) {
                                                                                    buscarEnderecoPorCep(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        campo.camposEndereco
                                                                                    );
                                                                                }
                                                                                if (
                                                                                    campo.tipoCampo ==
                                                                                        "cpf" &&
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                        .length ==
                                                                                        14
                                                                                ) {
                                                                                    const cpfValido =
                                                                                        validateCPF(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        );
                                                                                    if (
                                                                                        !cpfValido
                                                                                    ) {
                                                                                        setError(
                                                                                            "preenchimento." +
                                                                                                campo.codigo,
                                                                                            {
                                                                                                type: "custom",
                                                                                                message:
                                                                                                    "CPF Inválido",
                                                                                            }
                                                                                        );
                                                                                    } else {
                                                                                        clearErrors(
                                                                                            "preenchimento." +
                                                                                                campo.codigo
                                                                                        );
                                                                                    }
                                                                                }
                                                                            },
                                                                    }
                                                                )}
                                                                borderColor={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? "green"
                                                                        : ""
                                                                }
                                                                borderWidth={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? 2
                                                                        : ""
                                                                }
                                                                error={
                                                                    errors.preenchimento &&
                                                                    errors
                                                                        .preenchimento[
                                                                        campo
                                                                            .codigo
                                                                    ]?.message
                                                                        ? errors
                                                                              .preenchimento[
                                                                              campo
                                                                                  .codigo
                                                                          ]
                                                                              ?.message
                                                                        : watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        ? "Campo reprovado: " +
                                                                          watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        : ""
                                                                }
                                                            />
                                                        ) : campo.tipoCampo ==
                                                              "date" ||
                                                          campo.tipoCampo ==
                                                              "time" ? (
                                                            <FormInput
                                                                size="sm"
                                                                type={
                                                                    campo.tipoCampo
                                                                }
                                                                label={
                                                                    campo.nome
                                                                }
                                                                {...register(
                                                                    "preenchimento." +
                                                                        campo.codigo,
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: modelo
                                                                                    .campos[
                                                                                    campo
                                                                                        .codigo
                                                                                ]
                                                                                    ?.obrigatorio,
                                                                                message:
                                                                                    "Campo obrigatório",
                                                                            },
                                                                    }
                                                                )}
                                                                borderColor={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? "green"
                                                                        : ""
                                                                }
                                                                borderWidth={
                                                                    watch(
                                                                        "analise." +
                                                                            campo.codigo
                                                                    )?.aprovado
                                                                        ? 2
                                                                        : ""
                                                                }
                                                                error={
                                                                    errors.preenchimento &&
                                                                    errors
                                                                        .preenchimento[
                                                                        campo
                                                                            .codigo
                                                                    ]?.message
                                                                        ? errors
                                                                              .preenchimento[
                                                                              campo
                                                                                  .codigo
                                                                          ]
                                                                              ?.message
                                                                        : watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        ? "Campo reprovado: " +
                                                                          watch(
                                                                              "analise." +
                                                                                  campo.codigo
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        : ""
                                                                }
                                                            />
                                                        ) : campo.tipoCampo ==
                                                          "image" ? (
                                                            <Flex align="center">
                                                                <Previews
                                                                    nome={
                                                                        campo.nome
                                                                    }
                                                                    codigo={
                                                                        campo.codigo
                                                                    }
                                                                    id={
                                                                        ficha.id
                                                                    }
                                                                    data={watch(
                                                                        "preenchimento." +
                                                                            campo.codigo
                                                                    )}
                                                                    buscar={() =>
                                                                        buscar.mutate(
                                                                            ficha.id
                                                                        )
                                                                    }
                                                                    error={
                                                                        errors.preenchimento &&
                                                                        errors
                                                                            .preenchimento[
                                                                            campo
                                                                                .codigo
                                                                        ]
                                                                            ?.message
                                                                            ? errors
                                                                                  .preenchimento[
                                                                                  campo
                                                                                      .codigo
                                                                              ]
                                                                                  ?.message
                                                                            : watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            ? "Campo reprovado: " +
                                                                              watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            : ""
                                                                    }
                                                                />
                                                                {/* <FormInput
                                                                    size="sm"
                                                                    type="file"
                                                                    label={
                                                                        campo.nome
                                                                    }
                                                                    {...register(
                                                                        "arquivos." +
                                                                            campo.codigo,
                                                                        {
                                                                            required:
                                                                                {
                                                                                    value:
                                                                                        modelo
                                                                                            .campos[
                                                                                            campo
                                                                                                .codigo
                                                                                        ]
                                                                                            ?.obrigatorio &&
                                                                                        !watch(
                                                                                            "preenchimento." +
                                                                                                campo.codigo
                                                                                        )
                                                                                            ? true
                                                                                            : false,
                                                                                    message:
                                                                                        "Campo obrigatório",
                                                                                },
                                                                        }
                                                                    )}
                                                                    borderColor={
                                                                        watch(
                                                                            "analise." +
                                                                                campo.codigo
                                                                        )
                                                                            ?.aprovado
                                                                            ? "green"
                                                                            : ""
                                                                    }
                                                                    borderWidth={
                                                                        watch(
                                                                            "analise." +
                                                                                campo.codigo
                                                                        )
                                                                            ?.aprovado
                                                                            ? 2
                                                                            : ""
                                                                    }
                                                                    error={
                                                                        errors.arquivos &&
                                                                        errors
                                                                            .arquivos[
                                                                            campo
                                                                                .codigo
                                                                        ]
                                                                            ?.message
                                                                            ? errors
                                                                                  .arquivos[
                                                                                  campo
                                                                                      .codigo
                                                                              ]
                                                                                  ?.message
                                                                            : watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            ? "Campo reprovado: " +
                                                                              watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            : ""
                                                                    }
                                                                    rightAddon={
                                                                        watch(
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
                                                                                    variant="ghost"
                                                                                    colorScheme="blue"
                                                                                    leftIcon={
                                                                                        <Icon
                                                                                            as={
                                                                                                FiEye
                                                                                            }
                                                                                        />
                                                                                    }
                                                                                    px={
                                                                                        6
                                                                                    }
                                                                                >
                                                                                    Visualizar
                                                                                </Button>
                                                                            </Link>
                                                                        )
                                                                    }
                                                                /> */}
                                                            </Flex>
                                                        ) : campo.tipoCampo ==
                                                          "file" ? (
                                                            <Flex
                                                                align="center"
                                                                w="full"
                                                            >
                                                                <Previews
                                                                    nome={
                                                                        campo.nome
                                                                    }
                                                                    codigo={
                                                                        campo.codigo
                                                                    }
                                                                    id={
                                                                        ficha.id
                                                                    }
                                                                    data={watch(
                                                                        "preenchimento." +
                                                                            campo.codigo
                                                                    )}
                                                                    buscar={() =>
                                                                        buscar.mutate(
                                                                            ficha.id
                                                                        )
                                                                    }
                                                                    error={
                                                                        errors.preenchimento &&
                                                                        errors
                                                                            .preenchimento[
                                                                            campo
                                                                                .codigo
                                                                        ]
                                                                            ?.message
                                                                            ? errors
                                                                                  .preenchimento[
                                                                                  campo
                                                                                      .codigo
                                                                              ]
                                                                                  ?.message
                                                                            : watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            ? "Campo reprovado: " +
                                                                              watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            : ""
                                                                    }
                                                                />
                                                                {/* <FormInput
                                                                    size="sm"
                                                                    type="file"
                                                                    label={
                                                                        campo.nome
                                                                    }
                                                                    {...register(
                                                                        "arquivos." +
                                                                            campo.codigo,
                                                                        {
                                                                            required:
                                                                                {
                                                                                    value:
                                                                                        modelo
                                                                                            .campos[
                                                                                            campo
                                                                                                .codigo
                                                                                        ]
                                                                                            ?.obrigatorio &&
                                                                                        !watch(
                                                                                            "preenchimento." +
                                                                                                campo.codigo
                                                                                        )
                                                                                            ? true
                                                                                            : false,
                                                                                    message:
                                                                                        "Campo obrigatório",
                                                                                },
                                                                        }
                                                                    )}
                                                                    borderColor={
                                                                        watch(
                                                                            "analise." +
                                                                                campo.codigo
                                                                        )
                                                                            ?.aprovado
                                                                            ? "green"
                                                                            : ""
                                                                    }
                                                                    borderWidth={
                                                                        watch(
                                                                            "analise." +
                                                                                campo.codigo
                                                                        )
                                                                            ?.aprovado
                                                                            ? 2
                                                                            : ""
                                                                    }
                                                                    onChange={() =>
                                                                        handleSubmit(
                                                                            onSubmit
                                                                        )
                                                                    }
                                                                    error={
                                                                        errors.arquivos &&
                                                                        errors
                                                                            .arquivos[
                                                                            campo
                                                                                .codigo
                                                                        ]
                                                                            ?.message
                                                                            ? errors
                                                                                  .arquivos[
                                                                                  campo
                                                                                      .codigo
                                                                              ]
                                                                                  ?.message
                                                                            : watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            ? "Campo reprovado: " +
                                                                              watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            : ""
                                                                    }
                                                                    rightAddon={
                                                                        watch(
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
                                                                                    variant="ghost"
                                                                                    colorScheme="blue"
                                                                                    leftIcon={
                                                                                        <Icon
                                                                                            as={
                                                                                                FiEye
                                                                                            }
                                                                                        />
                                                                                    }
                                                                                    px={
                                                                                        6
                                                                                    }
                                                                                >
                                                                                    Visualizar
                                                                                </Button>
                                                                            </Link>
                                                                        )
                                                                    }
                                                                /> */}
                                                            </Flex>
                                                        ) : campo.tipoCampo ==
                                                          "files" ? (
                                                            <Flex
                                                                align="center"
                                                                w="full"
                                                            >
                                                                <Previews
                                                                    nome={
                                                                        campo.nome
                                                                    }
                                                                    codigo={
                                                                        campo.codigo
                                                                    }
                                                                    id={
                                                                        ficha.id
                                                                    }
                                                                    data={watch(
                                                                        "preenchimento." +
                                                                            campo.codigo
                                                                    )}
                                                                    multiple
                                                                    buscar={() =>
                                                                        buscar.mutate(
                                                                            ficha.id
                                                                        )
                                                                    }
                                                                    error={
                                                                        errors.preenchimento &&
                                                                        errors
                                                                            .preenchimento[
                                                                            campo
                                                                                .codigo
                                                                        ]
                                                                            ?.message
                                                                            ? errors
                                                                                  .preenchimento[
                                                                                  campo
                                                                                      .codigo
                                                                              ]
                                                                                  ?.message
                                                                            : watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            ? "Campo reprovado: " +
                                                                              watch(
                                                                                  "analise." +
                                                                                      campo.codigo
                                                                              )
                                                                                  ?.motivoReprovacao
                                                                            : ""
                                                                    }
                                                                />
                                                            </Flex>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </GridItem>
                                                ))}
                                        </Grid>
                                    </Box>
                                ))}
                            <GridItem
                                hidden={
                                    activeStep !=
                                    totalFields(campos, modelo, watch).length
                                }
                            >
                                <Box
                                    colSpan={{ base: 1, lg: 5 }}
                                    p={4}
                                    bg="white"
                                    mt={4}
                                >
                                    <Box
                                        dangerouslySetInnerHTML={{
                                            __html: modelo.instrucoes,
                                        }}
                                    />
                                </Box>
                                <Flex mt={4} p={4} bg="white" flexDir="column">
                                    {modelo.checkbox?.map((item, key) => (
                                        <Checkbox
                                            key={item.id}
                                            {...register("checkbox_" + key, {
                                                required: {
                                                    message:
                                                        "Você deve aceitar para prosseguir",
                                                    value: true,
                                                },
                                            })}
                                            isInvalid={
                                                errors[`checkbox_${key}`]
                                                    ?.message
                                            }
                                        >
                                            {item}{" "}
                                            {errors[`checkbox_${key}`]
                                                ?.message && (
                                                <Tag colorScheme="red">
                                                    Você deve aceitar os termos
                                                    para prosseguir
                                                </Tag>
                                            )}
                                        </Checkbox>
                                    ))}
                                </Flex>
                                <Flex>
                                    {errors && errors?.preenchimento && (
                                        <Alert
                                            status="warning"
                                            flexDir="column"
                                        >
                                            <Flex>
                                                {" "}
                                                <AlertIcon />
                                                <AlertTitle>
                                                    Foram encontradas algumas
                                                    pendências
                                                </AlertTitle>
                                            </Flex>
                                            <AlertDescription>
                                                <ul>
                                                    {campos
                                                        .filter(
                                                            (i) =>
                                                                i.campos.find(
                                                                    (e) =>
                                                                        modelo
                                                                            ?.campos[
                                                                            e
                                                                                .codigo
                                                                        ]
                                                                            ?.exibir
                                                                ) &&
                                                                i.campos.find(
                                                                    (campo) =>
                                                                        errors?.preenchimento &&
                                                                        Object.keys(
                                                                            errors?.preenchimento
                                                                        ).find(
                                                                            (
                                                                                e
                                                                            ) =>
                                                                                e ==
                                                                                campo.codigo
                                                                        )
                                                                            ? true
                                                                            : false
                                                                )
                                                        )
                                                        .map((c) => (
                                                            <>
                                                                <li>
                                                                    {c.nome}
                                                                </li>
                                                                <ul>
                                                                    {c.campos
                                                                        .filter(
                                                                            (
                                                                                campo
                                                                            ) =>
                                                                                errors?.preenchimento &&
                                                                                Object.keys(
                                                                                    errors?.preenchimento
                                                                                ).find(
                                                                                    (
                                                                                        e
                                                                                    ) =>
                                                                                        e ==
                                                                                        campo.codigo
                                                                                )
                                                                                    ? true
                                                                                    : false
                                                                        )
                                                                        .map(
                                                                            (
                                                                                campo
                                                                            ) => (
                                                                                <li>
                                                                                    {
                                                                                        campo.nome
                                                                                    }{" "}
                                                                                    -{" "}
                                                                                    {
                                                                                        Object.entries(
                                                                                            errors?.preenchimento
                                                                                        ).find(
                                                                                            (
                                                                                                e
                                                                                            ) =>
                                                                                                e[0] ==
                                                                                                campo.codigo
                                                                                        )[1]
                                                                                            .message
                                                                                    }
                                                                                </li>
                                                                            )
                                                                        )}
                                                                </ul>
                                                            </>
                                                        ))}
                                                </ul>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </Flex>
                            </GridItem>
                        </Grid>
                        <Flex py={4} justify="space-between">
                            <Button
                                isDisabled={activeStep == 0}
                                size="sm"
                                colorScheme="blue"
                                type="button"
                                leftIcon={<BsArrowLeft />}
                                onClick={() => setActiveStep(activeStep - 1)}
                            >
                                Voltar
                            </Button>
                            {activeStep !=
                                totalFields(campos, modelo, watch).length && (
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    rightIcon={<BsArrowRight />}
                                    noValidate
                                >
                                    Avançar
                                </Button>
                            )}
                            {(ficha.status == "reprovada" ||
                                ficha.status == "aguardando") &&
                                activeStep ==
                                    totalFields(campos, modelo, watch).length && (
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        type="submit"
                                        isLoading={isSubmitting}
                                        rightIcon={<BiSave />}
                                        isDisabled={
                                            Object.entries(errors).length == 0
                                                ? false
                                                : true
                                        }
                                    >
                                        Salvar
                                    </Button>
                                )}
                        </Flex>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default FichaCadastral;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
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
                imovel: true,
                Processo: true,
            },
        });
        if (ficha?.deletedAt) {
            return {
                props: {
                    notFound: true,
                },
            };
        }
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
                        deletedAt: null,
                    },
                },
                deletedAt: null,
            },
            orderBy: {
                ordem: "asc",
            },
            include: {
                campos: {
                    where: {
                        tipoFicha: ficha?.modelo.tipo,
                        deletedAt: null,
                    },
                    orderBy: {
                        ordem: "asc",
                    },
                    include: {
                        dependencia: true,
                    },
                },
            },
        });
        let newObj = {};
        let newArq = {};
        let analise = {};
        ficha.preenchimento.map((item) => {
            newObj[item.campoFichaCadastralCodigo] = item.valor;
            analise[item.campoFichaCadastralCodigo] = {
                aprovado: item.aprovado,
                motivoReprovacao: item.motivoReprovacao,
            };
        });
        ficha.preenchimento = newObj;
        ficha.analise = analise;
        return {
            props: {
                ficha: JSON.parse(JSON.stringify(ficha)),
                modelo: JSON.parse(JSON.stringify(modelo)),
                campos: JSON.parse(JSON.stringify(campos)),
            },
        };
    } catch (error) {
        console.error("Error in getServerSideProps:", error);
    
        return redirectToErrorPage(ctx)
        //ctx.res.writeHead(302, { Location: '/error' });
    }
};
