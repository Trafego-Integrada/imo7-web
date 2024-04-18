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

import { EmpresaRelacionada, IConsultaEmpresaRelacionada } from ".";

interface ModalProps {
    data: IConsultaEmpresaRelacionada;
}

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<IConsultaEmpresaRelacionada>();

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
                    <Flex flexDir="column" gap={4}>
                        {data?.empresasRelacionadasCPF.negociosRelacionados.map((empresaRelacionada, index) => (
                            <EmpresaRelacionada key={index} data={empresaRelacionada} />
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalEmpresaRelacionada = forwardRef(ModalBase);
