import { Excluir } from '@/components/AlertDialogs/Excluir'
import { FormDateRange } from '@/components/Form/FormDateRange'
import { FormInput } from '@/components/Form/FormInput'
import { FormMultiSelect } from '@/components/Form/FormMultiSelect'
import { FormSelect } from '@/components/Form/FormSelect'
import { Layout } from '@/components/Layout/layout'
import { ModalFichaCadastral } from '@/components/Modals/ModalFichaCadastral'
import { ModalRevisaoFichaCadastral } from '@/components/Modals/ModalRevisaoFichaCadastral'
import { ModalRevisaoFichaCadastral2 } from '@/components/Modals/ModalRevisaoFichaCadastral2'
import { ModalValidar } from '@/components/Modals/ModalValidar'

import {
    arrayStatusFicha,
    formatoData,
    statusFicha,
    tipoFicha,
} from '@/helpers/helpers'
import { useAuth } from '@/hooks/useAuth'
import { excluirFicha, listarFichas } from '@/services/models/fichaCadastral'
import { listarValidacoesFaciaisAdm } from '@/services/models/validacaofacial'
import { queryClient } from '@/services/queryClient'
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    IconButton,
    Progress,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useToast,
    Image,
    GridItem,
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
    nomeImobiliaria: ''
}
const FichasCadastrais = () => {
    const { usuario } = useAuth()
    const [filtro, setFiltro] = useState(filtroPadrao)
    const modalRevisar = useRef()

    const { data: fichas } = useQuery(
        [
            'fichas',
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
        listarValidacoesFaciaisAdm,
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
                        {fichas?.imobiliarias?.map(({ id, nomeFantasia }) => (
                            <option key={id} value={nomeFantasia}>{nomeFantasia}</option>
                        ))}
                    </datalist>
                </Box>
                <Box>
                    <Text>Foram encontrados {fichas?.total} registos</Text>
                </Box>
                <Box>
                    {/* <Box bg="white" p={4} mb={4}>
                        <Flex align="center" justify="space-between">
                            <Heading size="sm" mb={2}>
                                Filtro avançado
                            </Heading>
                            <Button
                                variant="outline"
                                size="sm"
                                colorScheme="gray"
                                onClick={() => setFiltro(filtroPadrao)}
                            >
                                Limpar filtro
                            </Button>
                        </Flex>
                        <Flex gap={2} flexDir={{ lg: "row", base: "column" }}>
                            <FormInput
                                size="sm"
                                minW={32}
                                label="Codigo"
                                placeholder="Por codigo"
                                value={filtro.codigo}
                                onChange={(e) =>
                                    setFiltro({
                                        ...filtro,
                                        codigo: e.target.value,
                                    })
                                }
                            />
                            <FormInput
                                size="sm"
                                minW={96}
                                label="Identificação"
                                placeholder="Por nome, cpf/cnpj, telefone ou e-mail"
                                value={filtro.identificacao}
                                onChange={(e) =>
                                    setFiltro({
                                        ...filtro,
                                        identificacao: e.target.value,
                                    })
                                }
                            />
                            <FormDateRange
                                minW={44}
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
                            <FormDateRange
                                minW={44}
                                size="sm"
                                label="Data de Atualização"
                                startDate={filtro?.updatedAt[0]}
                                endDate={filtro?.updatedAt[1]}
                                onChange={(e) => {
                                    setFiltro({
                                        ...filtro,
                                        updatedAt: e,
                                    });
                                }}
                            />
                            <FormMultiSelect
                                placeholder="Selecione..."
                                minW={44}
                                size="sm"
                                label="Status"
                                value={arrayStatusFicha.filter((i) =>
                                    filtro.status.includes(i.value)
                                )}
                                onChange={(e) => {
                                    setFiltro({
                                        ...filtro,
                                        status: e.map((i) => i.value),
                                    });
                                }}
                                isMulti
                                options={arrayStatusFicha}
                            />
                            <FormMultiSelect
                                minW={44}
                                size="sm"
                                label="Responsável"
                                value={filtro.responsaveis}
                                onChange={(e) => {
                                    setFiltro({
                                        ...filtro,
                                        responsaveis: e,
                                    });
                                }}
                                isMulti
                                placeholder="Selecione..."
                                options={responsaveis?.data?.data}
                                getOptionLabel={(e) => e.nome}
                                getOptionValue={(e) => e.id}
                            />
                        </Flex>
                    </Box> */}

                    {/* <Flex
                        justify="space-between"
                        align="center"
                        bg="white"
                        p={4}
                    >
                        <Flex gap={4} align="center">
                            <Flex gap={4}>
                                <FormInput
                                    size="sm"
                                    minW={96}
                                    label="Pesquisa rápida"
                                    value={filtro.query}
                                    onChange={(e) =>
                                        setFiltro({
                                            ...filtro,
                                            query: e.target.value,
                                        })
                                    }
                                />
                            </Flex>
                            <Text fontSize="xs" color="gray" w="full">
                                <Text as="span" fontWeight="bold">
                                    {fichas?.total}
                                </Text>{" "}
                                fichas cadastrais encontradas
                            </Text>
                        </Flex>
                        <Flex gap={2}>
                            {usuario?.permissoes?.includes(
                                "imobiliaria.fichas.visualizarExcluidas"
                            ) && (
                                <Link href="/admin/fichas/excluidas">
                                    <Button
                                        size="sm"
                                        leftIcon={<Icon as={FiTrash} />}
                                        colorScheme="blue"
                                    >
                                        Excluidas
                                    </Button>
                                </Link>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<Icon as={FaFileExcel} />}
                                colorScheme="blue"
                                onClick={() => {
                                    exportToExcel(
                                        fichas?.data,
                                        "fichas-cadastrais"
                                    );
                                }}
                            >
                                Exportar para Excel
                            </Button>
                            {usuario?.permissoes?.includes(
                                "imobiliaria.fichas.cadastrar"
                            ) && (
                                <Button
                                    size="sm"
                                    leftIcon={<Icon as={FiPlus} />}
                                    colorScheme="blue"
                                    onClick={() => modal.current.onOpen()}
                                >
                                    Novo
                                </Button>
                            )}
                        </Flex>
                    </Flex> */}

                    <Box bg="white" mt={4} p={4}>
                        <TableContainer>
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Imobiliaria</Th>
                                        {/* <Th w={44}>Tipo</Th> */}
                                        <Th>CPF</Th>
                                        <Th>FOTO</Th>
                                        <Th>TOKEN</Th>
                                        <Th>SIMILARIDADE</Th>
                                        {/* <Th w={44}>Responsável</Th> */}
                                        <Th>Criado em</Th>
                                        <Th>Última atualização</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {fichas?.data?.length > 0 ? (
                                        fichas.data.map((item) => (
                                            <Tr key={item.id}>
                                                <Td>
                                                    {item.imobiliaria.nomeFantasia}
                                                    {/* <Tooltip label="Validar CPF">
                                                            <IconButton
                                                                colorScheme="green"
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            MdAccessibilityNew
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() =>
                                                                    modalValidar.current.onOpen(
                                                                        item.id
                                                                    )
                                                                }
                                                            />
                                                        </Tooltip> */}
                                                    {usuario?.permissoes?.includes(
                                                        'imobiliaria.fichas.revisar',
                                                    ) && (
                                                            <Tooltip label="Revisar Ficha">
                                                                <IconButton
                                                                    colorScheme="green"
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    icon={
                                                                        <Icon
                                                                            as={
                                                                                MdOutlineVerifiedUser
                                                                            }
                                                                        />
                                                                    }
                                                                    onClick={() =>
                                                                        modalRevisar.current.onOpen(
                                                                            item.fichaCadastralId,
                                                                        )
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    {/* {usuario?.permissoes?.includes(
                                                        "imobiliaria.fichas.editar"
                                                    ) && (
                                                        <Tooltip label="Editar Ficha">
                                                            <IconButton
                                                                colorScheme="blue"
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiEdit
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() =>
                                                                    modal.current.onOpen(
                                                                        item.id
                                                                    )
                                                                }
                                                            />
                                                        </Tooltip>
                                                    )} */}
                                                    {/* <Tooltip label="Copiar URL da Ficha">
                                                        <IconButton
                                                            size="sm"
                                                            variant="ghost"
                                                            icon={
                                                                <Icon
                                                                    as={FiLink}
                                                                />
                                                            }
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    `${window.location.origin}/fichaCadastral/${item.id}`
                                                                );
                                                                toast({
                                                                    title: "URL Copiada",
                                                                });
                                                            }}
                                                        />
                                                    </Tooltip> */}
                                                    {/* <Tooltip label="Visualizar Ficha">
                                                        <Link
                                                            href={`/fichaCadastral/${item.id}`}
                                                            target="_blank"
                                                        >
                                                            <IconButton
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiEye
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </Link>
                                                    </Tooltip> */}
                                                    {/* <Tooltip label="Exportar para Excel">
                                                        <IconButton
                                                            size="sm"
                                                            variant="ghost"
                                                            icon={
                                                                <Icon
                                                                    as={
                                                                        FaFileExcel
                                                                    }
                                                                />
                                                            }
                                                            onClick={() =>
                                                                exportToExcel(
                                                                    item.preenchimento,
                                                                    "ficha-cadastral-" +
                                                                        item.id
                                                                )
                                                            }
                                                        />
                                                    </Tooltip> */}
                                                    {/* <Tooltip label="Gerar PDF">
                                                        <Link
                                                            href={`https://www.imo7.com.br/api/fichaCadastral/${item.id}/pdf`}
                                                            target="_blank"
                                                            passHref
                                                        >
                                                            <IconButton
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FaFilePdf
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </Link>
                                                    </Tooltip> */}
                                                    {/* {usuario?.permissoes?.includes(
                                                        "imobiliaria.fichas.excluir"
                                                    ) && (
                                                        <Tooltip label="Excluir Ficha">
                                                            <IconButton
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiTrash
                                                                        }
                                                                    />
                                                                }
                                                                colorScheme="red"
                                                                onClick={() => {
                                                                    modalExcluir.current.onOpen(
                                                                        item.id
                                                                    );
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )} */}
                                                </Td>
                                                <Td>{item.cpf}</Td>
                                                <Td>
                                                    {item.fotoUrl ? (
                                                        <Image
                                                            borderRadius="2xl"
                                                            src={item.fotoUrl}
                                                            width={20}
                                                            height={20}
                                                            objectFit="cover"
                                                        />
                                                    ) : (
                                                        <Text fontWeight="bold">
                                                            Foto não enviada
                                                        </Text>
                                                    )}
                                                </Td>
                                                <Td>
                                                    <Text fontWeight="bold">
                                                        {
                                                            JSON.parse(
                                                                item.resultado,
                                                            )?.token
                                                        }
                                                    </Text>
                                                </Td>
                                                <Td>
                                                    {item.status == 1 && (
                                                        <Box pos="relative">
                                                            <Tooltip
                                                                label={'L1'}
                                                            >
                                                                <Box>
                                                                    <Progress
                                                                        size="lg"
                                                                        value={
                                                                            JSON.parse(
                                                                                item.resultado,
                                                                            )
                                                                                ?.biometria_face
                                                                                ?.similaridade *
                                                                            100
                                                                        }
                                                                        max={
                                                                            100
                                                                        }
                                                                        colorScheme={
                                                                            JSON.parse(
                                                                                item.resultado,
                                                                            )?.biometria_face?.probabilidade.indexOf(
                                                                                'Altíssima ',
                                                                            ) >=
                                                                                0
                                                                                ? 'green'
                                                                                : JSON.parse(
                                                                                    item.resultado,
                                                                                )?.biometria_face?.probabilidade.indexOf(
                                                                                    'Alta ',
                                                                                ) >=
                                                                                    0
                                                                                    ? 'blue'
                                                                                    : JSON.parse(
                                                                                        item.resultado,
                                                                                    )?.biometria_face?.probabilidade.indexOf(
                                                                                        'Baixa ',
                                                                                    ) >=
                                                                                        0
                                                                                        ? 'orange'
                                                                                        : 'red'
                                                                        }
                                                                    />
                                                                </Box>
                                                            </Tooltip>
                                                            <Flex
                                                                pos="absolute"
                                                                top="0"
                                                                justify="center"
                                                                mx="auto"
                                                                w="full"
                                                            >
                                                                <Text
                                                                    textAlign="center"
                                                                    fontSize="xs"
                                                                    color={
                                                                        JSON.parse(
                                                                            item.resultado,
                                                                        )?.biometria_face?.probabilidade.indexOf(
                                                                            'Altíssima ',
                                                                        ) >= 0
                                                                            ? 'white'
                                                                            : 'white'
                                                                    }
                                                                >
                                                                    {Math.floor(
                                                                        JSON.parse(
                                                                            item.resultado,
                                                                        )
                                                                            ?.biometria_face
                                                                            ?.similaridade *
                                                                        100,
                                                                    ) || 0}{' '}
                                                                    %
                                                                </Text>
                                                            </Flex>
                                                            <Text
                                                                textAlign="center"
                                                                fontSize="xs"
                                                                color={
                                                                    JSON.parse(
                                                                        item.resultado,
                                                                    )?.biometria_face?.probabilidade.indexOf(
                                                                        'Altíssima ',
                                                                    ) >= 0
                                                                        ? 'green'
                                                                        : JSON.parse(
                                                                            item.resultado,
                                                                        )?.biometria_face?.probabilidade.indexOf(
                                                                            'Alta ',
                                                                        ) >= 0
                                                                            ? 'blue'
                                                                            : JSON.parse(
                                                                                item.resultado,
                                                                            )?.biometria_face?.probabilidade.indexOf(
                                                                                'Baixa ',
                                                                            ) >= 0
                                                                                ? 'orange'
                                                                                : 'red'
                                                                }
                                                            >
                                                                {
                                                                    JSON.parse(
                                                                        item.resultado,
                                                                    )
                                                                        ?.biometria_face
                                                                        ?.probabilidade
                                                                }
                                                            </Text>
                                                        </Box>
                                                    )}
                                                </Td>

                                                {/* <Td>
                                                    {item.responsavel?.nome}
                                                </Td> */}
                                                <Td>
                                                    {formatoData(
                                                        item.createAt,
                                                        'DATA_HORA',
                                                    )}
                                                </Td>
                                                <Td>
                                                    {formatoData(
                                                        item.updatedAt,
                                                        'DATA_HORA',
                                                    )}
                                                </Td>
                                                <Td>
                                                    <Text color={'blue'}>
                                                        {item.status == 0
                                                            ? 'Aguardando'
                                                            : ''}
                                                    </Text>
                                                    <Text color={'red'}>
                                                        {item.status == -1
                                                            ? 'Falha na verificação'
                                                            : ''}
                                                    </Text>
                                                    <Text color={'green'}>
                                                        {item.status == 1
                                                            ? 'Sucesso na verificação'
                                                            : ''}
                                                    </Text>
                                                </Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td
                                                colSpan={8}
                                                textAlign="center"
                                                color="gray"
                                            >
                                                <br />
                                                Não encontramos registros
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>

            <ModalRevisaoFichaCadastral2 ref={modalRevisar} />
            {/* <ModalFichaCadastral ref={modal} />
            <ModalRevisaoFichaCadastral ref={modalRevisar} />
            <ModalValidar ref={modalValidar} />
            <Excluir ref={modalExcluir} onDelete={onDelete} /> */}
        </Layout>
    )
}

export default FichasCadastrais
