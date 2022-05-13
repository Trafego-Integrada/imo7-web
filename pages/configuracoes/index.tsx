import { Box, Button, Checkbox, Flex, Grid, GridItem, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { FormInput } from "../../components/Form/FormInput";
import { FormSelect } from "../../components/Form/FormSelect";
import { Layout } from "../../components/Layout/layout";

const Configuracoes = () => {
    return <>
        <Layout title='Configurações'>
            <Box p={5}>
                <Box bg='graylight' p={5}>
                    <Tabs size='md' variant='enclosed'>
                        <TabList>
                            <Tab _selected={{ color: 'white', bg: 'bluelight' }}>Dados</Tab>
                            <Tab _selected={{ color: 'white', bg: 'bluelight' }}>Contrato</Tab>
                            <Tab _selected={{ color: 'white', bg: 'bluelight' }}>Endereço</Tab>
                            <Tab _selected={{ color: 'white', bg: 'bluelight' }}>Envio</Tab>
                            <Tab _selected={{ color: 'white', bg: 'bluelight' }}>2º Via de boletos</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>Detalhes da conta</Text>
                                    <Box bg='white' p={5}>
                                        <Grid gap={5} templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
                                            <GridItem>
                                                <FormInput
                                                    label='Razão Social'
                                                    placeholder='digite a razão social...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                            <GridItem>
                                                <FormInput
                                                    label='CNPJ'
                                                    placeholder='digite o CNPJ...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                            <GridItem>
                                                <FormInput
                                                    label='IE'
                                                    placeholder='digite a sua inscrição estadual...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                </Box>

                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>Logomarca</Text>
                                    <Box bg='white' p={5}>
                                    </Box>
                                </Box>
                                <Flex mt={5} justifyContent='flex-end' gap={3}>
                                    <Button variant='ghost' >
                                        Cancelar
                                    </Button>
                                    <Button colorScheme='blue' mr={3} >Confirmar</Button>
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>Informações contato</Text>
                                    <Box bg='white' p={5}>
                                        <Grid gap={5} templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
                                            <GridItem>
                                                <FormInput
                                                    label='Email para contato'
                                                    placeholder='digite o email para o contato...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                            <GridItem>
                                                <FormInput
                                                    label='Site'
                                                    placeholder='endereço do seu site...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                            <GridItem>
                                                <FormInput
                                                    label='Telefone'
                                                    placeholder='ex: (99) 99999-9999...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                    <Flex mt={5} justifyContent='flex-end' gap={3}>
                                        <Button variant='ghost' >
                                            Cancelar
                                        </Button>
                                        <Button colorScheme='blue' mr={3} >Confirmar</Button>
                                    </Flex>
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>Informações do endereço</Text>
                                    <Box bg='white' p={5}>
                                        <Grid gap={5} templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
                                            <GridItem>
                                                <FormInput
                                                    label='CEP'
                                                    placeholder='ex: 13-386-092...'
                                                    bg='white'
                                                />
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
                                                    placeholder='digite o número da casa...'
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
                                    </Box>
                                    <Flex mt={5} justifyContent='flex-end' gap={3}>
                                        <Button variant='ghost' >
                                            Cancelar
                                        </Button>
                                        <Button colorScheme='blue' mr={3} >Confirmar</Button>
                                    </Flex>
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>Informações de envio</Text>
                                    <Box bg='white' p={5}>
                                        <Checkbox size='lg'>Enviar e-mail?</Checkbox>
                                    </Box>
                                </Box>

                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>Configurações dos boletos</Text>
                                    <Box bg='white' p={5}>
                                        <Grid
                                            d='flex'
                                            alignItems='flex-end'
                                            gap={5}
                                            templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
                                            <GridItem w='100%'>
                                                <FormInput
                                                    label='Deixar o boleto disponível para download por quantos dias após a data "não receber após"?'
                                                    placeholder='ex: 5...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                            <GridItem w='100%'>
                                                <FormInput
                                                    label='E-mail de envio (* Configurar no SMTP)'
                                                    placeholder='ex dev@trafegointegrada.com.br...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                            <GridItem w='100%'>
                                                <FormInput
                                                    label='Email de resposta'
                                                    placeholder='ex dev@trafegointegrada.com.br...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                </Box>
                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>Configurações dos extratos</Text>
                                    <Box bg='white' p={5}>
                                        <Grid
                                            d='flex'
                                            alignItems='flex-end'
                                            gap={5}
                                            templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
                                            <GridItem w='100%'>
                                                <FormInput
                                                    label='Assunto dos emails'
                                                    placeholder='digite o assunto que ira aparecer...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                            <GridItem w='100%'>
                                                <FormInput
                                                    label='E-mail de envio (* Configurar no SMTP)'
                                                    placeholder='ex dev@trafegointegrada.com.br...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                            <GridItem w='100%'>
                                                <FormInput
                                                    label='Email de resposta'
                                                    placeholder='ex dev@trafegointegrada.com.br...'
                                                    bg='white'
                                                />
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                </Box>

                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>Configurações dos relatórios</Text>
                                    <Box bg='white' p={5}>
                                        <FormInput
                                            label='Email que recebem os relátorios (separados por vírgula)'
                                            placeholder='dev@trafegointegrada.com.br;'
                                            bg='white'
                                        />
                                    </Box>
                                </Box>

                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>URL de acesso</Text>
                                    <Box bg='white' p={5}>
                                        <FormInput
                                            label='Url de acesso'
                                            placeholder='dev@trafegointegrada.com.br;'
                                            bg='white'
                                        />
                                    </Box>
                                </Box>

                                <Flex mt={5} justifyContent='flex-end' gap={3}>
                                    <Button variant='ghost' >
                                        Cancelar
                                    </Button>
                                    <Button colorScheme='blue' mr={3} >Confirmar</Button>
                                </Flex>
                            </TabPanel>

                            <TabPanel>

                                <Box>
                                    <Text mb={5} mt={5} fontSize='2xl' fontWeight='500'>Regras para emissão de 2º Via boletos</Text>
                                    <Box bg='white' p={5}>
                                        <FormSelect bg='white' label='Tipo de emissão' placeholder='selecione...' >
                                            <option value="">Utilizando CPF & Nº contrato</option>
                                        </FormSelect>
                                    </Box>
                                </Box>
                                <Flex mt={5} justifyContent='flex-end' gap={3}>
                                    <Button variant='ghost' >
                                        Cancelar
                                    </Button>
                                    <Button colorScheme='blue' mr={3} >Confirmar</Button>
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Box>
        </Layout>

    </>
}
export default Configuracoes;