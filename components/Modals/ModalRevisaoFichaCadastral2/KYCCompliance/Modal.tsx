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
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";

import {
    PessoaPoliticamenteExposta,
    IPessoaPoliticamenteExposta,
} from "./PessoaPoliticamenteExposta";

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

    const renderDetail = (label: string, value: any) => (
        <Text>
            {label}: <strong>{value}</strong>
        </Text>
    );

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
                        {renderDetail(
                            "Sanções ativas",
                            data?.pepKyc.currentlySanctioned
                        )}

                        {
                            data?.pepKyc.currentlySanctioned !== 'Não' && (
                                <>
                                    {renderDetail(
                                        "Sanções encontradas nos últimos 30 dias",
                                        data?.pepKyc.last30DaysSanctions
                                    )}
                                    {renderDetail(
                                        "Sanções encontradas nos últimos 90 dias",
                                        data?.pepKyc.last90DaysSanctions
                                    )}
                                    {renderDetail(
                                        "Sanções encontradas nos últimos 180 dias",
                                        data?.pepKyc.last180DaysSanctions
                                    )}
                                    {renderDetail(
                                        "Sanções encontradas nos últimos 365 dias",
                                        data?.pepKyc.last365DaysSanctions
                                    )}
                                </>
                            )
                        }
                        {renderDetail(
                            "Pessoas expostas politicamente (PEP) ou possui algum vínculo com alguma PEP",
                            data?.pepKyc.currentlyPEP
                        )}

                        {
                            data?.pepKyc.currentlyPEP !== 'Não' && (
                                <>
                                    {renderDetail(
                                        "Exposto politicamente no último ano",
                                        data?.pepKyc.lastYearOccurencePEP
                                    )}
                                    {renderDetail(
                                        "Exposto politicamente nos últimos 3 anos",
                                        data?.pepKyc.last3YearsOccurencePEP
                                    )}
                                    {renderDetail(
                                        "Exposto politicamente nos últimos 5 anos",
                                        data?.pepKyc.last5YearsOccurencePEP
                                    )}
                                    {renderDetail(
                                        "Exposto politicamente",
                                        data?.pepKyc.last5PlusYearsOccurencePEP
                                    )}
                                </>
                            )
                        }


                        <Tabs colorScheme="blue" variant="enclosed">
                            {
                                (data?.pepKyc.currentlyPEP !== 'Não' && data?.pepKyc.currentlySanctioned)
                                && (
                                    <TabList>
                                        <Tab fontWeight="bold" fontSize="sm">
                                            Consultas de CPF
                                        </Tab>
                                        <Tab fontWeight="bold" fontSize="sm">
                                            Consultas de CNPJ
                                        </Tab>
                                    </TabList>
                                )
                            }



                            <TabPanels>
                                {
                                    data?.pepKyc.currentlyPEP !== 'Não' && (
                                        <TabPanel
                                            border="1px"
                                            borderColor="#e1e8f0"
                                            rounded="md"
                                            roundedTopLeft={0}
                                        >
                                            {data?.pepKyc.historyPEP.map(
                                                (pessoaPoliticamenteExposta, index) => (
                                                    <PessoaPoliticamenteExposta
                                                        key={index}
                                                        data={
                                                            pessoaPoliticamenteExposta
                                                        }
                                                    />
                                                )
                                            )}
                                        </TabPanel>
                                    )
                                }

                                {
                                    data?.pepKyc.currentlySanctioned !== 'Não' && (
                                        <TabPanel
                                            border="1px"
                                            borderColor="#e1e8f0"
                                            rounded="md"
                                            roundedTopLeft={0}
                                        >
                                            {data?.pepKyc.sanctionsHistory.map(
                                                (sancoes, index) => (
                                                    <Sancoes
                                                        key={index}
                                                        data={sancoes}
                                                    />
                                                )
                                            )}
                                        </TabPanel>
                                    )
                                }
                            </TabPanels>
                        </Tabs>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalKYCCompliance = forwardRef(ModalBase);

