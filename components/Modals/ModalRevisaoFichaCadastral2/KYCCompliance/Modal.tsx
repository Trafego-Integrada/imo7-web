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
import { ISancoes, Sancoes } from "./Sancoes";

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
                    KYC e Compliance
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Flex flexDir="column" gap={4}>
                        <Text>
                            Sanções ativas:{" "}
                            <strong>{data?.pepKyc.currentlySanctioned}</strong>
                        </Text>

                        <Text>
                            Sanções encontradas nos últimos 30 dias: <strong>{data?.pepKyc.last30DaysSanctions}</strong>
                        </Text>

                        <Text>
                            Sanções encontradas nos últimos 90 dias: <strong>{data?.pepKyc.last90DaysSanctions}</strong>
                        </Text>

                        <Text>
                            Sanções encontradas nos últimos 180 dias: <strong>{data?.pepKyc.last180DaysSanctions}</strong>
                        </Text>

                        <Text>
                            Sanções encontradas nos últimos 365 dias: <strong>{data?.pepKyc.last365DaysSanctions}</strong>
                        </Text>

                        <Text>
                            Pessoas expostas politicamente (PEP) ou possui algum vínculo com alguma PEP:{" "}
                            <strong>{data?.pepKyc.currentlyPEP}</strong>
                        </Text>

                        <Text>
                            Exposto politicamente no último ano: <strong>{data?.pepKyc.lastYearOccurencePEP}</strong>
                        </Text>

                        <Text>
                            Exposto politicamente nos últimos 3 anos: <strong>{data?.pepKyc.last3YearsOccurencePEP}</strong>
                        </Text>

                        <Text>
                            Exposto politicamente nos últimos 5 anos: <strong>{data?.pepKyc.last5YearsOccurencePEP}</strong>
                        </Text>

                        <Text>
                            Exposto politicamente: <strong>{data?.pepKyc.last5PlusYearsOccurencePEP}</strong>
                        </Text>
                        {data?.pepKyc.historyPEP.map((pessoaPoliticamenteExposta, index) => (
                            <PessoaPoliticamenteExposta key={index} data={pessoaPoliticamenteExposta} />
                        ))}
                        {data?.pepKyc.sanctionsHistory.map((sancoes, index) => (
                            <Sancoes key={index} data={sancoes} />
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalKYCCompliance = forwardRef(ModalBase);
