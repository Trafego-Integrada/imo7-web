import {
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
    useDisclosure,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiAddLine } from "react-icons/ri";
import { FormInput } from "@/components/Form/FormInput";

const ModalBase = ({}, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            if (id) {
                console.log("Buscando dados no sistema");
                onOpen();
            } else {
                onOpen();
            }
        },
    }));

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent minW="60%">
                    <ModalHeader>Propietário Fernando Camargo</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs variant="unstyled">
                            <TabList>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "blue.500",
                                    }}
                                >
                                    Dados
                                </Tab>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "blue.500",
                                    }}
                                >
                                    Documentos
                                </Tab>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "blue.500",
                                    }}
                                >
                                    Imóveis
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Grid
                                        gap={5}
                                        templateColumns={{
                                            sm: "repeat(1, 1fr)",
                                            md: "repeat(2, 1fr)",
                                            lg: "repeat(3, 1fr)",
                                        }}
                                    >
                                        <GridItem>
                                            <FormInput
                                                label="Nome"
                                                placeholder="..."
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="Fone"
                                                placeholder="..."
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="Email/Login"
                                                placeholder="..."
                                            />
                                        </GridItem>

                                        <GridItem>
                                            <FormInput
                                                label="Senha"
                                                placeholder="..."
                                            />
                                        </GridItem>
                                    </Grid>
                                </TabPanel>

                                <TabPanel>
                                    <Grid d="flex" gap={3}>
                                        <Button
                                            size="md"
                                            bg="none"
                                            border="1px solid #2F80ED"
                                            _hover={{
                                                bg: "bluelight",
                                                color: "white",
                                                cursor: "pointer",
                                            }}
                                            _focus={{ bg: "none" }}
                                            _active={{ bg: "none" }}
                                            color="bluelight"
                                        >
                                            <Icon as={RiAddLine} />
                                            <Text pl="2">Anexar arquivo</Text>
                                        </Button>

                                        <Button
                                            size="md"
                                            bg="none"
                                            border="1px solid #F2994A"
                                            _hover={{
                                                bg: "orange",
                                                color: "white",
                                                cursor: "pointer",
                                            }}
                                            _focus={{ bg: "none" }}
                                            _active={{ bg: "none" }}
                                            color="orange"
                                        >
                                            <Icon as={IoDocumentTextOutline} />
                                            <Text pl="2">Gerar documento</Text>
                                        </Button>
                                    </Grid>

                                    <Table variant="striped" mt={5} bg="white">
                                        <Thead>
                                            <Tr>
                                                <Th>#</Th>
                                                <Th>Título</Th>
                                                <Th>Criado em</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            <Tr>
                                                <Td>643334</Td>
                                                <Td>comprovante-contrato</Td>
                                                <Td>13/05/2022</Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Fechar
                        </Button>
                        <Button colorScheme="blue" mr={3}>
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalPropietarios = forwardRef(ModalBase);
