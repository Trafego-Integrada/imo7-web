import { Box, Button, Circle, Grid, GridItem, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { FormDate } from "../../components/Form/FormDate";
import { FormInput } from "../../components/Form/FormInput";
import { FormSelect } from "../../components/Form/FormSelect";
import { Layout } from "../../components/Layout/layout";
import { VscFilePdf } from "react-icons/vsc"

const Cobrancas = () => {
    return <>
        <Layout title='Cobranças'>
            <Box p={5}>
                <Box bg='graylight' p={5}>
                    <Grid gap={5}>
                        <Grid
                            templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }}
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
                                    label='Nome do inquilino'
                                    placeholder='digite o nome do inquilino...'
                                    bg='white'
                                />
                            </GridItem>
                            <GridItem>
                                <FormDate
                                    label='Data de início'
                                    bg='white'
                                />

                            </GridItem>
                            <GridItem>
                                <FormDate
                                    label='Data de vencimento'
                                    bg='white'
                                />
                            </GridItem>
                            <GridItem>
                                <FormSelect
                                    label='status'
                                    bg='white'
                                    placeholder='Selecione...'
                                >
                                    <option value="">Aberto</option>
                                </FormSelect>
                            </GridItem>

                            <GridItem>
                                <FormInput
                                    label='Rua'
                                    placeholder='digite o nome da rua...'
                                    bg='white'
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label='Número'
                                    placeholder='digite o número da rua...'
                                    bg='white'
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label='Bairro'
                                    placeholder='digite o nome do bairro...'
                                    bg='white'
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label='Cidade'
                                    placeholder='digite o nome da cidade...'
                                    bg='white'
                                />
                            </GridItem>
                            <GridItem>
                                <FormInput
                                    label='Estado'
                                    placeholder='digite o nome do estado...'
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
                                <Th>Nº do contrato</Th>
                                <Th>Data de vencimento</Th>
                                <Th>Inquilino principal</Th>
                                <Th>Endereço</Th>
                                <Th>Status</Th>
                                <Th>Valor</Th>
                                <Th>Boletos</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>83282323</Td>
                                <Td>25/05/2022</Td>
                                <Td>Fernando Camargo</Td>
                                <Td>Rua Orlando de moraes, 146, Santa Rita 2, Nova Odessa</Td>
                                <Td>
                                    <Grid gap={2}>
                                        <Circle size='5' bg='green' />
                                        <Text>Ativo</Text>
                                    </Grid>
                                </Td>
                                <Td>R$ 530,00</Td>
                                <Td>
                                    <IconButton
                                        size='sm'
                                        as={VscFilePdf}
                                        color='red'
                              
                                    />
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Layout>
    </>
}
export default Cobrancas;