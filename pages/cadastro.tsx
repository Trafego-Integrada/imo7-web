import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    Image,
    Spinner,
    Stack,
    Text,
    useToast,
} from '@chakra-ui/react'

import { FormInput } from '@/components/Form/FormInput'
import { store } from '@/services/models/imobiliaria'
import { yupResolver } from '@hookform/resolvers/yup'
import { NextPage } from 'next'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactInputMask from 'react-input-mask'
import { useMutation } from 'react-query'
import BeatLoader from 'react-spinners/BeatLoader'
import * as yup from 'yup'

import { FormSelect } from '@/components/Form/FormSelect'
import axios from 'axios'
import { useRouter } from 'next/router'
import { FaSignInAlt } from 'react-icons/fa'
import InputMask from 'react-input-mask'
interface CredentialsProps {
    documento: string
    password: string
}

const schema = yup.object().shape({
    razaoSocial: yup.string().required('A Razão Social é obrigatório'),
    cnpj: yup.string().required('O CNPJ é obrigatório'),
    email: yup.string().required('O E-mail é obrigatório'),
    telefone: yup.string().required('O Telefone é obrigatório'),
    url: yup.string().required('O URL é obrigatório'),
    usuario: yup.object({
        nome: yup.string().required('Campo obrigatório'),
        documento: yup.string().required('Campo obrigatório'),
        email: yup.string().required('Campo obrigatório'),
        senha: yup.string().required('Campo obrigatório'),
        confirmarSenha: yup.string().required('Campo obrigatório'),
    }),
})
const SignIn: NextPage = () => {
    const router = useRouter()
    const toast = useToast()
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    })
    const [error, setError] = useState(null)
    const cadastrar = useMutation(store)

    const { mutateAsync: buscarCep, isLoading } = useMutation(
        async (cep) => {
            const { data } = await axios.get(
                'https://viacep.com.br/ws/' + cep + '/json/',
            )
            return data
        },
        {
            onSuccess: (data) => {
                reset({
                    ...watch,
                    endereco: data.logradouro,
                    bairro: data.bairro,
                    estado: data.uf,
                    cidade: data.localidade,
                })
            },
        },
    )

    const handleBuscarCep = (cep: any) => {
        const cepFormated = cep.replaceAll('_', '')

        if (cepFormated.length === 9) {
            buscarCep(cepFormated)
        }
    }

    const onSubmit = async (data) => {
        await cadastrar.mutateAsync(data, {
            onSuccess: () => {
                reset()
                toast({
                    title: 'Sucesso!',
                    description:
                        'Imobiliária cadastrada com sucesso! Você será redirecionado',
                    status: 'success',
                })
                setTimeout(() => {
                    router.push(`https://${data.url}.imo7.com.br/login`)
                }, 2000)
            },
        })
    }

    return (
        <Stack
            bg="gray.50"
            w="100vw"
            minH="100vh"
            background="url(/img/IMAGEM-TOPO-CELULAR.png),radial-gradient(274.41% 274.41% at 50% 50%, #012659 0%, rgba(0, 0, 0, 0.00) 100%),#03132B"
            bgRepeat="no-repeat"
            bgPos="right"
            bgSize="cover"
            p={16}
        >
            <Flex
                flexDir="column"
                gap={12}
                align="center"
                justify="center"
                w="full"
                h="full"
            >
                <GridItem as={Flex} w="full" align="center" justify="center">
                    <Flex
                        as="form"
                        onSubmit={handleSubmit(onSubmit)}
                        align="center"
                        justify="center"
                        flexDir="column"
                        gap={12}
                        p={8}
                        rounded="2xl"
                        bg="rgb(255, 255, 255)"
                    >
                        <Flex
                            flexDir="column"
                            justify="center"
                            align="center"
                            gap={2}
                        >
                            <Box px={8} py={4}>
                                <Image
                                    src="/img/logo-imo7-escuro.svg"
                                    alt="Imo7"
                                />
                            </Box>
                            <Text color="white">Faça seu login</Text>
                            {error && (
                                <Flex
                                    color="red"
                                    borderWidth={1}
                                    borderColor="red"
                                    w={96}
                                    p={2}
                                >
                                    <Text w="full" textAlign="center">
                                        {error}
                                    </Text>
                                </Flex>
                            )}
                        </Flex>
                        <Box>
                            <Grid gridTemplateColumns="repeat(4, 1fr)" gap={4}>
                                <GridItem colStart={1} colSpan={2}>
                                    <FormInput
                                        size="sm"
                                        label="Razão Social"
                                        {...register('razaoSocial')}
                                        error={errors.razaoSocial?.message}
                                    />
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <FormInput
                                        size="sm"
                                        label="Nome Fantasia"
                                        {...register('nome')}
                                        error={errors.nome?.message}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="CNPJ"
                                        as={ReactInputMask}
                                        mask="99.999.999/9999-99"
                                        maskChar={null}
                                        {...register('cnpj')}
                                        error={errors.cnpj?.message}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Inscrição Estadual"
                                        {...register('ie')}
                                        error={errors.ie?.message}
                                    />
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <FormInput
                                        size="sm"
                                        label="E-mail para contato"
                                        {...register('email')}
                                        error={errors.email?.message}
                                    />
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <FormInput
                                        size="sm"
                                        label="Site"
                                        {...register('site')}
                                        error={errors.site?.message}
                                    />
                                </GridItem>

                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Telefone"
                                        {...register('telefone')}
                                        as={InputMask}
                                        mask={
                                            watch('telefone') &&
                                            watch('telefone').length == 15
                                                ? '(99) 9 9999-9999'
                                                : '(99) 99999-9999'
                                        }
                                        maskChar={null}
                                        error={errors.telefone?.message}
                                    />
                                </GridItem>
                            </Grid>
                            <Heading size="md" mt={4} mb={2}>
                                Endereço
                            </Heading>
                            <Grid gridTemplateColumns="repeat(4, 1fr)" gap={4}>
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
                                            handleBuscarCep(e.target.value)
                                        }
                                        {...register('cep')}
                                        error={errors.cep?.message}
                                    />
                                    {isLoading && <Spinner size="xs" />}
                                </GridItem>
                                <GridItem colStart={1} colSpan={3}>
                                    <FormInput
                                        size="sm"
                                        label="Endereço"
                                        {...register('endereco')}
                                        error={errors.endereco?.message}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Número"
                                        {...register('numero')}
                                        error={errors.numero?.message}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Bairro"
                                        {...register('bairro')}
                                        error={errors.bairro?.message}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormInput
                                        size="sm"
                                        label="Cidade"
                                        {...register('cidade')}
                                        error={errors.cidade?.message}
                                    />
                                </GridItem>
                                <GridItem>
                                    <FormSelect
                                        size="sm"
                                        label="Estado"
                                        {...register('estado')}
                                        error={errors.estado?.message}
                                    >
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">
                                            Distrito Federal
                                        </option>
                                        <option value="ES">
                                            Espírito Santo
                                        </option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">
                                            Mato Grosso do Sul
                                        </option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">
                                            Rio de Janeiro
                                        </option>
                                        <option value="RN">
                                            Rio Grande do Norte
                                        </option>
                                        <option value="RS">
                                            Rio Grande do Sul
                                        </option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">
                                            Santa Catarina
                                        </option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                        <option value="EX">Estrangeiro</option>
                                    </FormSelect>
                                </GridItem>
                            </Grid>
                            <Heading size="md" mt={4} mb={2}>
                                Acesso personalizado
                            </Heading>
                            <Grid gridTemplateColumns="repeat(4, 1fr)" gap={4}>
                                <GridItem colSpan={2}>
                                    <FormInput
                                        size="sm"
                                        label="URL"
                                        {...register('url')}
                                        error={errors.url?.message}
                                        rightAddon=".imo7.com.br"
                                    />
                                </GridItem>
                            </Grid>
                            <Heading size="md" mt={4} mb={2}>
                                Administrador
                            </Heading>
                            <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
                                <GridItem colSpan={1}>
                                    <FormInput
                                        size="sm"
                                        label="Nome"
                                        {...register('usuario.nome')}
                                        error={errors.usuario?.nome?.message}
                                    />
                                </GridItem>
                                <GridItem colSpan={1}>
                                    <FormInput
                                        size="sm"
                                        label="CPF"
                                        {...register('usuario.documento')}
                                        error={
                                            errors.usuario?.documento?.message
                                        }
                                    />
                                </GridItem>
                                <GridItem colSpan={1}>
                                    <FormInput
                                        size="sm"
                                        label="E-mail"
                                        {...register('usuario.email')}
                                        error={errors.usuario?.email?.message}
                                    />
                                </GridItem>{' '}
                                <GridItem colSpan={1}>
                                    <FormInput
                                        size="sm"
                                        type="password"
                                        label="Senha"
                                        {...register('usuario.senha')}
                                        error={errors.usuario?.senha?.message}
                                    />
                                </GridItem>{' '}
                                <GridItem colSpan={1}>
                                    <FormInput
                                        size="sm"
                                        type="password"
                                        label="Confirmar senha"
                                        {...register('usuario.confirmarSenha')}
                                        error={
                                            errors.usuario?.confirmarSenha
                                                ?.message
                                        }
                                    />
                                </GridItem>
                                <GridItem
                                    colStart={{ lg: 1 }}
                                    colSpan={{ lg: 3 }}
                                    textAlign="center"
                                >
                                    <Button
                                        type="submit"
                                        borderRadius={0}
                                        colorScheme="blue"
                                        rightIcon={<Icon as={FaSignInAlt} />}
                                        isLoading={isSubmitting}
                                        spinner={
                                            <BeatLoader
                                                size={8}
                                                color="white"
                                            />
                                        }
                                    >
                                        Cadastrar
                                    </Button>
                                </GridItem>
                            </Grid>
                        </Box>
                    </Flex>
                </GridItem>
            </Flex>
        </Stack>
    )
}

export default SignIn

// export const getServerSideProps = withSSRGuest<any>(async (ctx) => {
//     return {
//         props: {},
//     };
// });
