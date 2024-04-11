import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    Table,
    Tr,
    Td,
    Tbody,
    Th,
    Thead,
    Button
} from "@chakra-ui/react";

const ModalBase = ({ consultarNetrin }: { consultarNetrin: () => void }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    useImperativeHandle(ref, () => ({
        onOpen: () => {
            onOpen();
        },
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    KYC e Compliance
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Flex flexDir="column" gap={4}>
                        <Text>
                            Esta consulta é uma fonte vital de dados essenciais para atender aos requisitos legais e regulatórios relacionados aos processos de identificação de clientes, conhecidos como KYC(know-your-client)(conheça seu cliente).
                            Os dados contidos abrangem informações cruciais sobre pessoas politicamente expostas (PPE ou PEP), sanções e restrições, tanto em âmbito nacional quanto internacional.
                            Além disso, o conjunto de dados inclui indicadores que sinalizam se um indivíduo é considerado PPE ou está sujeito a alguma restrição, juntamente com registros históricos dessas circunstâncias.
                            Um aspecto adicional importante é o conceito de PPE Estendido, que identifica se uma pessoa possui algum vínculo familiar com uma PPE além do primeiro grau, ou outras formas de relacionamento.
                            Ao realizar uma busca, o tipo de relacionamento é explicitado no retorno, como por exemplo (mãe), indicando que a pessoa é mãe de um PEP.
                        </Text>
                        <Table>
                            <Thead>
                                <Tr><Th>Fontes pesquisadas</Th></Tr>
                            </Thead>
                            <Tbody>
                                <Tr><Td>CVM</Td></Tr>
                                <Tr><Td>Banco Central</Td></Tr>
                                <Tr><Td>OFAC</Td></Tr>
                                <Tr><Td>COAF</Td></Tr>
                                <Tr><Td>EU</Td></Tr>
                                <Tr><Td>GOVUK</Td></Tr>
                                <Tr><Td>FBI</Td></Tr>
                                <Tr><Td>Interpol</Td></Tr>
                                <Tr><Td>UNSC</Td></Tr>
                                <Tr><Td>CEAF</Td></Tr>
                                <Tr><Td>CNEP</Td></Tr>
                                <Tr><Td>Conselho Nacional De Justiça</Td></Tr>
                                <Tr><Td>CEIS</Td></Tr>
                                <Tr><Td>CEPIM</Td></Tr>
                                <Tr><Td>Inidôneos TCU</Td></Tr>
                                <Tr><Td>Acordos de Leniência</Td></Tr>
                                <Tr><Td>Processo administrativo disciplinar</Td></Tr>
                                <Tr><Td>Impedidos de licitar e contratar banco</Td></Tr>
                                <Tr><Td>Tribunal de Contas do Estado de São Paul</Td></Tr>
                            </Tbody>
                        </Table>

                        <Text>Deseja realmente realizar essa consulta?</Text>
                        <Flex gap={4}>
                            <Button onClick={() => { consultarNetrin(); onClose(); }}>Sim</Button>
                            <Button onClick={() => onClose()}>Não</Button>
                        </Flex>

                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalConfirmarConsulta = forwardRef(ModalBase);
