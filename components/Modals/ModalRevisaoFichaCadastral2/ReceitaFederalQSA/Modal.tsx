import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Flex,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { HiLink } from "react-icons/hi2";

import { ReceitaFederalQSA, IConsultaReceitaFederalQSA } from ".";

interface ModalProps {
    data: IConsultaReceitaFederalQSA;
}

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<IConsultaReceitaFederalQSA>();

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
                    Receita Federal QSA
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Flex flexDir="column" gap={4}>
                        {data?.receitaFederalQsa.qsa.map((receitaFederalQSA, index) => (
                            <ReceitaFederalQSA key={index} data={receitaFederalQSA} />
                        ))}
                    </Flex>
                </ModalBody>

                <ModalFooter><Link target="_blank" href={data?.receitaFederalQsa.urlComprovante} display='flex' alignItems='center'><HiLink /> Comprovante</Link></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const ModalReceitaFederalQSA = forwardRef(ModalBase);
