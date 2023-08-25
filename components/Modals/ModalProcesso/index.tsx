import { Title } from "@/components/Gerais/title";
import { formatoData, formatoValor } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import { buscarContrato } from "@/services/models/contrato";
import {
    Badge,
    Box,
    Button,
    Grid,
    GridItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Chamados } from "../Contrato/Chamados";
import { Cobrancas } from "../Contrato/Cobrancas";
import { Documentos } from "../Contrato/Documentos";
import { Extratos } from "../Contrato/Extratos";
import { Fiadores } from "../Contrato/Fiadores";
import { Inquilinos } from "../Contrato/Inquilinos";
import { Proprietarios } from "../Contrato/Proprietarios";
import { EditarProcesso } from "./EditarProcesso";
import { NovoProcesso } from "./NovoProcesso";

const ModalBase = ({}, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [id, setId] = useState(null);

    useImperativeHandle(ref, () => ({
        onOpen: async (id = null) => {
            setId(id);
            if (id) {
                onOpen(id);
            } else {
                onOpen();
            }
        },
    }));
    return (
        <>
            {id ? (
                <EditarProcesso id={id} isOpen={isOpen} onClose={onClose} />
            ) : (
                <NovoProcesso
                    isOpen={isOpen}
                    onClose={onClose}
                    callback={setId}
                />
            )}
        </>
    );
};
export const ModalProcesso = forwardRef(ModalBase);
