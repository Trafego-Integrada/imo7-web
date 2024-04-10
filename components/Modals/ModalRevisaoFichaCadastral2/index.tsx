import { imo7ApiService } from "@/services/apiServiceUsage";
import {
    Avatar,
    Box,
    Button,
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
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Categorias } from "./Categorias";

const ModalBase = ({}, ref) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [ficha, setFicha] = useState(null);
    const [modeloFicha, setModeloFicha] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const buscarFicha = useMutation(imo7ApiService("fichaCadastral").get, {
        onSuccess: (data) => {
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
                    {isLoading ? (
                        <Flex justify="center" align="center" h="200px">
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
                                            <Text as="span" color="gray">
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
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalRevisaoFichaCadastral2 = forwardRef(ModalBase);
