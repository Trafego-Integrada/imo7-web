import {
    Button,
    Grid,
    GridItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle } from "react";

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
                    <ModalHeader>Inquilino Fernando Camargo</ModalHeader>
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
                                                label="CPF/CNPJ"
                                                placeholder="..."
                                            />
                                        </GridItem>

                                        <GridItem>
                                            <FormInput
                                                label="Nº contrato"
                                                placeholder="..."
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="Fone"
                                                placeholder="..."
                                            />
                                        </GridItem>
                                    </Grid>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalInquilinos = forwardRef(ModalBase);
