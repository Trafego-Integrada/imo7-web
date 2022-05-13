import { Box, Button, Circle, Grid, GridItem, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useRef } from "react";
import { MdPageview } from "react-icons/md";
import { FormDate } from "../../components/Form/FormDate";
import { FormInput } from "../../components/Form/FormInput";
import { FormSelect } from "../../components/Form/FormSelect";
import { Layout } from "../../components/Layout/layout";
import { ModalChamados } from "../../components/Modals/chamados";

const Cobrancas = () => {
    const modalchamados = useRef();
    return <>
        <Layout title='Chamados'>
            <Box p={5}>
                <Box bg='graylight' p={5}>
                    <Grid gap={5}>
                        <Grid
                            templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                            gap={5}>
                            <GridItem>
                                <FormInput
                                    label='Nº do contrato'
                                    placeholder='digite um número...'
                                    bg='white'
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label='Endereço'
                                    placeholder='digite a rua/bairro/cidade...'
                                    bg='white'
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label='Inquilino'
                                    placeholder='digite o nome do inquilino...'
                                    bg='white'
                                />
                            </GridItem>

                            <GridItem>
                                <FormSelect
                                    label='Status'
                                    bg='white'
                                    placeholder='Selecione...'
                                >
                                    <option value="">Aberto</option>
                                    <option value="">Fechado</option>
                                </FormSelect>
                            </GridItem>

                            <GridItem>
                                <FormDate
                                    label='Data de criação'
                                    bg='white'
                                />
                            </GridItem>

                            <GridItem>
                                <FormDate
                                    label='Data de retorno'
                                    bg='white'
                                />
                            </GridItem>
                        </Grid>

                    </Grid>
                    <Box w='100%' mt={5} d='flex' gap={5} justifyContent='flex-end'>
                        <Button
                            size='md'
                            bg='none'
                            border='1px solid red'
                            _hover={{ bg: 'red', color: 'white', cursor: 'pointer' }}
                            _focus={{ bg: 'none' }}
                            _active={{ bg: 'none' }}
                            color='red'
                        >Limpar Filtro
                        </Button>

                        <Button
                            size='md'
                            bg='none'
                            border='1px solid black'
                            _hover={{ bg: 'black', color: 'white', cursor: 'pointer' }}
                            _focus={{ bg: 'none' }}
                            _active={{ bg: 'none' }}
                            color='black'
                        >Filtrar
                        </Button>
                    </Box>
                </Box>

                <Box bg='graylight' overflowX='auto' p={5} mt={5} >
                    <Box p={5} bg='white'>
                        <FormInput
                            bg='white'
                            w='max'
                            placeholder='Busca rápida...'
                        />
                    </Box>
                    <Table variant='striped' mt={5} bg='white'>
                        <Thead>
                            <Tr>
                                <Th>Nº do chamado</Th>
                                <Th>Inquilino</Th>
                                <Th>Responsável</Th>
                                <Th>Data de criação</Th>
                                <Th>Data de retorno</Th>
                                <Th>Status</Th>
                                <Th>Nº do contrato</Th>
                                <Th>Endereço</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>83282323</Td>

                                <Td>Fernando Camargo</Td>
                                <Td>Ramerson Modesto</Td>
                                <Td>04/05/2022</Td>
                                <Td>10/05/2022</Td>

                                <Td>
                                    <Grid gap={2}>
                                        <Circle size='5' bg='green' />
                                        <Text>Aberto</Text>
                                    </Grid>
                                </Td>

                                <Td>4342424242</Td>
                                <Td>Rua Orlando de moraes, 146, Santa Rita 2, Nova Odessa</Td>
                                <Td>
                                    <IconButton
                                        as={MdPageview}
                                        color='bluelight'
                                        onClick={() => modalchamados.current.onOpen()}
                                    />
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Layout>
        <ModalChamados ref={modalchamados} />
    </>
}
export default Cobrancas;