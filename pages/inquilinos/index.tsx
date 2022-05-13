import { Box, Button, Grid, GridItem, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useRef } from "react";
import { MdPageview } from "react-icons/md";
import { FormInput } from "../../components/Form/FormInput";
import { Layout } from "../../components/Layout/layout";
import { ModalInquilinos } from "../../components/Modals/inquilinos";

const Inquilinos = () => {
    const modalinquilinos = useRef();
    return <>
        <Layout title='Inquilinos'>
            <Box p={5}>
                <Box bg='graylight' p={5}>
                    <Grid
                        gap={5}
                        templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}>
                        <GridItem>
                            <FormInput
                                label='Inquilino'
                                placeholder='digite o nome do inquilino...'
                                bg='white'
                            />
                        </GridItem>
                        <GridItem>
                            <FormInput
                                label='CPF/CNPJ'
                                placeholder='digite o cpf ou cnpj...'
                                bg='white'
                            />
                        </GridItem>
                        <GridItem>
                            <FormInput
                                label='Contrato'
                                placeholder='digite o número do contrato...'
                                bg='white'
                            />
                        </GridItem>
                        <GridItem>
                            <FormInput
                                label='Telefone'
                                placeholder='digite um telefone...'
                                bg='white'
                            />
                        </GridItem>
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
                                <Th>Inquilino</Th>
                                <Th>CPF/CNPJ</Th>
                                <Th>Contrato</Th>
                                <Th>Fone</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>Fernando Camargo</Td>
                                <Td>46715107823</Td>
                                <Td>2323234242</Td>
                                <Td >(19) 97164-2362</Td>
                                <Td >
                                    <IconButton
                                        as={MdPageview}
                                        color='bluelight'
                                        onClick={() => modalinquilinos.current.onOpen()}
                                    />

                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>
            </Box>

            <ModalInquilinos ref={modalinquilinos} />
        </Layout>

    </>
}
export default Inquilinos;