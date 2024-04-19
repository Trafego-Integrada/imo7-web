import { useMemo, useRef, useState } from 'react'
import { FiEye, FiSearch } from 'react-icons/fi'
import Image from 'next/image'
import { useQuery } from 'react-query'
import { Button, Flex, Icon, Text, Tooltip, useToast } from '@chakra-ui/react'
import { api } from '@/services/apiClient'
import { queryClient } from '@/services/queryClient'

import { ModalEndereco } from './Endereco/Modal'
import { ModalSituacaoCadastral } from './SituacaoCadastral/Modal'
import { ModalTribunalJustica } from './TribunalJustica/Modal'
import { ModalEmpresaRelacionada } from './EmpresaRelacionada/Modal'
import { ModalPessoaRelacionada } from './PessoaRelacionada/Modal'
import { ModalKYCCompliance } from './KYCCompliance/Modal'
import { ModalConfirmarConsulta } from './KYCCompliance/ModalConfirmarConsulta'
import { ModalReceitaFederalQSA } from './ReceitaFederalQSA/Modal'
import { ModalReceitaFederalCND } from './ReceitaFederalCND/Modal'
import { ModalCNDTrabalhista } from './CNDTrabalhista/Modal'
import { validarData } from '@/utils/validarData'

interface TipoConsultaProps {
    ficha: any
    consulta: any
    cpf?: string
    cnpj?: string
    uf?: string
    dataNascimento?: string
}

interface Retorno {
    processosCPF?: { totalProcessos: number }
    enderecoCPF?: { endereco: string[] }
    empresasRelacionadasCPF?: { negociosRelacionados: { length: number } }
    pessoasRelacionadasCNPJ?: { entidadesRelacionadas: { length: number } }
    pepKyc?: { historyPEP: { length: number } }
    receitaFederalQsa?: { qsa: { length: number } }
}

export const Consulta = ({
    consulta,
    ficha,
    cpf,
    cnpj,
    dataNascimento,
}: TipoConsultaProps) => {
    const toast = useToast()

    const modalTribunalJustica = useRef()
    const modalEndereco = useRef()
    const modalSituacaoCadastral = useRef()
    const modalEmpresaRelacionada = useRef()
    const modalPessoaRelacionada = useRef()
    const modalKYCCompliance = useRef()
    const modalConfirmarConsulta = useRef()
    const modalReceitaFederalQSA = useRef()
    const modalReceitaFederalCND = useRef()
    const modalCNDTrabalhista = useRef()

    const [id, setId] = useState<string>('')
    const [retorno, setRetorno] = useState<any | null>(null)
    const [retornoCount, setRetornoCount] = useState(0)

    const [consultandoNetrin, setConsultandoNetrin] = useState(false)

    const deveRenderizar = useMemo(() => {
        let validaCpf = false
        let validaCnpj = false

        if (consulta.tipoConsulta.includes('CPF')) validaCpf = !!cpf
        if (consulta.tipoConsulta.includes('CNPJ')) validaCnpj = !!cnpj

        return validaCpf || validaCnpj
    }, [consulta, cpf, cnpj])

    const consultarNetrin = async (data: any) => {
        try {
            setConsultandoNetrin(true)

            await api.post('v1/integracao/netrin', {
                ...data,
                processoId: ficha.processoId,
                fichaCadastralId: ficha.id,
            })

            queryClient.invalidateQueries(['consultasNetrin'])

            toast({
                title: 'Consulta realizada com sucesso, entre na aba consultas para visualizar o documento',
                status: 'success',
            })

            setConsultandoNetrin(false)
        } catch (error: any) {
            setConsultandoNetrin(false)

            toast({
                title: 'Houve um problema',
                description: error?.response?.data?.message,
                status: 'warning',
            })
        }
    }

    useQuery(
        [
            'consultasNetrin',
            consulta.codigo,
            {
                fichaCadastralId: ficha.id,
            },
        ],
        async ({ queryKey }: any) => {
            try {
                const { data } = await api.get('v1/integracao/netrin', {
                    params: { ...queryKey[1] },
                })

                const resultado = data.find(
                    (item) =>
                        item.tipoConsulta === consulta.codigo &&
                        item.requisicao.cpf === cpf &&
                        item.requisicao.cnpj === cnpj,
                )

                if (!resultado)
                    throw new Error('Nenhum dado correspondente encontrado')

                const { id, retorno } = resultado

                setId(id)
                setRetorno(retorno)
                setRetornoCount(calcularContagem(retorno, consulta.codigo))

                return data
            } catch (error) {
                console.error('Erro na requisição:', error)
                throw new Error('Falha ao buscar dados da API')
            }
        },
    )

    function abrirResultados() {
        const modais: Record<string, () => void> = {
            processos_pf: () =>
                modalTribunalJustica?.current?.onOpen(getPdfUrl(id)),
            endereco_cpf: () =>
                modalEndereco?.current?.onOpen({ data: retorno }),
            receita_federal_cpf: () =>
                modalSituacaoCadastral?.current?.onOpen({ data: retorno }),
            empresas_relacionadas_cpf: () =>
                modalEmpresaRelacionada?.current?.onOpen({ data: retorno }),
            pessoas_relacionadas_cnpj: () =>
                modalPessoaRelacionada?.current?.onOpen({ data: retorno }),
            pep_kyc_cpf: () =>
                modalKYCCompliance?.current?.onOpen({ data: retorno }),
            receita_federal_cnpj_qsa: () =>
                modalReceitaFederalQSA?.current?.onOpen({ data: retorno }),
            receita_federal_cnd_cpf: () =>
                modalReceitaFederalCND?.current?.onOpen({ data: retorno }),
            receita_federal_cnd_cnpj: () =>
                modalReceitaFederalCND?.current?.onOpen({ data: retorno }),
            cnd_trabalhista_cpf: () =>
                modalCNDTrabalhista?.current?.onOpen({ data: retorno }),
            cnd_trabalhista_cnpj: () =>
                modalCNDTrabalhista?.current?.onOpen({ data: retorno }),
        }

        const action = modais[consulta?.codigo]

        if (action) return action()
    }

    function getPdfUrl(id: string) {
        const baseUrl =
            process.env.NODE_ENV === 'production'
                ? 'https://www.imo7.com.br'
                : 'http://localhost:3000'
        return `${baseUrl}/api/v1/integracao/netrin/${id}/pdf`
    }

    function abrirConfirmarConsulta() {
        if (consulta?.codigo === 'pep_kyc_cpf')
            return modalConfirmarConsulta?.current?.onOpen()
    }

    if (!deveRenderizar) return null

    function calcularContagem(
        retorno: Retorno,
        codigoConsulta: string,
    ): number {
        const mapeamento: Record<string, () => number> = {
            processos_pf: () => retorno.processosCPF?.totalProcessos ?? 0,
            endereco_cpf: () => retorno.enderecoCPF?.endereco?.length ?? 0,
            empresas_relacionadas_cpf: () =>
                retorno.empresasRelacionadasCPF?.negociosRelacionados?.length ??
                0,
            pessoas_relacionadas_cnpj: () =>
                retorno.pessoasRelacionadasCNPJ?.entidadesRelacionadas
                    ?.length ?? 0,
            pep_kyc_cpf: () => retorno.pepKyc?.historyPEP?.length ?? 0,
            receita_federal_cnpj_qsa: () =>
                retorno.receitaFederalQsa?.qsa?.length ?? 0,
            receita_federal_cnd_cnpj: () => 1,
            receita_federal_cnd_cpf: () => 1,
            receita_federal_cpf: () => 1,
            cnd_trabalhista_cpf: () => 1,
            cnd_trabalhista_cnpj: () => 1,
        }

        return (mapeamento[codigoConsulta] || (() => 0))()
    }

    return (
        <Flex
            key={consulta.codigo}
            rounded="lg"
            borderWidth={1}
            flexDir="column"
            justify="space-between"
            w="12rem"
        >
            <Flex
                flexDir="column"
                gap={3}
                align="center"
                justify="center"
                h="full"
                p={4}
            >
                <Image
                    alt="Receita Federal"
                    src={consulta.image}
                    style={{
                        width: consulta.size[0],
                        height: consulta.size[1],
                    }}
                />

                <Flex align="center">
                    <Text fontSize="small" textAlign="center" fontWeight="bold">
                        {consulta?.nome}
                    </Text>
                </Flex>
            </Flex>

            {!retorno && (
                <Button
                    w="full"
                    variant="outline"
                    size="xs"
                    border={0}
                    borderTop="1px"
                    borderColor="#e1e8f0"
                    rounded={0}
                    py="1rem"
                    leftIcon={<Icon as={FiSearch} />}
                    onClick={() => {
                        if (
                            consulta?.codigo === 'receita_federal_cpf' &&
                            (!dataNascimento || validarData(dataNascimento))
                        ) {
                            return toast({
                                title: 'Data de nascimento inválida',
                                status: 'error',
                            })
                        }

                        if (consulta?.codigo === 'pep_kyc_cpf')
                            abrirConfirmarConsulta()
                        else
                            consultarNetrin({
                                tipoConsulta: consulta.codigo,
                                requisicao: {
                                    cpf,
                                    cnpj,
                                    dataNascimento,
                                },
                            })
                    }}
                    isLoading={consultandoNetrin}
                >
                    Consultar
                </Button>
            )}

            {retorno && (
                <Tooltip label="Visualizar Arquivo">
                    <Button
                        variant="outline"
                        size="xs"
                        border={0}
                        borderTop="1px"
                        borderColor="#e1e8f0"
                        rounded={0}
                        py="1rem"
                        leftIcon={<Icon as={FiEye} />}
                        onClick={abrirResultados}
                        background="#3283cf"
                        textColor="white"
                        _hover={{
                            bg: '#3283cf',
                            opacity: '.8',
                        }}
                    >
                        {retornoCount} Resultados
                    </Button>
                </Tooltip>
            )}

            <ModalTribunalJustica ref={modalTribunalJustica} />
            <ModalEndereco ref={modalEndereco} />
            <ModalSituacaoCadastral ref={modalSituacaoCadastral} />
            <ModalEmpresaRelacionada ref={modalEmpresaRelacionada} />
            <ModalPessoaRelacionada ref={modalPessoaRelacionada} />
            <ModalKYCCompliance ref={modalKYCCompliance} />
            <ModalConfirmarConsulta
                ref={modalConfirmarConsulta}
                consultarNetrin={() =>
                    consultarNetrin({
                        tipoConsulta: consulta.codigo,
                        requisicao: {
                            cpf,
                            cnpj,
                            dataNascimento,
                        },
                    })
                }
            />
            <ModalReceitaFederalQSA ref={modalReceitaFederalQSA} />
            <ModalReceitaFederalCND ref={modalReceitaFederalCND} />
            <ModalCNDTrabalhista ref={modalCNDTrabalhista} />
        </Flex>
    )
}
