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
} from "@chakra-ui/react";

import { PessoaPoliticamenteExposta, IPessoaPoliticamenteExposta } from "./PessoaPoliticamenteExposta";
import { ISancoes } from "./Sancoes";

interface IKYCCompliance {
    cpf: string;
    pepKyc: {
        currentlySanctioned: string;
        last30DaysSanctions: number;
        last90DaysSanctions: number;
        last180DaysSanctions: number;
        last365DaysSanctions: number;
        currentlyPEP: string;
        lastYearOccurencePEP: number;
        last3YearsOccurencePEP: number;
        last5YearsOccurencePEP: number;
        last5PlusYearsOccurencePEP: number;
        historyPEP: IPessoaPoliticamenteExposta[];
        sanctionsHistory: ISancoes[];
    };
}

interface ModalProps {
    data: IKYCCompliance;
}

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<IKYCCompliance>();

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
                        <Text>
                            Sanções ativas:{" "}
                            <Text fontWeight="bold">{data?.pepKyc.currentlySanctioned}</Text>
                        </Text>

                        <Text>
                            Sanções encontradas nos últimos 30 dias: <Text fontWeight="bold">{data?.pepKyc.last30DaysSanctions}</Text>
                        </Text>

                        <Text>
                            Sanções encontradas nos últimos 90 dias: <Text fontWeight="bold">{data?.pepKyc.last90DaysSanctions}</Text>
                        </Text>

                        <Text>
                            Sanções encontradas nos últimos 180 dias: <Text fontWeight="bold">{data?.pepKyc.last180DaysSanctions}</Text>
                        </Text>

                        <Text>
                            Sanções encontradas nos últimos 365 dias: <Text fontWeight="bold">{data?.pepKyc.last365DaysSanctions}</Text>
                        </Text>

                        <Text>
                            Pessoas expostas politicamente (PEP) ou possui algum vínculo com alguma PEP:{" "}
                            <Text fontWeight="bold">{data?.pepKyc.currentlyPEP}</Text>
                        </Text>

                        <Text>
                            Exposto politicamente no último ano: <Text fontWeight="bold">{data?.pepKyc.lastYearOccurencePEP}</Text>
                        </Text>

                        <Text>
                            Exposto politicamente nos últimos 3 anos: <Text fontWeight="bold">{data?.pepKyc.last3YearsOccurencePEP}</Text>
                        </Text>

                        <Text>
                            Exposto politicamente nos últimos 5 anos: <Text fontWeight="bold">{data?.pepKyc.last5YearsOccurencePEP}</Text>
                        </Text>

                        <Text>
                            Exposto politicamente: <Text fontWeight="bold">{data?.pepKyc.last5PlusYearsOccurencePEP}</Text>
                        </Text>
                        {data?.pepKyc.historyPEP.map((pessoaPoliticamenteExposta, index) => (
                            <PessoaPoliticamenteExposta key={index} data={pessoaPoliticamenteExposta} />
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalEmpresaRelacionada = forwardRef(ModalBase);
