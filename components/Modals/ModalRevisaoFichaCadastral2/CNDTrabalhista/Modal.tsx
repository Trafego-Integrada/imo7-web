import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Flex,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";

import { CNDTrabalhista, IConsultaTribunalSuperiorTrabalhoCNDT } from ".";

interface ModalProps {
    data: IConsultaTribunalSuperiorTrabalhoCNDT;
}

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<IConsultaTribunalSuperiorTrabalhoCNDT>();

    const renderDetail = (label: string, value: any) => (
        <Text>
            {label}: <strong>{value}</strong>
        </Text>
    );

    useImperativeHandle(ref, () => ({
        onOpen: (props: ModalProps) => {
            setData(props.data);
            onOpen();
        },
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    Os resultados da consulta relata que em algum momento os CPF´S ou CNPJ´S tiveram algum relacionamento, isso nao significa que atualmente estão vinculados.
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Flex flexDirection='column'>
                        {renderDetail('Nome', data?.tribunalSuperiorTrabalhoCNDT.nome)}
                        {renderDetail('Certidão', data?.tribunalSuperiorTrabalhoCNDT.certidao)}
                        {renderDetail('Mensagem', data?.tribunalSuperiorTrabalhoCNDT.mensagem)}
                        {renderDetail('Emitiu Certidão', data?.tribunalSuperiorTrabalhoCNDT.emitiuCertidao)}
                        {renderDetail('Emissão Data', data?.tribunalSuperiorTrabalhoCNDT.emissaoData)}
                        {renderDetail('Validade', data?.tribunalSuperiorTrabalhoCNDT.validade)}
                        <Accordion>
                            <AccordionItem>
                                <AccordionButton>
                                    Processos Encontrados
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
                                    <Flex flexDir="column" gap={4}>
                                        {data?.tribunalSuperiorTrabalhoCNDT.processos_encontrados.map((processos, index) => (
                                            <CNDTrabalhista key={index} data={processos} />
                                        ))}
                                    </Flex>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                        <Text>URL Comprovante: {<Link href={data?.tribunalSuperiorTrabalhoCNDT.urlComprovante} textColor='blue'>Clique para baixar o comprovante</Link>}</Text>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalCNDTrabalhista = forwardRef(ModalBase);
