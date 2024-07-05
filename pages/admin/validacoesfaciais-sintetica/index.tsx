import { FormDateRange } from '@/components/Form/FormDateRange'
import { FormInput } from '@/components/Form/FormInput'
import { Layout } from '@/components/Layout/layout'
import { useAuth } from '@/hooks/useAuth'
import { listarValidacoesFaciaisSintetico } from '@/services/models/validacaofacial'
import {
    Box,
    Heading,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { FaFileExcel, FaFilePdf } from 'react-icons/fa'
import { FiEdit, FiEye, FiLink, FiPlus, FiTrash } from 'react-icons/fi'
import { MdOutlineVerifiedUser, MdAccessibilityNew } from 'react-icons/md'
import { exportToExcel } from 'react-json-to-excel'
import { useMutation, useQuery } from 'react-query'
import { getAll } from '@/services/models/imobiliaria'

const filtroPadrao = {
    query: '',
    identificacao: '',
    createdAt: [null, null],
    updatedAt: [null, null],
    status: [],
    responsaveis: [],
    nomeImobiliaria: '',
    token: null
}
const FichasCadastrais = () => {
    const { usuario } = useAuth()
    const [filtro, setFiltro] = useState(filtroPadrao)

    const { data } = useQuery<{
        id: number;
        razaoSocial: string;
        totalValidacaoFacial: number;
    }[]>
        (
            [
                'validacao-facial-imobiliarias',
                {
                    ...filtro,
                    createdAt: filtro.createdAt[0]
                        ? JSON.stringify(filtro.createdAt)
                        : null,
                    updatedAt: filtro.updatedAt[0]
                        ? JSON.stringify(filtro.updatedAt)
                        : null,
                    // status: filtro.status[0] ? JSON.stringify(filtro.status) : null,
                    // responsaveis: filtro.responsaveis[0] ? JSON.stringify(filtro.responsaveis) : null,
                },
            ],
            listarValidacoesFaciaisSintetico,
        )
    return (
        <Layout>
            <Box p={4}>
                <Box mb={6}>
                    <Heading size="md" color="gray.600">
                        Validações faciais
                    </Heading>
                    <Text color="gray" fontSize="sm" fontStyle="italic">
                        Acompanhe o extrato de validações faciais
                    </Text>
                </Box>
                <Box>
                    <Text>Resultados {data?.length}</Text>
                </Box>
                <Box display='flex'>
                    <FormDateRange
                        size="sm"
                        label="Data de Criação"
                        startDate={filtro?.createdAt[0]}
                        endDate={filtro?.createdAt[1]}
                        onChange={(e) => {
                            setFiltro({
                                ...filtro,
                                createdAt: e,
                            });
                        }}
                    />
                    <FormInput
                        size="sm"
                        label="Nome Imobiliaria"
                        onChange={(e) => {
                            setFiltro({
                                ...filtro,
                                nomeImobiliaria: e.target.value,
                            });
                        }}
                        list='imobiliarias'
                    />

                    <datalist id='imobiliarias'>
                        {
                            data?.map(({ id, razaoSocial }) => (
                                <option key={id} value={razaoSocial} />
                            ))
                        }
                    </datalist>
                </Box>

                <Box>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Razão Social</Th>
                                <Th>Validações Faciais</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                data?.map(({ id, razaoSocial, totalValidacaoFacial }) => (
                                    <Tr key={id}>
                                        <Td>{razaoSocial}</Td>
                                        <Td>{totalValidacaoFacial}</Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Layout >
    )
}

export default FichasCadastrais
