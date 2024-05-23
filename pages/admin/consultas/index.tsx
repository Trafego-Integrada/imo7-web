import { FormDateRange } from '@/components/Form/FormDateRange'
import { FormInput } from '@/components/Form/FormInput'
import { Layout } from '@/components/Layout/layout'
import { useAuth } from '@/hooks/useAuth'
import {
    Box,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Heading
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { listarConsultasNetrinAdm } from '@/services/models/consultaNetrin'

const filtroPadrao = {
    query: '',
    identificacao: '',
    createdAt: [null, null],
    updatedAt: [null, null],
    status: [],
    responsaveis: [],
    nomeImobiliaria: ''
}
const FichasCadastrais = () => {
    const [filtro, setFiltro] = useState(filtroPadrao)

    const { data } = useQuery(
        [
            'consultas-netrin-adm',
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
        listarConsultasNetrinAdm,
    )
    return (
        <Layout title='Consultas Netrin'>
            <Box display='flex' flexDirection='column' gap={4} p={4}>
                <Box>
                    <Heading>Extrato de consultas simples por imobiliária</Heading>
                </Box>
                <Box display='flex' >
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
                        label="Nome da Imobiliária"
                        placeholder="digite o nome da imobiliária..."
                        onChange={(e) =>
                            setFiltro({
                                ...filtro,
                                nomeImobiliaria: e.target.value,
                            })
                        }
                        list='imobiliarias'
                    />
                    <datalist id='imobiliarias'>
                        {data?.consultas?.map(({ imobiliaria }) => (
                            <option key={imobiliaria.id} value={imobiliaria.nomeFantasia}>{imobiliaria.nomeFantasia}</option>
                        ))}
                    </datalist>
                </Box>
                <Box>
                    <Text>Foram encontrados {data?.resultados} resultados</Text>
                </Box>
                <TableContainer>
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th>Imobiliaria</Th>
                                <Th>Consultas Realizadas</Th>
                                <Th>Limite Contratado</Th>
                                <Th>Excedeu</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                data?.consultas?.map(({ imobiliaria, count, excedeu }) => (
                                    <Tr key={imobiliaria.id}>
                                        <Td>{imobiliaria.nomeFantasia}</Td>
                                        <Td>{count}</Td>
                                        <Td>{imobiliaria.limiteConsultas}</Td>
                                        <Td
                                            textColor={excedeu > 0 ? 'red' : 'black'}
                                            fontWeight={excedeu > 0 ? 700 : 300}
                                        >{excedeu}</Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Layout >
    )
}

export default FichasCadastrais
