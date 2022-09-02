import { formatoData, formatoValor } from "@/helpers/helpers";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
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
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiAddLine } from "react-icons/ri";
import { useMutation } from "react-query";
import { buscarContrato } from "../../services/models/contrato";
import { FormDate } from "../Form/FormDate";
import { FormInput } from "../Form/FormInput";
import { FormSelect } from "../Form/FormSelect";
import { Title } from "../Gerais/title";

const ModalBase = ({}, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [contrato, setContrato] = useState({});
    const {
        reset,
        watch,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const buscar = useMutation(buscarContrato);
    useImperativeHandle(ref, () => ({
        onOpen: async (id = null) => {
            if (id) {
                await buscar.mutateAsync(id, {
                    onSuccess: (data) => {
                        reset(data.data);
                    },
                });
                onOpen();
            } else {
                onOpen();
            }
        },
    }));
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent minW="60%">
                    <ModalHeader>Contrato Nº 32424</ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>
                        <Tabs variant="unstyled">
                            <TabList>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "blue.500",
                                    }}
                                >
                                    Dados
                                </Tab>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "blue.500",
                                    }}
                                >
                                    Documentos
                                </Tab>
                                <Tab
                                    _selected={{
                                        color: "white",
                                        bg: "blue.500",
                                    }}
                                >
                                    Cobranças
                                </Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <Grid
                                        gap={5}
                                        templateColumns={{
                                            sm: "repeat(1, 1fr)",
                                            md: "repeat(2, 1fr)",
                                            lg: "repeat(3, 1fr)",
                                        }}
                                    >
                                        <GridItem>
                                            <Box>
                                                <Text fontSize="sm">
                                                    Nº do Contrato
                                                </Text>
                                                <Text>{watch("codigo")}</Text>
                                            </Box>
                                        </GridItem>

                                        <GridItem>
                                            <Box>
                                                <Text fontSize="sm">
                                                    Data Fim
                                                </Text>
                                                <Text>
                                                    {watch("dataFim") &&
                                                        formatoData(
                                                            watch("dataFim")
                                                        )}
                                                </Text>
                                            </Box>
                                        </GridItem>

                                        <GridItem>
                                            <Box>
                                                <Text fontSize="sm">
                                                    Dia Recebimento
                                                </Text>
                                                <Text>
                                                    {watch("diaRecebimento")}
                                                </Text>
                                            </Box>
                                        </GridItem>
                                    </Grid>

                                    <Title children="Gerais" />
                                    <Grid
                                        gap={5}
                                        templateColumns={{
                                            sm: "repeat(1, 1fr)",
                                            md: "repeat(2, 1fr)",
                                            lg: "repeat(3, 1fr)",
                                        }}
                                    >
                                        <GridItem>
                                            <Box>
                                                <Text fontSize="sm">
                                                    Taxa Administrativa
                                                </Text>
                                                <Text>{watch("taxaAdm")}%</Text>
                                            </Box>
                                        </GridItem>
                                        <GridItem>
                                            <Box>
                                                <Text fontSize="sm">
                                                    Data de Início
                                                </Text>
                                                <Text>
                                                    {watch("dataInicio") &&
                                                        formatoData(
                                                            watch("dataInicio")
                                                        )}
                                                </Text>
                                            </Box>
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="Duração"
                                                placeholder="ex: 36 meses"
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInput
                                                label="reajuste"
                                                placeholder="ex: 111"
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormSelect
                                                label="Indicador p/ reajuste"
                                                placeholder="selecione..."
                                            >
                                                <option value="">IGPM</option>
                                            </FormSelect>
                                        </GridItem>
                                        <GridItem>
                                            <FormDate label="Último reajuste" />
                                        </GridItem>
                                    </Grid>
                                    <Title children="Pagamento" />
                                    <Grid
                                        gap={5}
                                        templateColumns={{
                                            sm: "repeat(1, 1fr)",
                                            md: "repeat(2, 1fr)",
                                            lg: "repeat(4, 1fr)",
                                        }}
                                    >
                                        <GridItem>
                                            <Box>
                                                <Text fontSize="sm">
                                                    Valor do Aluguel
                                                </Text>
                                                <Text>
                                                    {formatoValor(
                                                        Number(
                                                            watch(
                                                                "valorAluguel"
                                                            )
                                                        )
                                                    )}
                                                </Text>
                                            </Box>
                                        </GridItem>
                                        <GridItem>
                                            <Box>
                                                <Text fontSize="sm">
                                                    Dia Vencimento
                                                </Text>
                                                <Text>
                                                    {watch("diaVencimento")}
                                                </Text>
                                            </Box>
                                        </GridItem>
                                        <GridItem>
                                            <Box>
                                                <Text fontSize="sm">
                                                    Ultima parcela paga
                                                </Text>
                                                <Text>
                                                    {watch("ultimaParcPaga")}
                                                </Text>
                                            </Box>
                                        </GridItem>
                                        <GridItem>
                                            <Box>
                                                <Text fontSize="sm">Multa</Text>
                                                <Text>{watch("multa")}</Text>
                                            </Box>
                                        </GridItem>
                                        <GridItem>
                                            <GridItem>
                                                <Box>
                                                    <Text fontSize="sm">
                                                        Forma de pagamento
                                                    </Text>
                                                    <Text></Text>
                                                </Box>
                                            </GridItem>
                                        </GridItem>
                                    </Grid>
                                    <Box py={2}>
                                        <Text fontWeight="bold">
                                            Proprietários
                                        </Text>
                                        <Table size="sm" variant="striped">
                                            <Thead>
                                                <Tr>
                                                    <Th>Nome</Th>
                                                    <Th>CPF</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {watch("proprietarios") &&
                                                    watch("proprietarios").map(
                                                        (item) => (
                                                            <Tr key={item.id}>
                                                                <Td>
                                                                    {item.nome}
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        item.documento
                                                                    }
                                                                </Td>
                                                            </Tr>
                                                        )
                                                    )}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                    <Box py={2}>
                                        <Text fontWeight="bold">Fiadores</Text>
                                        <Table size="sm" variant="striped">
                                            <Thead>
                                                <Tr>
                                                    <Th>Nome</Th>
                                                    <Th>CPF</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {watch("fiadores") &&
                                                    watch("fiadores").map(
                                                        (item) => (
                                                            <Tr key={item.id}>
                                                                <Td>
                                                                    {item.nome}
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        item.documento
                                                                    }
                                                                </Td>
                                                            </Tr>
                                                        )
                                                    )}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                    <Box py={2}>
                                        <Text fontWeight="bold">
                                            Inquilinos
                                        </Text>
                                        <Table size="sm" variant="striped">
                                            <Thead>
                                                <Tr>
                                                    <Th>Nome</Th>
                                                    <Th>CPF</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {watch("inquilinos") &&
                                                    watch("inquilinos").map(
                                                        (item) => (
                                                            <Tr key={item.id}>
                                                                <Td>
                                                                    {item.nome}
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        item.documento
                                                                    }
                                                                </Td>
                                                            </Tr>
                                                        )
                                                    )}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    <Grid d="flex" gap={3}>
                                        <Button
                                            size="md"
                                            bg="none"
                                            border="1px solid #2F80ED"
                                            _hover={{
                                                bg: "bluelight",
                                                color: "white",
                                                cursor: "pointer",
                                            }}
                                            _focus={{ bg: "none" }}
                                            _active={{ bg: "none" }}
                                            color="bluelight"
                                        >
                                            <Icon as={RiAddLine} />
                                            <Text pl="2">Anexar arquivo</Text>
                                        </Button>

                                        <Button
                                            size="md"
                                            bg="none"
                                            border="1px solid #F2994A"
                                            _hover={{
                                                bg: "orange",
                                                color: "white",
                                                cursor: "pointer",
                                            }}
                                            _focus={{ bg: "none" }}
                                            _active={{ bg: "none" }}
                                            color="orange"
                                        >
                                            <Icon as={IoDocumentTextOutline} />
                                            <Text pl="2">Gerar documento</Text>
                                        </Button>
                                    </Grid>

                                    <Table variant="striped" mt={5} bg="white">
                                        <Thead>
                                            <Tr>
                                                <Th>#</Th>
                                                <Th>Título</Th>
                                                <Th>Criado em</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            <Tr>
                                                <Td>643334</Td>
                                                <Td>comprovante-contrato</Td>
                                                <Td>13/05/2022</Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Fechar
                        </Button>
                        <Button colorScheme="blue" mr={3}>
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalContratos = forwardRef(ModalBase);
