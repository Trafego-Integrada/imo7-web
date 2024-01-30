import { Button } from '@chakra-ui/button'
import Icon from '@chakra-ui/icon'
import { Box, Container, Flex } from '@chakra-ui/layout'

import { Tooltip } from '@chakra-ui/tooltip'
import { useRef, useState } from 'react'
import { FaEdit, FaPlus } from 'react-icons/fa'
import { useMutation, useQuery } from 'react-query'
import { ImobiliariaDrawer } from '@/components/Drawers/ImobiliariaDrawer'
import { Header } from '@/components/Header'
import { getAll as getAllImobiliarias } from '@/services/models/imobiliaria'
import { withSSRAuth } from '@/utils/withSSRAuth'
import { Layout } from '@/components/Layout/layout'
import { TabelaPadrao } from '@/components/Tabelas/TabelaPadrao'
import { FormInput } from '@/components/Form/FormInput'
import { FiSearch, FiTrash } from 'react-icons/fi'
import { usePagination } from '@ajna/pagination'
import { imo7ApiService } from '@/services/apiServiceUsage'
import { Checkbox, useToast } from '@chakra-ui/react'
import { queryClient } from '@/services/queryClient'
import { InferGetServerSidePropsType } from "next";

const Imobiliarias = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const toast = useToast()
    const imobiliariaDrawer: any = useRef()
    const [filter, setFilter] = useState({
        query: '',
        contaId: null,
    })
    const [total, setTotal] = useState()
    const {
        currentPage,
        setCurrentPage,
        pagesCount,
        pages,
        pageSize,
        setPageSize,
    } = usePagination({
        total: total,
        limits: {
            inner: 1,
            outer: 1,
        },
        initialState: { currentPage: 1, pageSize: 15 },
    })
    const {
        data: imobiliarias,
        isFetching,
        isLoading,
    } = useQuery(
        [
            'imobiliarias',
            {
                ...filter,
                linhas: pageSize,
                pagina: currentPage,
            },
        ],
        getAllImobiliarias,
    )
    const excluir = useMutation(imo7ApiService('imobiliaria').delete)

    const onDelete = async (id: any) => {
        await excluir.mutateAsync(id, {
            onSuccess: () => {
                toast({
                    title: 'Imobiliária excluida',
                    duration: 3000,
                    status: 'success',
                })
                queryClient.invalidateQueries(['imobiliarias'])
            },
        })
    }
    const [selecionados, setSelecionados] = useState([])
    // console.log(usuario);
    const deleteMany = useMutation(imo7ApiService('imobiliaria').deleteMany, {
        onSuccess: () => {
            queryClient.invalidateQueries('imobiliarias')
            toast({
                title: 'Sucesso',
                description: 'Imobiliárias excluidas com sucesso com sucesso',
                status: 'success',
                duration: 3000,
            })
        },
    })

    const onDeleteMany = () => {
        deleteMany.mutate(
            JSON.stringify(selecionados.map((i: any) => i.toString())),
        )
        setSelecionados([])
        queryClient.invalidateQueries('imoveis')
    }
    return (
        <Layout>
            <Header title="Imobiliarias" isFetching={isFetching}></Header>
            <Container maxW="full">
                <Flex justify="space-between" align="center" py={4}>
                    <Flex gridGap={2}>
                        <FormInput
                            size="sm"
                            minW={96}
                            leftElement={<FiSearch />}
                            placeholder="Qual imobiliária está procurando?"
                            value={filter.query}
                            onChange={(e) =>
                                setFilter({ ...filter, query: e.target.value })
                            }
                        />
                    </Flex>
                    <Button
                        size="sm"
                        colorScheme="blue"
                        rounded="full"
                        leftIcon={<Icon as={FaPlus} />}
                        onClick={() => imobiliariaDrawer.current.onOpen()}
                    >
                        Adicionar imobiliária
                    </Button>
                </Flex>
                <Box>
                    <TabelaPadrao
                        data={imobiliarias?.map((i) => [
                            {
                                value: (
                                    <Checkbox
                                        isChecked={selecionados.includes(i.id)}
                                        onChange={(e: any) => {
                                            if (e.target.checked) {
                                                setSelecionados([
                                                    ...selecionados,
                                                    i.id,
                                                ])
                                            } else {
                                                setSelecionados(
                                                    selecionados.filter(
                                                        (i) => i !== i.id,
                                                    ),
                                                )
                                            }
                                        }}
                                    />
                                ),
                                w: 4,
                            },
                            {
                                value: (
                                    <>
                                        <Tooltip label="Editar imobiliária">
                                            <Button
                                                rounded="full"
                                                size="xs"
                                                onClick={() =>
                                                    imobiliariaDrawer.current.onOpen(
                                                        i.id,
                                                    )
                                                }
                                            >
                                                <Icon as={FaEdit} />
                                            </Button>
                                        </Tooltip>
                                    </>
                                ),
                            },
                            {
                                value: i.id,
                            },
                            {
                                value: i.conta?.nome,
                            },
                            {
                                value: i.razaoSocial,
                            },
                            {
                                value: i.codigo,
                            },
                            {
                                value: i.cnpj,
                            },
                        ])}
                        head={[
                            {
                                value: (
                                    <Checkbox
                                        isChecked={
                                            imobiliarias
                                                ?.map((item: any) => item.id)
                                                .filter(
                                                    (item: any) =>
                                                        !selecionados.includes(
                                                            item,
                                                        ),
                                                ).length == 0
                                                ? true
                                                : false
                                        }
                                        onChange={(e) =>
                                            setSelecionados(
                                                e.target.checked
                                                    ? JSON.parse(e.target.value)
                                                    : [],
                                            )
                                        }
                                        value={JSON.stringify(
                                            imobiliarias?.map(
                                                (item: any) => item.id,
                                            ),
                                        )}
                                    />
                                ),
                                w: 4,
                            },
                            { value: 'Ações' },
                            { value: 'ID' },
                            { value: 'Conta' },
                            { value: 'Razão Social' },
                            { value: 'Código' },
                            { value: 'CNPJ' },
                        ]}
                        total={total}
                        isLoading={isLoading}
                        paginatorProps={{
                            currentPage,
                            pagesCount,
                            setCurrentPage,
                            pages,
                            pageSize,
                            setPageSize,
                        }}
                        acoes={
                            <>
                                <Button
                                    size="sm"
                                    leftIcon={<FiTrash />}
                                    colorScheme="red"
                                    variant="outline"
                                    disabled={
                                        selecionados.length ? false : true
                                    }
                                    onClick={onDeleteMany}
                                >
                                    Excluir Selecionados
                                </Button>
                            </>
                        }
                    />
                </Box>
            </Container>
            <ImobiliariaDrawer ref={imobiliariaDrawer} />
        </Layout>
    )
}

export default Imobiliarias
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        }
    },
    { cargos: ['imobiliaria', 'adm', 'conta'] },
)
