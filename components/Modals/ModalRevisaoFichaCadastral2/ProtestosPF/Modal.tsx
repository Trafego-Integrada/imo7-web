import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
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
import { Protesto } from "./Protesto";

export interface IProtesto {
    cpfCnpj: string,
    data: string,
    dataProtesto: string,
    dataVencimento: string,
    valor: string
}

export interface ICeprotProtestos {
    SP: {
        cartorio: string,
        cidade: string,
        endereco: string,
        obterDetalhes: any,
        protestos: IProtesto[]
        quantidadeTitulos: number,
        telefone: string
    }[]
}

export interface IConsultaProtestos {
    cpf?: string;
    cnpj?: string;
    cenprotProtestos: ICeprotProtestos
}

interface ModalProps {
    data: IConsultaProtestos;
}

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [data, setData] = useState<IConsultaProtestos>();

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
                    <Text>Consulta de Protestos</Text>
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    {
                        data?.cenprotProtestos?.SP
                            ?
                            data?.cenprotProtestos?.SP?.map((sp, index) => (
                                <Box key={index}>
                                    <Text>Cartorio: {sp.cartorio}</Text>
                                    <Text>Cidade: {sp.cidade}</Text>
                                    <Text>Endereco: {sp.endereco}</Text>
                                    <Text>Detalhes: {sp.obterDetalhes}</Text>
                                    <Text>Quantidade de Títulos: {sp.quantidadeTitulos}</Text>
                                    <Text>Telefone: {sp.telefone}</Text>
                                    <Box>
                                        {
                                            sp.protestos.map((protesto, index) => (
                                                <Protesto key={index} {...protesto} />
                                            ))
                                        }
                                    </Box>
                                </Box>
                            ))
                            :
                            <Text>Nenhum prostesto encontrado</Text>
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalProtesto = forwardRef(ModalBase);
