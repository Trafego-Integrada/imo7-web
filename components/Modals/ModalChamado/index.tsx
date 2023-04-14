import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { Input } from "@/components/Forms/Input";
import { Select } from "@/components/Forms/Select";
import { listarAssuntos } from "@/services/models/assunto";
import {
    buscarChamado,
    cadastrarChamado,
    iniciarConversaChamado,
} from "@/services/models/chamado";
import {
    listarContratos,
    listarParticipantesContratos,
} from "@/services/models/contrato";
import { listarDepartamentos } from "@/services/models/departamento";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Text,
    ModalCloseButton,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { LinhaDoTempo } from "./LinhaDoTempo";
import { Conversas } from "./Conversas";
import { Orcamentos } from "./Orcamentos";
import { Tarefas } from "./Tarefas";
import { Anexos } from "./Anexos";
const schema = yup.object({
    participantes: yup.array().required("Campo Obrigatório"),
    departamento: yup.string().required("Campo Obrigatório"),
    assunto: yup.string().required("Campo Obrigatório"),
    titulo: yup.string().required("Campo Obrigatório"),
    mensagem: yup.string().required("Campo Obrigatório"),
});
const ModalBase = ({}, ref) => {
    const [chamado, setChamado] = useState({});
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast();
    const router = useRouter();

    const buscar = useMutation(buscarChamado);

    useImperativeHandle(ref, () => ({
        onOpen: async (id) => {
            setChamado({});
            await buscar.mutateAsync(id, {
                onSuccess: (data) => {
                    setChamado(data);
                    onOpen();
                },
            });
        },
    }));
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Box>
                        <Text fontWeight="bold">Chamado #{chamado?.id}</Text>
                        <Text fontSize="sm" color="gray.600">
                            {chamado.assunto?.titulo} |{" "}
                            {chamado.assunto?.departamento?.titulo} |{" "}
                            {chamado.titulo}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Ref. Contrato #{chamado?.contrato?.codigo}
                        </Text>
                    </Box>
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Box>
                        <Box>
                            <Tabs variant="solid-rounded" size="sm">
                                <TabList>
                                    <Tab>Linha do Tempo</Tab>
                                    <Tab>Conversas</Tab>
                                    <Tab>Orçamentos</Tab>
                                    <Tab>Tarefas</Tab>
                                    <Tab>Anexos</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <LinhaDoTempo chamado={chamado} />
                                    </TabPanel>
                                    <TabPanel>
                                        <Conversas chamado={chamado} />
                                    </TabPanel>
                                    <TabPanel>
                                        <Orcamentos chamado={chamado} />
                                    </TabPanel>
                                    <TabPanel>
                                        <Tarefas chamado={chamado} />
                                    </TabPanel>
                                    <TabPanel>
                                        <Anexos chamadoId={chamado?.id} />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalChamado = forwardRef(ModalBase);
