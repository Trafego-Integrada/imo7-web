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

import { Endereco, IConsultaEndereco } from ".";

interface ModalProps {
    data: IConsultaEndereco;
}

const ModalBase = ({}, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<IConsultaEndereco>();

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
                    Endereços encontrados
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Flex flexDir="column" gap={4}>
                        {data?.enderecoCPF.endereco.map((endereco, index) => (
                            <Endereco key={index} data={endereco} />
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalEndereco = forwardRef(ModalBase);
