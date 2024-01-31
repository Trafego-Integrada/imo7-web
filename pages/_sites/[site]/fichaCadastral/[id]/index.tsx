import { FormInput } from '@/components/Form/FormInput'
import prisma from '@/lib/prisma'
import {
    atualizarAnexosFicha,
    excluirAnexoFicha,
    atualizarFicha,
    buscarFicha,
} from '@/services/models/public/fichaCadastral'
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
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    FiAlertTriangle,
    FiDelete,
    FiFile,
    FiPlus,
    FiTrash,
    FiTrash2,
    FiUpload,
} from 'react-icons/fi'
import { useMutation } from 'react-query'
import 'react-quill/dist/quill.snow.css'
import { buscarEndereco } from '@/lib/buscarEndereco'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FormSelect } from '@/components/Form/FormSelect'
import {
    convertToBase64,
    formatoValor,
    getFileExtension,
    verificarExtensaoImagem,
} from '@/helpers/helpers'
import { Head } from '@/components/Head'
import { MdClose } from 'react-icons/md'

import { FileUpload } from 'primereact/fileupload'
import { BiSave } from 'react-icons/bi'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { ModalPreview } from '@/components/Modals/Preview'
import { validateCPF } from '@/utils/validateCPF'

function Previews(props: any) {
    const preview = useRef()
    const toast = useToast({})
    const [totalSize, setTotalSize] = useState(0)
    const fileUploadRef = useRef(null)

    const onTemplateSelect = (e: any) => {
        let _totalSize = totalSize
        let files = e.files

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0
        })

        setTotalSize(_totalSize)
    }

    const onTemplateUpload = (e: any) => {
        let _totalSize = 0

        e.files.forEach((file: any) => {
            _totalSize += file.size || 0
        })

        setTotalSize(_totalSize)
        toast({
            status: 'info',
            title: 'File Uploaded',
            position: 'top-right',
        })
    }

    const onTemplateRemove = (file: File, callback: any) => {
        setTotalSize(totalSize - file.size < 0 ? 0 : totalSize - file.size)
        callback()
    }

    const onTemplateClear = () => {
        setTotalSize(0)
    }

    const headerTemplate = (options: any) => {
        const { chooseButton, uploadButton, cancelButton } = options
        const value = totalSize / 100000
        const formatedValue: any =
            fileUploadRef && fileUploadRef.current
                ? fileUploadRef?.current?.formatSize(totalSize)
                : '0 B'

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
        )
    }

    const itemTemplate = (file: any, props: any) => {
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
        )
    }

    const emptyTemplate = () => {
        return (
            <Flex align="center" flexDir="column" p={4}>
                <Icon as={FiFile} fontSize="2em" color="gray" />
                <Text fontSize="sm" color="gray">
                    Arraste e solte aqui
                </Text>
            </Flex>
        )
    }

    const atualizarAnexos = useMutation(atualizarAnexosFicha, {
        onSuccess: () => {
            //console.log('LINHA 261: FICHA CADASTRAL: REFRESH ANEXAR')
            props.buscar()
        },
    })
    const excluirAnexo = useMutation(excluirAnexoFicha, {
        onSuccess: () => {
            //console.log('LINHA 261: FICHA CADASTRAL: REFRESH EXCLUIR')
            toast({
                title: 'Arquivo excluído com sucesso',
                position: 'top-right',
            })
            props.buscar()
            //window.location.reload()
        },
    })
    const customBase64Uploader = async (event: any) => {
        // convert file to base64 encoded
        if (event.options?.props?.multiple) {
            const files = event.files
            toast({
                title: 'Upload sendo realizado, aguarde...',
                position: 'top-right',
                status: 'info',
            })
            for await (const item of files) {
                const base64String = await convertToBase64(item)
                const fileExtension = getFileExtension(item.name)

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
                            console.log('LINHA 304: FICHA CADASTRAL: UPLOAD')
                            toast({
                                title: 'Upload realizado com sucesso',
                                position: 'top-right',
                                status: 'success',
                            })
                            event.options.clear()
                            //window.location.reload()
                        },
                    },
                )
            }
            setTimeout(() => {
                props.buscar()
            }, 1000)
        } else {
            const file = event.files[0]

            const base64String = await convertToBase64(file)
            const fileExtension = getFileExtension(file.name)

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
                            title: 'Upload realizado com sucesso',
                            position: 'top-right',
                        })
                        props.buscar()
                        event.options.clear()
                        //window.location.reload()
                    },
                },
            )
        }
        //console.log(event)
    }
    return (
        <Flex
            flexDir="column"
            gap={4}
            borderWidth={1}
            p={4}
            rounded="lg"
            w="full"
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
                        {props.multiple ? (
                            JSON.parse(props.data).map((item) => (
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
                                                arquivo? Não será possivel
                                                reverter
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
                                                    item,
                                                ).extensao?.toLocaleUpperCase()}
                                            </Text>
                                        </Flex>
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Box pos="relative">
                                <IconButton
                                    icon={<FiDelete />}
                                    colorScheme="red"
                                    size="xs"
                                    pos="absolute"
                                    top={0}
                                    right={0}
                                    onClick={() =>
                                        excluirAnexo.mutate({
                                            id: props.id,
                                            params: {
                                                ...props,
                                            },
                                        })
                                    }
                                />
                                {verificarExtensaoImagem(props.data).eImagem ? (
                                    <Image
                                        src={props.data}
                                        w={32}
                                        h={32}
                                        cursor="pointer"
                                        onClick={() =>
                                            preview.current.onOpen(props.data)
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
                                            preview.current.onOpen(props.data)
                                        }
                                    >
                                        <Text color="white" fontSize="lg">
                                            {verificarExtensaoImagem(
                                                props.data,
                                            ).extensao?.toLocaleUpperCase()}
                                        </Text>
                                    </Flex>
                                )}
                            </Box>
                        )}
                    </Flex>
                </Flex>
            )}
            <ModalPreview ref={preview} />
        </Flex>
    )
}

const FichaCadastral = ({
        ficha,
        campos,
        modelo,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const toast = useToast()
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
    })
    const buscar = useMutation(buscarFicha, {
        onSuccess: (data) => {
            reset(data)
        },
    })
    const atualizar = useMutation(atualizarFicha)

    const onSubmit = async (data: any) => {
        try {
            if (
                activeStep !=
                campos.filter(
                    (i: any) =>
                        i.campos.find(
                            (e: any) => modelo?.campos[e.codigo]?.exibir,
                        ) &&
                        i.campos.filter((i) => {
                            if (
                                (modelo.campos[i.codigo] &&
                                    modelo?.campos[i.codigo]?.exibir &&
                                    !i.dependencia) ||
                                (modelo.campos[i.codigo] &&
                                    modelo?.campos[i.codigo]?.exibir &&
                                    ((i.dependencia?.codigo &&
                                        !i.dependenciaValor &&
                                        watch(
                                            `preenchimento.${i.dependencia?.codigo}`,
                                        )) ||
                                        (i.dependencia?.codigo &&
                                            i.dependenciaValor ==
                                                watch(
                                                    `preenchimento.${i.dependencia?.codigo}`,
                                                ))))
                            ) {
                                return true
                            } else {
                                return false
                            }
                        }).length > 0,
                ).length
            ) {
                setActiveStep(activeStep + 1)
            }
            //console.log(data)
            await atualizar.mutateAsync(data)

            toast({
                title: 'Ficha salva',
                status: 'success',
                position: 'top-right',
            })
        } catch (e: any) {
            //console.log(e)
            toast({
                title: 'Houve um problema',
                description: e.response?.data?.message,
                status: 'error',
                position: 'top-right',
            })
        }
    }

    const buscarEnderecoPorCep = async (cep: any, camposEndereco: any) => {
        //console.log('LINHA 684 : FICHA CADASTRAL: ', cep)
        try {
            if (cep.length > 8) {
                const res = await buscarEndereco(cep)
                //console.log(res);
                let obj: any = {}
                Object.entries(camposEndereco).map((item) => {
                    if (item[0] == 'endereco') {
                        obj[item[1].codigo] = res.logradouro
                    } else if (item[0] == 'bairro') {
                        obj[item[1].codigo] = res.bairro
                    } else if (item[0] == 'cidade') {
                        obj[item[1].codigo] = res.cidade
                    } else if (item[0] == 'estado') {
                        obj[item[1].codigo] = res.uf
                    }
                })
                reset({
                    ...watch(),
                    preenchimento: {
                        ...watch('preenchimento'),
                        ...obj,
                    },
                })
            }
        } catch (e) {
            toast({
                title: 'Endereço não encontrado',
                status: 'warning',
                position: 'top-right',
            })
        }
    }
    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: campos.filter((i) =>
            i.campos.find((e) => modelo?.campos[e.codigo]?.exibir),
        ).length,
    })
    const onError = (data) => {
        if (
            activeStep !=
            campos.filter(
                (i) =>
                    i.campos.find((e) => modelo?.campos[e.codigo]?.exibir) &&
                    i.campos.filter((i) => {
                        if (
                            (modelo.campos[i.codigo] &&
                                modelo?.campos[i.codigo]?.exibir &&
                                !i.dependencia) ||
                            (modelo.campos[i.codigo] &&
                                modelo?.campos[i.codigo]?.exibir &&
                                ((i.dependencia?.codigo &&
                                    !i.dependenciaValor &&
                                    watch(
                                        `preenchimento.${i.dependencia?.codigo}`,
                                    )) ||
                                    (i.dependencia?.codigo &&
                                        i.dependenciaValor ==
                                            watch(
                                                `preenchimento.${i.dependencia?.codigo}`,
                                            ))))
                        ) {
                            return true
                        } else {
                            return false
                        }
                    }).length > 0,
            ).length
        ) {
            console.log('data', data)
            clearErrors()
            setActiveStep(activeStep + 1)
            onSubmit(watch())
            return
        }
    }
    console.log(errors)

    useEffect(() => {
        if (errors) {
            null
            //console.log(
            //    campos
            //        .filter(
            //            (i) =>
            //                i.campos.find(
            //                    (e) => modelo?.campos[e.codigo]?.exibir
            //                ) &&
            //                i.campos.find((campo) =>
            //                    errors?.preenchimento &&
            //                    Object.keys(errors?.preenchimento).find(
            //                        (e) => e == campo.codigo
            //                    )
            //                        ? true
            //                        : false
            //                )
            //        )
            //        .map((i) => {
            //            const index = campos.findIndex((e) => e.id == i.id);
            //            isIncompleteStep(index);
            //        })
            //);
        }
    }, [errors])
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
                    flexDir={{ base: 'row', lg: 'row' }}
                >
                    <Box>
                        <Image
                            h={100}
                            objectFit="contain"
                            src={ficha.imobiliaria.logo}
                        />
                    </Box>
                    <Box>
                        <Text fontSize={{ base: 'sm', lg: 'md' }}>
                            <Text as="span" fontWeight="bold">
                                {ficha.imobiliaria.razaoSocial}
                            </Text>{' '}
                            • CNPJ: {ficha.imobiliaria.cnpj}
                        </Text>
                        <Text fontSize={{ base: 'xx-small', lg: 'sm' }}>
                            {ficha.imobiliaria.endereco}
                            {ficha.imobiliaria.numero &&
                                ` nº ${ficha.imobiliaria.numero}`}
                            ,{ficha.imobiliaria.bairro},
                            {ficha.imobiliaria.cidade}/
                            {ficha.imobiliaria.estado} - CEP:{' '}
                            {ficha.imobiliaria.cep}
                        </Text>
                        <Text fontSize={{ base: 'xx-small', lg: 'sm' }}>
                            <Text as="span" fontWeight="bold">
                                Fixo:
                            </Text>{' '}
                            {ficha.imobiliaria.telefone} •{' '}
                            <Text as="span" fontWeight="bold">
                                E-mail:
                            </Text>{' '}
                            {ficha.imobiliaria.email} •{' '}
                            <Text as="span" fontWeight="bold">
                                Site:
                            </Text>{' '}
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
                    {ficha.status == 'aprovada' && (
                        <Alert status="success" my={2}>
                            <AlertIcon />
                            <AlertTitle>Ficha Aprovada</AlertTitle>
                        </Alert>
                    )}
                    {ficha.status != 'aguardando' &&
                        ficha.status != 'aprovada' &&
                        ficha.status != 'reprovada' && (
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
                    {ficha.status == 'reprovada' && (
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
                        base: 'repeat(2,1fr)',
                        lg: 'repeat(6,1fr)',
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
                                    {ficha.imovel?.codigo} -{' '}
                                    {ficha.imovel?.endereco}, nº
                                    {ficha.imovel?.numero},
                                    {ficha?.imovel?.complemento &&
                                        ` ${ficha?.imovel?.complemento},`}{' '}
                                    {ficha.imovel?.bairro},{' '}
                                    {ficha.imovel?.cidade}/
                                    {ficha.imovel?.estado},
                                    {ficha.imovel?.estado}, CEP:{' '}
                                    {ficha.imovel?.cep}
                                </Text>
                            </Box>
                        ) : ficha.codigoImovel ? (
                            <Box p={2} bg="white">
                                <Text fontSize="sm" color="gray">
                                    Ficha referente ao imóvel:
                                </Text>
                                <Text>
                                    {ficha.codigoImovel} -{' '}
                                    {ficha.enderecoImovel} nº{' '}
                                    {ficha.numeroImovel}{' '}
                                    {ficha.complementoImovel &&
                                        `(${ficha.complementoImovel})`}
                                    , {ficha.bairroImovel}, {ficha.cidadeImovel}
                                    /{ficha.estadoImovel}
                                </Text>
                            </Box>
                        ) : (
                            ''
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
                <Flex flexDir={{ base: 'column', lg: 'row' }}>
                    <Box w={{ base: 'full', lg: 'xs' }} overflow="auto">
                        <Stepper
                            size="xs"
                            index={activeStep}
                            orientation="vertical"
                            display={{ base: 'none', lg: 'flex' }}
                        >
                            {campos
                                .filter(
                                    (i) =>
                                        i.campos.find(
                                            (e) =>
                                                modelo?.campos[e.codigo]
                                                    ?.exibir,
                                        ) &&
                                        i.campos.filter((i) => {
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
                                                            `preenchimento.${i.dependencia?.codigo}`,
                                                        )) ||
                                                        (i.dependencia
                                                            ?.codigo &&
                                                            i.dependenciaValor ==
                                                                watch(
                                                                    `preenchimento.${i.dependencia?.codigo}`,
                                                                ))))
                                            ) {
                                                return true
                                            } else {
                                                return false
                                            }
                                        }).length > 0,
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
                                        campos.filter((i: any) =>
                                            i.campos.find(
                                                () =>
                                                    i.campos.find(
                                                        (e: any) =>
                                                            modelo?.campos[
                                                                e.codigo
                                                            ]?.exibir,
                                                    ) &&
                                                    i.campos.filter((i) => {
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
                                                                        `preenchimento.${i.dependencia?.codigo}`,
                                                                    )) ||
                                                                    (i
                                                                        .dependencia
                                                                        ?.codigo &&
                                                                        i.dependenciaValor ==
                                                                            watch(
                                                                                `preenchimento.${i.dependencia?.codigo}`,
                                                                            ))))
                                                        ) {
                                                            return true
                                                        } else {
                                                            return false
                                                        }
                                                    }).length > 0,
                                            ),
                                        ).length,
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
                        <Box display={{ lg: 'none' }} py={4}>
                            <Tabs
                                size="sm"
                                index={activeStep}
                                variant="solid-rounded"
                            >
                                <TabList>
                                    {campos
                                        .filter(
                                            (i) =>
                                                i.campos.find(
                                                    (e) =>
                                                        modelo?.campos[e.codigo]
                                                            ?.exibir,
                                                ) &&
                                                i.campos.filter((i) => {
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
                                                                    `preenchimento.${i.dependencia?.codigo}`,
                                                                )) ||
                                                                (i.dependencia
                                                                    ?.codigo &&
                                                                    i.dependenciaValor ==
                                                                        watch(
                                                                            `preenchimento.${i.dependencia?.codigo}`,
                                                                        ))))
                                                    ) {
                                                        return true
                                                    } else {
                                                        return false
                                                    }
                                                }).length > 0,
                                        )
                                        .map((step: any, index: any) => (
                                            <Tab
                                                key={index}
                                                onClick={() =>
                                                    setActiveStep(index)
                                                }
                                                bg={
                                                    step.campos.find(
                                                        (campo: any) =>
                                                            errors?.preenchimento &&
                                                            Object.keys(
                                                                errors?.preenchimento,
                                                            ).find(
                                                                (e) =>
                                                                    e ==
                                                                    campo.codigo,
                                                            )
                                                                ? true
                                                                : false,
                                                    )
                                                        ? 'orange'
                                                        : null
                                                }
                                                alignItems="center"
                                                gap={2}
                                            >
                                                {step.campos.find(
                                                    (campo: any) =>
                                                        errors?.preenchimento &&
                                                        Object.keys(
                                                            errors?.preenchimento,
                                                        ).find(
                                                            (e) =>
                                                                e ==
                                                                campo.codigo,
                                                        )
                                                            ? true
                                                            : false,
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
                                                campos.filter((i) =>
                                                    i.campos.find(
                                                        () =>
                                                            i.campos.find(
                                                                (e) =>
                                                                    modelo
                                                                        ?.campos[
                                                                        e.codigo
                                                                    ]?.exibir,
                                                            ) &&
                                                            i.campos.filter(
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
                                                                                    `preenchimento.${i.dependencia?.codigo}`,
                                                                                )) ||
                                                                                (i
                                                                                    .dependencia
                                                                                    ?.codigo &&
                                                                                    i.dependenciaValor ==
                                                                                        watch(
                                                                                            `preenchimento.${i.dependencia?.codigo}`,
                                                                                        ))))
                                                                    ) {
                                                                        return true
                                                                    } else {
                                                                        return false
                                                                    }
                                                                },
                                                            ).length > 0,
                                                    ),
                                                ).length,
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
                            {campos
                                .filter(
                                    (i) =>
                                        i.campos.find(
                                            (e) =>
                                                modelo?.campos[e.codigo]
                                                    ?.exibir,
                                        ) &&
                                        i.campos.filter((i) => {
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
                                                            `preenchimento.${i.dependencia?.codigo}`,
                                                        )) ||
                                                        (i.dependencia
                                                            ?.codigo &&
                                                            i.dependenciaValor ==
                                                                watch(
                                                                    `preenchimento.${i.dependencia?.codigo}`,
                                                                ))))
                                            ) {
                                                return true
                                            } else {
                                                return false
                                            }
                                        }).length > 0,
                                )
                                .map((item: any, index: any) => (
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
                                                base: 'repeat(1,1fr)',
                                                lg: 'repeat(6,1fr)',
                                            }}
                                            gap={2}
                                        >
                                            {item.campos
                                                .filter((i: any) => {
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
                                                                    `preenchimento.${i.dependencia?.codigo}`,
                                                                )) ||
                                                                (i.dependencia
                                                                    ?.codigo &&
                                                                    i.dependenciaValor ==
                                                                        watch(
                                                                            `preenchimento.${i.dependencia?.codigo}`,
                                                                        ))))
                                                    ) {
                                                        return true
                                                    } else {
                                                        return false
                                                    }
                                                })
                                                .map((campo, i) => (
                                                    <GridItem
                                                        key={campo.id}
                                                        colSpan={{
                                                            base: 1,
                                                            lg:
                                                                campo?.tipoCampo ==
                                                                'file'
                                                                    ? 2
                                                                    : campo.colSpan +
                                                                      1,
                                                        }}
                                                        colStart={{
                                                            lg:
                                                                campo?.tipoCampo ==
                                                                    'file' &&
                                                                item.campos.filter(
                                                                    (i:any) => {
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
                                                                                        `preenchimento.${i.dependencia?.codigo}`,
                                                                                    )) ||
                                                                                    (i
                                                                                        .dependencia
                                                                                        ?.codigo &&
                                                                                        i.dependenciaValor ==
                                                                                            watch(
                                                                                                `preenchimento.${i.dependencia?.codigo}`,
                                                                                            ))))
                                                                        ) {
                                                                            return true
                                                                        } else {
                                                                            return false
                                                                        }
                                                                    },
                                                                )[i - 1]
                                                                    ?.tipoCampo !=
                                                                    'file'
                                                                    ? 1
                                                                    : 'auto',
                                                        }}
                                                    >
                                                        {campo.tipoCampo ==
                                                            'checkbox' && (
                                                            <>
                                                                <Controller
                                                                    control={
                                                                        control
                                                                    }
                                                                    name={
                                                                        'preenchimento.' +
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
                                                                                    'Campo obrigatório',
                                                                            },
                                                                    }}
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <Checkbox
                                                                            {...field}
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                if (
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                ) {
                                                                                    field.onChange(
                                                                                        'Sim',
                                                                                    )
                                                                                } else {
                                                                                    field.onChange(
                                                                                        'Não',
                                                                                    )
                                                                                }
                                                                            }}
                                                                            borderColor={
                                                                                watch(
                                                                                    'analise.' +
                                                                                        campo.codigo,
                                                                                )
                                                                                    ?.aprovado
                                                                                    ? 'green'
                                                                                    : ''
                                                                            }
                                                                            borderWidth={
                                                                                watch(
                                                                                    'analise.' +
                                                                                        campo.codigo,
                                                                                )
                                                                                    ?.aprovado
                                                                                    ? 2
                                                                                    : ''
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
                                                                                          'analise.' +
                                                                                              campo.codigo,
                                                                                      )
                                                                                          ?.motivoReprovacao
                                                                                    ? 'Campo reprovado: ' +
                                                                                      watch(
                                                                                          'analise.' +
                                                                                              campo.codigo,
                                                                                      )
                                                                                          ?.motivoReprovacao
                                                                                    : ''
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
                                                            'select' && (
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
                                                                    'preenchimento.' +
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
                                                                                    'Campo obrigatório',
                                                                            },
                                                                    },
                                                                )}
                                                                borderColor={
                                                                    watch(
                                                                        'analise.' +
                                                                            campo.codigo,
                                                                    )?.aprovado
                                                                        ? 'green'
                                                                        : ''
                                                                }
                                                                borderWidth={
                                                                    watch(
                                                                        'analise.' +
                                                                            campo.codigo,
                                                                    )?.aprovado
                                                                        ? 2
                                                                        : ''
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
                                                                              'analise.' +
                                                                                  campo.codigo,
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        ? 'Campo reprovado: ' +
                                                                          watch(
                                                                              'analise.' +
                                                                                  campo.codigo,
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        : ''
                                                                }
                                                            >
                                                                {campo.opcoes.map(
                                                                    (
                                                                        op: any,
                                                                    ) => (
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
                                                                    ),
                                                                )}
                                                            </FormSelect>
                                                        )}
                                                        {campo.tipoCampo ==
                                                            'cnpj' ||
                                                        campo.tipoCampo ==
                                                            'cpf' ||
                                                        campo.tipoCampo ==
                                                            'text' ||
                                                        campo.tipoCampo ==
                                                            'number' ||
                                                        campo.tipoCampo ==
                                                            'qrcode' ? (
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
                                                                        'cnpj' ||
                                                                    campo.tipoCampo ==
                                                                        'cpf' ||
                                                                    campo.tipoCampo ==
                                                                        'number'
                                                                        ? 'numeric'
                                                                        : 'text'
                                                                }
                                                                {...register(
                                                                    'preenchimento.' +
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
                                                                                    'Campo obrigatório',
                                                                            },
                                                                        onChange:
                                                                            (
                                                                                e,
                                                                            ) => {
                                                                                if (
                                                                                    campo.cep
                                                                                ) {
                                                                                    buscarEnderecoPorCep(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        campo.camposEndereco,
                                                                                    )
                                                                                }
                                                                                if (
                                                                                    campo.tipoCampo ==
                                                                                        'cpf' &&
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
                                                                                                .value,
                                                                                        )
                                                                                    console.log(
                                                                                        'cpfValido',
                                                                                        cpfValido,
                                                                                    )
                                                                                    if (
                                                                                        !cpfValido
                                                                                    ) {
                                                                                        setError(
                                                                                            'preenchimento.' +
                                                                                                campo.codigo,
                                                                                            {
                                                                                                type: 'custom',
                                                                                                message:
                                                                                                    'CPF Inválido',
                                                                                            },
                                                                                        )
                                                                                    } else {
                                                                                        clearErrors(
                                                                                            'preenchimento.' +
                                                                                                campo.codigo,
                                                                                        )
                                                                                    }
                                                                                }
                                                                            },
                                                                    },
                                                                )}
                                                                borderColor={
                                                                    watch(
                                                                        'analise.' +
                                                                            campo.codigo,
                                                                    )?.aprovado
                                                                        ? 'green'
                                                                        : ''
                                                                }
                                                                borderWidth={
                                                                    watch(
                                                                        'analise.' +
                                                                            campo.codigo,
                                                                    )?.aprovado
                                                                        ? 2
                                                                        : ''
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
                                                                              'analise.' +
                                                                                  campo.codigo,
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        ? 'Campo reprovado: ' +
                                                                          watch(
                                                                              'analise.' +
                                                                                  campo.codigo,
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        : ''
                                                                }
                                                            />
                                                        ) : campo.tipoCampo ==
                                                              'date' ||
                                                          campo.tipoCampo ==
                                                              'time' ? (
                                                            <FormInput
                                                                size="sm"
                                                                type={
                                                                    campo.tipoCampo
                                                                }
                                                                label={
                                                                    campo.nome
                                                                }
                                                                {...register(
                                                                    'preenchimento.' +
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
                                                                                    'Campo obrigatório',
                                                                            },
                                                                    },
                                                                )}
                                                                borderColor={
                                                                    watch(
                                                                        'analise.' +
                                                                            campo.codigo,
                                                                    )?.aprovado
                                                                        ? 'green'
                                                                        : ''
                                                                }
                                                                borderWidth={
                                                                    watch(
                                                                        'analise.' +
                                                                            campo.codigo,
                                                                    )?.aprovado
                                                                        ? 2
                                                                        : ''
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
                                                                              'analise.' +
                                                                                  campo.codigo,
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        ? 'Campo reprovado: ' +
                                                                          watch(
                                                                              'analise.' +
                                                                                  campo.codigo,
                                                                          )
                                                                              ?.motivoReprovacao
                                                                        : ''
                                                                }
                                                            />
                                                        ) : campo.tipoCampo ==
                                                          'image' ? (
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
                                                                        'preenchimento.' +
                                                                            campo.codigo,
                                                                    )}
                                                                    buscar={() =>
                                                                        buscar.mutate(
                                                                            ficha.id,
                                                                        )
                                                                    }
                                                                />
                                                            </Flex>
                                                        ) : campo.tipoCampo ==
                                                          'file' ? (
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
                                                                        'preenchimento.' +
                                                                            campo.codigo,
                                                                    )}
                                                                    buscar={() =>
                                                                        buscar.mutate(
                                                                            ficha.id,
                                                                        )
                                                                    }
                                                                />
                                                            </Flex>
                                                        ) : campo.tipoCampo ==
                                                          'files' ? (
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
                                                                        'preenchimento.' +
                                                                            campo.codigo,
                                                                    )}
                                                                    multiple
                                                                    buscar={() =>
                                                                        buscar.mutate(
                                                                            ficha.id,
                                                                        )
                                                                    }
                                                                />
                                                            </Flex>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </GridItem>
                                                ))}
                                        </Grid>
                                    </Box>
                                ))}
                            <GridItem
                                hidden={
                                    activeStep !=
                                    campos.filter(
                                        (i: any) =>
                                            i.campos.find(
                                                (e: any) =>
                                                    modelo?.campos[e.codigo]
                                                        ?.exibir,
                                            ) &&
                                            i.campos.filter((i: any) => {
                                                if (
                                                    (modelo.campos[i.codigo] &&
                                                        modelo?.campos[i.codigo]
                                                            ?.exibir &&
                                                        !i.dependencia) ||
                                                    (modelo.campos[i.codigo] &&
                                                        modelo?.campos[i.codigo]
                                                            ?.exibir &&
                                                        ((i.dependencia
                                                            ?.codigo &&
                                                            !i.dependenciaValor &&
                                                            watch(
                                                                `preenchimento.${i.dependencia?.codigo}`,
                                                            )) ||
                                                            (i.dependencia
                                                                ?.codigo &&
                                                                i.dependenciaValor ==
                                                                    watch(
                                                                        `preenchimento.${i.dependencia?.codigo}`,
                                                                    ))))
                                                ) {
                                                    return true
                                                } else {
                                                    return false
                                                }
                                            }).length > 0,
                                    ).length
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
                                    {modelo.checkbox?.map(
                                        (item: any, key: any) => (
                                            <Checkbox
                                                key={item.id}
                                                {...register(
                                                    'checkbox_' + key,
                                                    {
                                                        required: {
                                                            message:
                                                                'Você deve aceitar para prosseguir',
                                                            value: true,
                                                        },
                                                    },
                                                )}
                                                isInvalid={
                                                    errors[`checkbox_${key}`]
                                                        ?.message
                                                }
                                            >
                                                {item}{' '}
                                                {errors[`checkbox_${key}`]
                                                    ?.message && (
                                                    <Tag colorScheme="red">
                                                        Você deve aceitar os
                                                        termos para prosseguir
                                                    </Tag>
                                                )}
                                            </Checkbox>
                                        ),
                                    )}
                                </Flex>
                                <Flex>
                                    {errors && errors?.preenchimento && (
                                        <Alert
                                            status="warning"
                                            flexDir="column"
                                        >
                                            <Flex>
                                                {' '}
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
                                                            (i: any) =>
                                                                i.campos.find(
                                                                    (e: any) =>
                                                                        modelo
                                                                            ?.campos[
                                                                            e
                                                                                .codigo
                                                                        ]
                                                                            ?.exibir,
                                                                ) &&
                                                                i.campos.find(
                                                                    (
                                                                        campo: any,
                                                                    ) =>
                                                                        errors?.preenchimento &&
                                                                        Object.keys(
                                                                            errors?.preenchimento,
                                                                        ).find(
                                                                            (
                                                                                e,
                                                                            ) =>
                                                                                e ==
                                                                                campo.codigo,
                                                                        )
                                                                            ? true
                                                                            : false,
                                                                ),
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
                                                                                campo,
                                                                            ) =>
                                                                                errors?.preenchimento &&
                                                                                Object.keys(
                                                                                    errors?.preenchimento,
                                                                                ).find(
                                                                                    (
                                                                                        e,
                                                                                    ) =>
                                                                                        e ==
                                                                                        campo.codigo,
                                                                                )
                                                                                    ? true
                                                                                    : false,
                                                                        )
                                                                        .map(
                                                                            (
                                                                                campo,
                                                                            ) => (
                                                                                <li>
                                                                                    {
                                                                                        campo.nome
                                                                                    }{' '}
                                                                                    -{' '}
                                                                                    {
                                                                                        Object.entries(
                                                                                            errors?.preenchimento,
                                                                                        ).find(
                                                                                            (
                                                                                                e,
                                                                                            ) =>
                                                                                                e[0] ==
                                                                                                campo.codigo,
                                                                                        )[1]
                                                                                            .message
                                                                                    }
                                                                                </li>
                                                                            ),
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
                                campos.filter((i) =>
                                    i.campos.find(
                                        () =>
                                            i.campos.find(
                                                (e) =>
                                                    modelo?.campos[e.codigo]
                                                        ?.exibir,
                                            ) &&
                                            i.campos.filter((i) => {
                                                if (
                                                    (modelo.campos[i.codigo] &&
                                                        modelo?.campos[i.codigo]
                                                            ?.exibir &&
                                                        !i.dependencia) ||
                                                    (modelo.campos[i.codigo] &&
                                                        modelo?.campos[i.codigo]
                                                            ?.exibir &&
                                                        ((i.dependencia
                                                            ?.codigo &&
                                                            !i.dependenciaValor &&
                                                            watch(
                                                                `preenchimento.${i.dependencia?.codigo}`,
                                                            )) ||
                                                            (i.dependencia
                                                                ?.codigo &&
                                                                i.dependenciaValor ==
                                                                    watch(
                                                                        `preenchimento.${i.dependencia?.codigo}`,
                                                                    ))))
                                                ) {
                                                    return true
                                                } else {
                                                    return false
                                                }
                                            }).length > 0,
                                    ),
                                ).length && (
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
                            {(ficha.status == 'reprovada' ||
                                ficha.status == 'aguardando') &&
                                activeStep ==
                                    campos.filter((i) =>
                                        i.campos.find(
                                            () =>
                                                i.campos.find(
                                                    (e) =>
                                                        modelo?.campos[e.codigo]
                                                            ?.exibir,
                                                ) &&
                                                i.campos.filter((i) => {
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
                                                                    `preenchimento.${i.dependencia?.codigo}`,
                                                                )) ||
                                                                (i.dependencia
                                                                    ?.codigo &&
                                                                    i.dependenciaValor ==
                                                                        watch(
                                                                            `preenchimento.${i.dependencia?.codigo}`,
                                                                        ))))
                                                    ) {
                                                        return true
                                                    } else {
                                                        return false
                                                    }
                                                }).length > 0,
                                        ),
                                    ).length && (
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        type="submit"
                                        isLoading={isSubmitting}
                                        rightIcon={<BiSave />}
                                    >
                                        Salvar
                                    </Button>
                                )}
                        </Flex>
                    </Box>
                </Flex>
            </Container>
        </Box>
    )
}

export default FichaCadastral

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const { id } = ctx.query
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
    })
    if (ficha?.deletedAt) {
        return {
            props: {
                notFound: true,
            },
        }
    }
    const modelo = await prisma.modeloFichaCadastral.findUnique({
        where: {
            id: ficha?.modeloFichaCadastralId,
        },
    })
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
            ordem: 'asc',
        },
        include: {
            campos: {
                where: {
                    tipoFicha: ficha?.modelo.tipo,
                    deletedAt: null,
                },
                orderBy: {
                    ordem: 'asc',
                },
                include: {
                    dependencia: true,
                },
            },
        },
    })
    let newObj: any = {}
    let analise: any = {}
    ficha?.preenchimento?.map((item: any) => {
        newObj[item.campoFichaCadastralCodigo] = item.valor
        analise[item.campoFichaCadastralCodigo] = {
            aprovado: item.aprovado,
            motivoReprovacao: item.motivoReprovacao,
        }
    })
    ficha.preenchimento = newObj
    ficha.analise = analise
    return {
        props: {
            ficha: JSON.parse(JSON.stringify(ficha)),
            modelo: JSON.parse(JSON.stringify(modelo)),
            campos: JSON.parse(JSON.stringify(campos)),
        },
    }
}
