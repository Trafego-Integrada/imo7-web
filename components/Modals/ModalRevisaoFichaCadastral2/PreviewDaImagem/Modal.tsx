import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Image
} from "@chakra-ui/react";

interface ModalProps {
    data: string;
}

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<string>('');

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
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Image alt='Preview' src={data} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalPreviewDaImagem = forwardRef(ModalBase);
