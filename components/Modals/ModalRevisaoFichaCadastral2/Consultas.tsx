import {
    Flex,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react'
import { Consulta } from './Consulta'
import { ValidacaoFacial } from './ValidacaoFacial'

interface TipoConsultaProps {
    tipoConsultas?: string[]
    ficha: any
    cpf?: string
    cnpj?: string
    uf?: string
    dataNascimento: string
    campoFichaCadastralCodigo: string
}

import imageCDP from '../../../assets/cartorio-de-protesto.svg'
import imageEndereco from '../../../assets/endereco.svg'
import imageRF from '../../../assets/receita-federal.svg'
import imageTJ from '../../../assets/tribunal-de-justica-tj.svg'
import imageCNDFederal from '../../../assets/cnd-federal-cpf.jpg'
import imageCNDTrabalhista from '../../../assets/cnd-trabalhista-tst.jpg'
import imageKYCCompliance from '../../../assets/kyc-e-compliance.jpg'
import imageCNPJsRealacioonadoCPF from '../../../assets/cnpjs-e-socios-relacionado-a-esse-cpf.jpg'
import imageReceitaQSA from '../../../assets/receita-federal-cnpj-qsa.jpg'

const EnumTipoConsulta = {
    CPF: 'CPF',
    CNPJ: 'CNPJ',
    CPF_CNPJ: 'CPF_CNPJ',
}

export const Consultas = ({
    ficha,
    cpf,
    cnpj,
    dataNascimento,
    campoFichaCadastralCodigo,
}: TipoConsultaProps) => {
    function filtrarConsultas(tipoConsulta: string) {
        return (
            <Flex gap={2} py={3} flexWrap="wrap">
                {tipoConsulta === EnumTipoConsulta.CPF && cpf && (
                    <ValidacaoFacial
                        cpf={cpf}
                        fichaCadastralId={ficha.id}
                        campoFichaCadastralCodigo={campoFichaCadastralCodigo}
                    />
                )}

                {consultasNetrin
                    .filter((consulta) =>
                        consulta.tipoConsulta.includes(tipoConsulta),
                    )
                    .map((consulta) => (
                        <Consulta
                            key={consulta.codigo}
                            consulta={consulta}
                            ficha={ficha}
                            cpf={cpf}
                            cnpj={cnpj}
                            dataNascimento={dataNascimento}
                        />
                    ))}
            </Flex>
        )
    }

    return (
        <Flex flexDir="column">
            <Tabs colorScheme="blue" variant="enclosed">
                <TabList>
                    {cpf && (
                        <Tab fontWeight="bold" fontSize="sm">
                            Consultas de CPF
                        </Tab>
                    )}
                    {cnpj && (
                        <Tab fontWeight="bold" fontSize="sm">
                            Consultas de CNPJ
                        </Tab>
                    )}
                </TabList>

                <TabPanels>
                    {cpf && (
                        <TabPanel
                            border="1px"
                            borderColor="#e1e8f0"
                            rounded="md"
                            roundedTopLeft={0}
                        >
                            <Text mb={2}>
                                CPF: <strong>{cpf}</strong>
                            </Text>

                            {filtrarConsultas(EnumTipoConsulta.CPF)}
                        </TabPanel>
                    )}

                    {cnpj && (
                        <TabPanel
                            border="1px"
                            borderColor="#e1e8f0"
                            rounded="md"
                            roundedTopLeft={0}
                        >
                            <Text mb={2}>
                                CNPJ: <strong>{cnpj}</strong>
                            </Text>

                            {filtrarConsultas(EnumTipoConsulta.CNPJ)}
                        </TabPanel>
                    )}
                </TabPanels>
            </Tabs>
        </Flex>
    )
}

const consultasNetrin = [
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: 'endereco_cpf',
        nome: 'Endereços',
        image: imageEndereco,
        size: ['2rem', '2rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: 'receita_federal_cpf',
        nome: 'Situação Cadastral do CPF',
        image: imageRF,
        size: ['4rem', '4rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: 'processos_pf',
        nome: 'Tribunal de Justiça (território Nacional)',
        image: imageTJ,
        size: ['2rem', '2rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: 'protestos_pf',
        nome: 'Protestos PF',
        image: imageCDP,
        size: ['4rem', '4rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CNPJ],
        codigo: 'protestos_pj',
        nome: 'Protestos PJ',
        image: imageCDP,
        size: ['4rem', '4rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: 'empresas_relacionadas_cpf',
        nome: 'CNPJ´S e Sócios relacionado a esse CPF',
        image: imageCNPJsRealacioonadoCPF,
        size: ['2rem', '2rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CNPJ],
        codigo: 'pessoas_relacionadas_cnpj',
        nome: 'Pessoas Relacionadas ao CNPJ',
        image: imageCNPJsRealacioonadoCPF,
        size: ['2rem', '2rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: 'pep_kyc_cpf',
        nome: 'KYC e Compliance',
        image: imageKYCCompliance,
        size: ['2rem', '2rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CNPJ],
        codigo: 'receita_federal_cnpj_qsa',
        nome: 'Receita Federal CNPJ QSA',
        image: imageReceitaQSA,
        size: ['2rem', '2rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CNPJ],
        codigo: 'receita_federal_cnd_cnpj',
        nome: 'CND Federal CNPJ',
        image: imageCNDFederal,
        size: ['2rem', '2rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: 'receita_federal_cnd_cpf',
        nome: 'CND Federal CPF',
        image: imageCNDFederal,
        size: ['2rem', '2rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: 'cnd_trabalhista_cpf',
        nome: 'CND Trabalhista TST',
        image: imageCNDTrabalhista,
        size: ['2rem', '2rem'],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CNPJ],
        codigo: 'cnd_trabalhista_cnpj',
        nome: 'CND Trabalhista TST',
        image: imageCNDTrabalhista,
        size: ['2rem', '2rem'],
    },
]
