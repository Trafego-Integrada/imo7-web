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

import { PessoaRelacionada, IConsultaPessoaRelacionada } from ".";

interface ModalProps {
    data: IConsultaPessoaRelacionada;
}

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<IConsultaPessoaRelacionada>();

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
                    Empresas relacionadas encontradas
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Flex flexDir="column" gap={4}>
                        {data?.pessoasRelacionadasCNPJ.entidadesRelacionadas.map((pessoaRelacionada, index) => (
                            <PessoaRelacionada key={index} data={pessoaRelacionada} />
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalPessoaRelacionada = forwardRef(ModalBase);
