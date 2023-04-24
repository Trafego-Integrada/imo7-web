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
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { LinhaDoTempo } from "./LinhaDoTempo";
import { Conversas } from "./Conversas";
import { Orcamentos } from "./Orcamentos";
import { Tarefas } from "./Tarefas";
import { Anexos } from "./Anexos";
import { ModalAbrirChamado } from "../AbrirChamado";
import { FiEdit3 } from "react-icons/fi";
import { AiFillCloseSquare } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
const schema = yup.object({
    participantes: yup.array().required("Campo Obrigatório"),
    departamento: yup.string().required("Campo Obrigatório"),
    assunto: yup.string().required("Campo Obrigatório"),
    titulo: yup.string().required("Campo Obrigatório"),
    mensagem: yup.string().required("Campo Obrigatório"),
});
const ModalBase = ({}, ref) => {
    const modal = useRef();
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
                <ModalHeader as={Flex} justifyContent="space-between">
                    <Box>
                        <Text fontWeight="bold">Chamado #{chamado?.id}</Text>
                        <Text fontSize="sm" color="gray.600">
                            {chamado.assunto?.titulo} |{" "}
                            {chamado.assunto?.departamento?.titulo} |{" "}
                            {chamado.titulo}
                        </Text>
                        <Flex gap={4}>
                            {chamado?.codigoContrato && (
                                <Text fontSize="sm" color="gray.600">
                                    Cod. Contrato: {chamado?.codigoContrato}
                                </Text>
                            )}
                            {chamado?.codigoImovel && (
                                <Text fontSize="sm" color="gray.600">
                                    Cod. Imovel: {chamado?.codigoImovel}
                                </Text>
                            )}
                            {chamado?.cepImovel && (
                                <Text fontSize="sm" color="gray.600">
                                    Endereco Imóvel:{" "}
                                    {`${chamado?.enderecoImovel} ${chamado?.numeroImovel}, ${chamado?.bairroImovel}, ${chamado?.cidadeImovel}, ${chamado?.estadoImovel}, CEP: ${chamado?.cepImovel}`}
                                </Text>
                            )}
                        </Flex>
                    </Box>
                    <Flex>
                        <Tooltip label="Editar chamado">
                            <IconButton
                                size="sm"
                                variant="ghost"
                                icon={<FiEdit3 />}
                                onClick={() =>
                                    modal.current.onOpen(chamado?.id)
                                }
                            />
                        </Tooltip>
                        <Tooltip label="Fechar modal">
                            <IconButton
                                size="sm"
                                variant="ghost"
                                icon={<IoClose />}
                                onClick={() => onClose()}
                            />
                        </Tooltip>
                    </Flex>
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
            <ModalAbrirChamado
                ref={modal}
                callback={() => {
                    buscar.mutate(chamado.id, {
                        onSuccess: (data) => {
                            setChamado(data);
                        },
                    });
                }}
            />
        </Modal>
    );
};

export const ModalChamado = forwardRef(ModalBase);
