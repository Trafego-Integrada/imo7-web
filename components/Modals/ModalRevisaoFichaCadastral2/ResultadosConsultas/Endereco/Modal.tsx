import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { IConsultaEndereco } from "../../Consulta2";
import { Endereco } from ".";

interface ModalProps {
    tipoResultado: string;
    data: any;
}

const ModalBase = ({}, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [enderecos, setEnderecos] = useState<IConsultaEndereco[]>([]);

    useImperativeHandle(ref, () => ({
        onOpen: (props: ModalProps) => {
            setEnderecos(props.data);
            onOpen();
        },
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    Endereços encontrados
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Flex flexDir="column" gap={4}>
                        {enderecos.map((endereco, index) => (
                            <Endereco key={index} data={endereco} />
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalResultadoEndereco = forwardRef(ModalBase);
