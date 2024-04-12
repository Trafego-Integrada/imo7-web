import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Flex,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { formatarParaDataBR } from "@/utils/formatarParaDataBR";

interface IReceitaFederalCND {
    codigoCertidao: string;
    certidao: string;
    debitosPendentesPGFN: string;
    debitosPendentesRFB: string;
    validadeCertidao: string;
    urlComprovante: string;
}

interface IConsultaReceitaFederalCND {
    cpf?: string;
    cnpj?: string;
    receitaFederalCND: IReceitaFederalCND
}

interface ModalProps {
    data: IConsultaReceitaFederalCND
}

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<IConsultaReceitaFederalCND>();

    const renderDetail = (label: string, value: any) => (
        <Text>
            {label}: <strong>{value}</strong>
        </Text>
    );

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
                    Certidão Negativa de Débitos
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Flex flexDir="column" gap={4}>
                        {renderDetail('Código Certidao', data?.receitaFederalCND.codigoCertidao)}
                        {renderDetail('Certidao', data?.receitaFederalCND.certidao)}
                        {renderDetail('Débitos Pendentes PGFN', data?.receitaFederalCND.debitosPendentesPGFN)}
                        {renderDetail('Débitos Pendentes RFB', data?.receitaFederalCND.debitosPendentesRFB)}
                        {renderDetail('Validade Certidao', formatarParaDataBR(data?.receitaFederalCND.validadeCertidao ?? new Date().toISOString()))}
                        {renderDetail('URL Comprovante',
                            <Link href={data?.receitaFederalCND.urlComprovante} target="_blank" >
                                {data?.receitaFederalCND.urlComprovante}
                            </Link>
                        )}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalReceitaFederalCND = forwardRef(ModalBase);
