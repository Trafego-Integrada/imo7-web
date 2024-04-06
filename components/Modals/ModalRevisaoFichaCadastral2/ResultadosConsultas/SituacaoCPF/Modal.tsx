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

import { SituacaoCPF } from ".";
import { IConsultaCPF } from "../../Consulta2";

interface ModalProps {
    data: IConsultaCPF;
}

const ModalBase = ({}, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [situacaoCPF, setSituacaoCPF] = useState<IConsultaCPF | null>(null);

    useImperativeHandle(ref, () => ({
        onOpen: (props: ModalProps) => {
            setSituacaoCPF(props.data);
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
                    {situacaoCPF && <SituacaoCPF data={situacaoCPF} />}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalResultadoSituacaoCPF = forwardRef(ModalBase);
