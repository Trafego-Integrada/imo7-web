import { Box, Flex, Grid, GridItem, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { MdPageview } from "react-icons/md";
import { Border } from "../../components/Gerais/border";
import { Title } from "../../components/Gerais/title";
import { Layout } from "../../components/Layout/layout";

const Gerencial = () => {
    return <>
        <Layout title='Gerencial'>
            <Box p={5}>
                <Title children='Boletos' />
                <Box bg='graylight' p={5}>
                    <Grid
                        gap={5}
                        templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
                        <GridItem minH='200px' w='100%' bg='white' d='flex' alignItems='center' justifyContent='center'>
                            <Box w='100%' d='flex' alignItems='center' flexDir='column' gap={3} p={5}>
                                <Text fontSize='xl' textAlign='center'>Valor Total</Text>
                                <Border />
                                <Text textAlign='center' fontSize='2xl' color='bluelight'>R$ 1200,00</Text>
                            </Box>
                        </GridItem>
                        <GridItem minH='200px' w='100%' bg='white' d='flex' alignItems='center' justifyContent='center'>
                            <Box w='100%' bg='white' d='flex' alignItems='center' flexDir='column' gap={3} p={5}>
                                <Text fontSize='xl' textAlign='center'>Total de imobiliárias</Text>
                                <Border />
                                <Text textAlign='center' fontSize='2xl' color='bluelight' >R$ 1200,00</Text>
                            </Box>
                        </GridItem>
                        <GridItem minH='200px' w='100%' bg='white' d='flex' alignItems='center' justifyContent='center'>
                            <Box w='100%' bg='white' d='flex' alignItems='center' flexDir='column' gap={3} p={5}>
                                <Text fontSize='xl' textAlign='center'>Total enviados</Text>
                                <Border />
                                <Text textAlign='center' fontSize='2xl' color='bluelight'>R$ 1200,00</Text>
                            </Box>
                        </GridItem>
                    </Grid>
                </Box>
                <Flex align='center'>
                    <Title children='Arquivos' />
                    <Text pl='2' color='red' fontSize='lg'>| Não processados </Text>
                </Flex>
                <Box bg='graylight' p={5} overflowX='auto'>
                    <Table variant='striped' bg='white' >
                        <Thead>
                            <Tr>
                                <Th>Nome do arquivo</Th>
                                <Th>Data de criação</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>contratodaempresa.docx</Td>
                                <Td>13/05/2022</Td>
                                <Td>
                                    <IconButton
                                        as={MdPageview}
                                        color='bluelight'
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
export default Gerencial;