import {
    Box,
    Button,
    Grid,
    GridItem,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    Table,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle } from "react"
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiAddLine } from "react-icons/ri";
import { FormDate } from "../Form/FormDate";
import { FormInput } from "../Form/FormInput";
import { FormSelect } from "../Form/FormSelect";
import { FormTextarea } from "../Form/FormTextarea";
import { Title } from "../Gerais/title";

const ModalBase = ({ }, ref) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            if (id) {
                console.log('Buscando dados no sistema');
                onOpen();
            } else {
                onOpen();
            }
        }
    }))

    return <>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent minW='60%'>
                <ModalHeader>Chamado Nº 32424</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs variant='unstyled'>
                        <TabList>
                            <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Dados</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Grid
                                    gap={5}
                                    templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
                                    <GridItem>
                                        <FormInput
                                            label='Nº do contrato'
                                            placeholder='...'
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            label='Inquilino'
                                            placeholder='...'
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            label='Reponsável'
                                            placeholder='...'
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <FormInput
                                            label='Data de criação'
                                            placeholder='...'
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            label='Data de retorno'
                                            placeholder='...'
                                        />


                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            label='Status'
                                            placeholder='...'
                                        />
                                    </GridItem>
                                </Grid>
                                <Box mt={5}>
                                    <FormTextarea
                                        label='Endereço'
                                        placeholder='...'
                                    />
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' onClick={onClose}>
                        Fechar
                    </Button>
                    <Button colorScheme='blue' mr={3} >Confirmar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
}
export const ModalChamados = forwardRef(ModalBase);