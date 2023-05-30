import { Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Flex, Input, Textarea, Grid, GridItem } from "@chakra-ui/react"
import { Select } from "chakra-react-select"
import { forwardRef, useImperativeHandle } from "react"

const ModalBase = ({}, ref) => {
    console.log(ref)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useImperativeHandle(ref, () => ({
        onOpen: () => {
            onOpen();
        },
    }));

    return <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
            <ModalContent ml={8}>
          <ModalHeader>Regua</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <Grid templateColumns='repeat(6, 1fr)' gap="10">
                    <GridItem colSpan="2">
                         <FormControl>
                    <FormLabel>Tipo de Envio</FormLabel>
                        <Select placeholder='Selecione'>
                            <option>United Arab Emirates</option>
                            <option>Nigeria</option>
                        </Select>
                </FormControl>
                    </GridItem>
                   
                <GridItem colSpan="2">
                <FormControl>
                    <FormLabel>Dias de referencia</FormLabel>
                        <Input/>
                </FormControl>
                </GridItem>
                <GridItem colSpan="2">

                <FormControl>
                    <FormLabel>Assunto</FormLabel>
                        <Input/>
                </FormControl>
                </GridItem>
                <GridItem colSpan="3">

                <FormControl>
                    <FormLabel>Mensagem</FormLabel>
                        <Textarea placeholder='escreva aqui...' />
                </FormControl>
                </GridItem>
                <GridItem colSpan="3">
                <FormControl>
                    <FormLabel>Hora do envio</FormLabel>
                        <Input placeholder='00:00' />
                </FormControl>
                </GridItem>
                </Grid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
            Fechar
            </Button>
           
          </ModalFooter>
        </ModalContent>
    </Modal>
}

export const ModalRegua = forwardRef(ModalBase)