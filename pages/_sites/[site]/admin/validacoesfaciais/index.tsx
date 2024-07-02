import { Excluir } from '@/components/AlertDialogs/Excluir'
import { FormDateRange } from '@/components/Form/FormDateRange'
import { FormInput } from '@/components/Form/FormInput'
import { FormMultiSelect } from '@/components/Form/FormMultiSelect'
import { Layout } from '@/components/Layout/layout'
import { ModalFichaCadastral } from '@/components/Modals/ModalFichaCadastral'
import { ModalRevisaoFichaCadastral } from '@/components/Modals/ModalRevisaoFichaCadastral'
import { ModalRevisaoFichaCadastral2 } from '@/components/Modals/ModalRevisaoFichaCadastral2'
import { ModalValidar } from '@/components/Modals/ModalValidar'
import { BotaoAbrirModalCadastroValidacaoFacial } from '@/components/Modals/ValidacaoFacial/BotaoAbrirModalCadastroValidacaoFacial'

import {
    arrayStatusFicha,
    formatoData,
    statusFicha,
    tipoFicha,
} from '@/helpers/helpers'
import { useAuth } from '@/hooks/useAuth'
import { excluirFicha, listarFichas } from '@/services/models/fichaCadastral'
import { listarValidacoesFaciais } from '@/services/models/validacaofacial'
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
    Checkbox,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    AccordionItem,
    Divider
} from '@chakra-ui/react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { FaFileExcel, FaFilePdf } from 'react-icons/fa'
import { FiEdit, FiEye, FiLink, FiPlus, FiTrash } from 'react-icons/fi'
import { MdOutlineVerifiedUser, MdAccessibilityNew } from 'react-icons/md'
import { exportToExcel } from 'react-json-to-excel'
import { useMutation, useQuery } from 'react-query'

const filtroPadrao = {
    query: '',
    identificacao: '',
    createdAt: [null, null],
    updatedAt: [null, null],
    status: [],
    responsaveis: [],
    token: false,
}
const FichasCadastrais = () => {
    const { usuario } = useAuth()
    const [filtro, setFiltro] = useState(filtroPadrao)
    const toast = useToast()
    const router = useRouter()
    const modal = useRef()
    const modalExcluir = useRef()
    const modalRevisar = useRef()
    const modalValidar = useRef()

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
                token: JSON.stringify(filtro.token)
                // status: filtro.status[0] ? JSON.stringify(filtro.status) : null,
                // responsaveis: filtro.responsaveis[0] ? JSON.stringify(filtro.responsaveis) : null,
            },
        ],
        listarValidacoesFaciais,
    )

    function getResultText(resultado: any) {
        const parsedResult = JSON.parse(resultado)

        if (resultado.mensagem) return resultado.mensagem;
    }

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
                    <Flex>
                        <label htmlFor='token'>Token</label>
                        <Checkbox
                            id='token'
                            onChange={e => setFiltro({
                                ...filtro,
                                token: e.target.checked
                            })}
                        />
                    </Flex>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                    <Text>Foram encontrados {fichas?.total} resultados</Text>
                    <BotaoAbrirModalCadastroValidacaoFacial />
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
                        {fichas?.data?.length > 0 ? (

                            fichas.data.map((item) => (
                                <Accordion
                                    key={item.id}
                                    allowToggle
                                    defaultIndex={0}
                                >
                                    <AccordionItem>
                                        <Heading>
                                            <AccordionButton>
                                                <Flex w='100%' alignItems='center' gap={4}>
                                                    <Box>
                                                        <Flex gap={4}>
                                                            <Tooltip label='Revisar Ficha'>
                                                                <IconButton
                                                                    icon={
                                                                        <MdOutlineVerifiedUser />
                                                                    }
                                                                    size="xs"
                                                                    rounded="full"
                                                                    colorScheme="blue"
                                                                    variant="outline"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        modalRevisar.current.onOpen(item.ficha.id)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip label="Copiar URL da Validação">
                                                                <IconButton
                                                                    icon={
                                                                        <FiLink />
                                                                    }
                                                                    size="xs"
                                                                    rounded="full"
                                                                    colorScheme="blue"
                                                                    variant="outline"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        navigator.clipboard.writeText(
                                                                            `${window.location.origin}/validacao-facial/${item.id}`
                                                                        );
                                                                        toast(
                                                                            {
                                                                                title: "URL Copiada",
                                                                            }
                                                                        );
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        </Flex>
                                                    </Box>
                                                    <Divider orientation='vertical' h={6} />
                                                    <Box>
                                                        <Text>{item?.nome ?? item?.ficha?.nome}</Text>
                                                        <Text>CPF: {item.cpf}</Text>
                                                    </Box>
                                                    <Divider orientation='vertical' h={6} />
                                                    <Box>
                                                        <Text
                                                            fontSize="xs"
                                                            fontWeight="bold"
                                                            color="gray"
                                                        >Imóvel</Text>
                                                        <Text>
                                                            {
                                                                item?.imovel?.endereco
                                                                ??
                                                                item?.ficha?.Processo?.imovel
                                                                    ?.endereco
                                                            }
                                                            ,{" "}
                                                            {
                                                                item?.imovel?.numero
                                                                ??
                                                                item?.ficha?.Processo?.imovel
                                                                    ?.numero
                                                            }
                                                            ,{" "}
                                                            {
                                                                item?.imovel?.bairro
                                                                ??
                                                                item?.ficha?.Processo?.imovel
                                                                    ?.bairro
                                                            }
                                                            ,{" "}
                                                            {
                                                                item?.imovel?.cidade
                                                                ??
                                                                item?.ficha?.Processo?.imovel
                                                                    ?.cidade
                                                            }
                                                            /
                                                            {
                                                                item?.imovel?.estado
                                                                ??
                                                                item?.ficha?.Processo?.imovel
                                                                    ?.estado
                                                            }
                                                        </Text>
                                                    </Box>
                                                    <Divider orientation='vertical' h={6} />
                                                    <Box>
                                                        <Text fontSize="xs"
                                                            fontWeight="bold"
                                                            color="gray"
                                                        >Validação Facial</Text>
                                                        <Text>Data de Criação: {formatoData(item.createAt, 'DATA_HORA')}</Text>
                                                    </Box>
                                                </Flex>

                                                <AccordionIcon />
                                            </AccordionButton>
                                        </Heading>
                                        <AccordionPanel>
                                            <Table>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Imagem</Th>
                                                        <Th>PIN</Th>
                                                        <Th>Similaridade</Th>
                                                        <Th>Data de criação</Th>
                                                        <Th>Status</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        item?.ValidacaoFacialHistorico?.map(({ createdAt, id, pin, resultado, fotoUrl, status }) => {
                                                            return (
                                                                <Tr key={id}>
                                                                    <Td>
                                                                        {fotoUrl ? (
                                                                            <Image
                                                                                borderRadius="2xl"
                                                                                src={fotoUrl}
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
                                                                    {/* Pin */}
                                                                    <Td>{pin}</Td>
                                                                    {/* Similaridade */}
                                                                    <Td>
                                                                        {status == 1 && (
                                                                            <Box pos="relative">
                                                                                <Tooltip
                                                                                    label={'L1'}
                                                                                >
                                                                                    <Box>
                                                                                        <Progress
                                                                                            size="lg"
                                                                                            value={
                                                                                                JSON.parse(resultado)
                                                                                                    ?.biometria_face
                                                                                                    ?.similaridade * 100
                                                                                            }
                                                                                            max={
                                                                                                100
                                                                                            }
                                                                                            colorScheme={
                                                                                                JSON.parse(
                                                                                                    resultado,
                                                                                                )?.biometria_face?.probabilidade.indexOf(
                                                                                                    'Altíssima ',
                                                                                                ) >=
                                                                                                    0
                                                                                                    ? 'green'
                                                                                                    : JSON.parse(
                                                                                                        resultado,
                                                                                                    )?.biometria_face?.probabilidade.indexOf(
                                                                                                        'Alta ',
                                                                                                    ) >=
                                                                                                        0
                                                                                                        ? 'blue'
                                                                                                        : JSON.parse(
                                                                                                            resultado,
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
                                                                                                resultado,
                                                                                            )?.biometria_face?.probabilidade.indexOf(
                                                                                                'Altíssima ',
                                                                                            ) >= 0
                                                                                                ? 'white'
                                                                                                : 'white'
                                                                                        }
                                                                                    >
                                                                                        {Math.floor(
                                                                                            JSON.parse(
                                                                                                resultado,
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
                                                                                            resultado,
                                                                                        )?.biometria_face?.probabilidade.indexOf(
                                                                                            'Altíssima ',
                                                                                        ) >= 0
                                                                                            ? 'green'
                                                                                            : JSON.parse(
                                                                                                resultado,
                                                                                            )?.biometria_face?.probabilidade.indexOf(
                                                                                                'Alta ',
                                                                                            ) >= 0
                                                                                                ? 'blue'
                                                                                                : JSON.parse(
                                                                                                    resultado,
                                                                                                )?.biometria_face?.probabilidade.indexOf(
                                                                                                    'Baixa ',
                                                                                                ) >= 0
                                                                                                    ? 'orange'
                                                                                                    : 'red'
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        JSON.parse(
                                                                                            resultado,
                                                                                        )
                                                                                            ?.biometria_face
                                                                                            ?.probabilidade
                                                                                    }
                                                                                </Text>
                                                                            </Box>
                                                                        )}
                                                                    </Td>
                                                                    {/* Data de criação */}
                                                                    <Td>
                                                                        {formatoData(createdAt, 'DATA_HORA')}
                                                                    </Td>
                                                                    {/* Status */}
                                                                    <Td>
                                                                        <Text color={'blue'}>
                                                                            {status == 0
                                                                                ? JSON.parse(resultado)?.mensagem ?? 'Aguardando'
                                                                                : ''}
                                                                        </Text>
                                                                        <Text color={'red'}>
                                                                            {status == -1
                                                                                ? JSON.parse(resultado)?.mensagem ?? 'Falha na verificação'
                                                                                : ''}
                                                                        </Text>
                                                                        <Text color={'green'}>
                                                                            {status == 1
                                                                                ? JSON.parse(resultado)?.mensagem ?? 'Sucesso na verificação'
                                                                                : ''}
                                                                        </Text>
                                                                    </Td>
                                                                </Tr>
                                                            )
                                                        })
                                                    }
                                                </Tbody>
                                            </Table>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            )
                            )
                        ) : (<Text>
                            <br />
                            Não encontramos registros
                        </Text>
                        )}



                    </Box>
                </Box>
            </Box>

            <ModalRevisaoFichaCadastral2 ref={modalRevisar} />
            {/* <ModalFichaCadastral ref={modal} />
            <ModalRevisaoFichaCadastral ref={modalRevisar} />
            <ModalValidar ref={modalValidar} />
            <Excluir ref={modalExcluir} onDelete={onDelete} /> */}
        </Layout >
    )
}

export default FichasCadastrais
