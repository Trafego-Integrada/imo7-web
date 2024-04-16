import { imo7ApiService } from "@/services/apiServiceUsage";
import {
    Avatar,
    Box,
    Divider,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Progress,
    Text,
    useDisclosure,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Categorias } from "./Categorias";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Documentos } from "../Contrato/Documentos";
import { Historicos } from "@/components/Pages/Historicos";

const schema = yup.object({
    status: yup.string().required("Status é obrigatório"),
    motivoReprovacaoId: yup.string().when("status", {
        is: "reprovada", // quando o campo status for igual a 'reprovado'
        then: yup.string().required("Motivo da Reprovação é obrigatório"), // torna o campo motivoReprovacaoId obrigatório
        otherwise: yup.string().nullable(), // em outros casos, o campo motivoReprovacaoId não é obrigatório
    }),
});

const ModalBase = ({}, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [ficha, setFicha] = useState(null);
    const [modeloFicha, setModeloFicha] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const {
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const buscarFicha = useMutation(imo7ApiService("fichaCadastral").get, {
        onSuccess: (data) => {
            reset(data);

            setFicha(data);
            buscarModeloFicha.mutate(data.modeloFichaCadastralId);
        },
    });

    const buscarModeloFicha = useMutation(imo7ApiService("modeloFicha").get, {
        onSuccess: (data) => {
            setModeloFicha(data);
        },
    });

    const { data: categorias } = useQuery(
        ["categoriasFicha", { tipoFicha: modeloFicha?.tipo }],
        imo7ApiService("categoriaCampoFicha").list,
        {
            enabled: !!modeloFicha?.tipo,
        }
    );

    // Buscar fichas do mesmo processo
    useImperativeHandle(ref, () => ({
        onOpen: (id) => {
            setIsLoading(true);
            onOpen();

            buscarFicha.mutate(id, {
                onSuccess: (data) => {
                    setIsLoading(false);
                },
            });
        },
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Ficha Cadastral
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Tabs size="sm">
                        <TabList>
                            {watch("id") && <Tab>Revisão</Tab>}

                            {watch("id") && (
                                <Tab>
                                    Anexos{" "}
                                    <Tag colorScheme="blue" size="sm" ml={1}>
                                        {watch("_count.Anexo")}
                                    </Tag>
                                </Tab>
                            )}

                            <Tab>Histórico da FIcha</Tab>
                            <Tab>Histórico do Processo</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel px={0}>
                                {isLoading ? (
                                    <Flex
                                        justify="center"
                                        align="center"
                                        h="200px"
                                    >
                                        <Spinner size="xl" />
                                    </Flex>
                                ) : (
                                    <Flex
                                        flexDir="column"
                                        gap={4}
                                        bg="#EDF2F7"
                                        rounded="xl"
                                        borderWidth={1}
                                        borderColor="gray.200 "
                                        p={4}
                                    >
                                        <Flex
                                            gap={4}
                                            align="center"
                                            py={4}
                                            justify="space-between"
                                        >
                                            <Flex gap={4}>
                                                <Avatar size="lg" />
                                                <Box>
                                                    <Text>{ficha?.nome}</Text>

                                                    <Progress
                                                        value={
                                                            ficha?.porcentagemPreenchimento
                                                        }
                                                        max={100}
                                                    />
                                                    <Text>
                                                        <Text
                                                            as="span"
                                                            color="gray"
                                                        >
                                                            Imovel:
                                                        </Text>
                                                        {` ${ficha?.imovel?.codigo} -  ${ficha?.imovel?.endereco}, ${ficha?.imovel?.bairro}`}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        </Flex>
                                        <Divider />
                                        <Box>
                                            <Text fontWeight="bold">
                                                Todas as consultas Disponiveis
                                            </Text>
                                        </Box>
                                        <Categorias
                                            categorias={categorias?.data}
                                            modeloFicha={modeloFicha}
                                            ficha={ficha}
                                            buscarFicha={buscarFicha}
                                        />
                                    </Flex>
                                )}
                            </TabPanel>

                            <TabPanel>
                                <Documentos
                                    fichaCadastralId={watch("id")}
                                    contratoId={watch("contratoId")}
                                    data={watch("anexos")}
                                />
                            </TabPanel>

                            <TabPanel>
                                <Historicos
                                    tabela="FichaCadastral"
                                    tabelaId={watch("id")}
                                />
                            </TabPanel>

                            <TabPanel>
                                <Historicos
                                    tabela="Processo"
                                    tabelaId={watch("processoId")}
                                />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalRevisaoFichaCadastral2 = forwardRef(ModalBase);
