import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";

import { IConsultaSituacaoCadastral, SituacaoCadastral } from ".";

interface ModalProps {
    data: IConsultaSituacaoCadastral;
}

const ModalBase = ({}, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<IConsultaSituacaoCadastral | null>(null);

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
                    Situação atual do CPF
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    {data && <SituacaoCadastral data={data} />}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalSituacaoCadastral = forwardRef(ModalBase);
