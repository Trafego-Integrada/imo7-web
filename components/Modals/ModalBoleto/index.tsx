import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { formatoData, formatoValor, includesAll } from "@/helpers/helpers";
import {
    atualizarAssunto,
    buscarAssunto,
    cadastrarAssunto,
} from "@/services/models/assunto";
import { buscarBoleto } from "@/services/models/boleto";
import {
    atualizarDepartamento,
    buscarDepartamento,
    cadastrarDepartamento,
} from "@/services/models/departamento";
import { listarModulos } from "@/services/models/modulo";
import {
    atualizarPessoa,
    buscarPessoa,
    cadastrarPessoa,
} from "@/services/models/pessoa";
import {
    atualizarUsuario,
    buscarUsuario,
    cadastrarUsuario,
    listarUsuarios,
} from "@/services/models/usuario";
import { queryClient } from "@/services/queryClient";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Checkbox,
    Grid,
    GridItem,
    List,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Switch,
    Tab,
    Table,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

const schema = yup.object({
    titulo: yup.string().required("Campo Obrigatório"),
});

const ModalBase = ({}, ref) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const buscar = useMutation(buscarBoleto, {
        onSuccess: (data) => {
            reset(data);
            onOpen();
        },
    });

    useImperativeHandle(ref, () => ({
        onOpen: async (id = null) => {
            if (id) {
                await buscar.mutateAsync(id);
            } else {
                reset({});
                onOpen();
            }
        },
    }));

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Fatura <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Grid
                            gap={5}
                            templateColumns={{
                                sm: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(2, 1fr)",
                            }}
                        >
                            <GridItem>
                                <Text fontSize="sm">Data de Vencimento</Text>
                                <Text fontWeight="bold">
                                    {watch("data_vencimen") &&
                                        formatoData(
                                            watch("data_vencimen"),
                                            false
                                        )}
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm">Nº do Doc</Text>
                                <Text fontWeight="bold">
                                    {watch("num_doc2")}
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm">Valor</Text>
                                <Text fontWeight="bold">
                                    {formatoValor(watch("valor_doc2"))}
                                </Text>
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <Text fontWeight="bold" mb={4}>
                                    Detalhes:
                                </Text>
                                <List>
                                    <ListItem>{watch("instrucoes1")}</ListItem>
                                    <ListItem>{watch("instrucoes2")}</ListItem>
                                    <ListItem>{watch("instrucoes3")}</ListItem>
                                    <ListItem>{watch("instrucoes4")}</ListItem>
                                    <ListItem>{watch("instrucoes5")}</ListItem>
                                    <ListItem>{watch("instrucoes6")}</ListItem>
                                    <ListItem>{watch("instrucoes7")}</ListItem>
                                    <ListItem>{watch("instrucoes8")}</ListItem>
                                    <ListItem>{watch("instrucoes9")}</ListItem>
                                    <ListItem>{watch("instrucoes10")}</ListItem>
                                </List>
                            </GridItem>
                        </Grid>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Fechar
                        </Button>
                        {watch("barcode") && (
                            <Button
                                as={Link}
                                colorScheme="blue"
                                mr={3}
                                href={`https://www.imo7.com.br/api/boleto/${watch(
                                    "id"
                                )}/pdf`}
                                target="_blank"
                            >
                                Visualizar PDF
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalBoleto = forwardRef(ModalBase);
