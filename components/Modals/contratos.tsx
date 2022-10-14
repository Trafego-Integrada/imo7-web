import { formatoData, formatoValor } from "@/helpers/helpers";
import {
    Badge,
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
    Tag,
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
import { Chamados } from "./Contrato/Chamados";
import { Cobrancas } from "./Contrato/Cobrancas";
import { Documentos } from "./Contrato/Documentos";
import { Extratos } from "./Contrato/Extratos";
import { Fiadores } from "./Contrato/Fiadores";
import { Inquilinos } from "./Contrato/Inquilinos";
import { Proprietarios } from "./Contrato/Proprietarios";

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
                        <Tabs variant="solid-rounded" size="sm">
                            <TabList gap={2}>
                                <Tab>Dados</Tab>
                                <Tab>Documentos</Tab>
                                <Tab>
                                    Cobranças
                                    <Badge
                                        ml={1}
                                        size="sm"
                                        textAlign="center"
                                        rounded="full"
                                    >
                                        {watch("boletos")?.length}
                                    </Badge>
                                </Tab>
                                <Tab>
                                    Inquilinos
                                    <Badge
                                        ml={1}
                                        size="sm"
                                        textAlign="center"
                                        rounded="full"
                                    >
                                        {watch("inquilinos")?.length}
                                    </Badge>
                                </Tab>
                                <Tab>
                                    Proprietários
                                    <Badge
                                        ml={1}
                                        size="sm"
                                        textAlign="center"
                                        rounded="full"
                                    >
                                        {watch("proprietarios")?.length}
                                    </Badge>
                                </Tab>
                                <Tab>
                                    Fiadores
                                    <Badge
                                        ml={1}
                                        size="sm"
                                        textAlign="center"
                                        rounded="full"
                                    >
                                        {watch("fiadores")?.length}
                                    </Badge>
                                </Tab>
                                <Tab>
                                    Extratos
                                    <Badge
                                        ml={1}
                                        size="sm"
                                        textAlign="center"
                                        rounded="full"
                                    >
                                        {watch("extratos")?.length}
                                    </Badge>
                                </Tab>
                                <Tab>
                                    Chamados
                                    <Badge
                                        ml={1}
                                        size="sm"
                                        textAlign="center"
                                        rounded="full"
                                    >
                                        {watch("chamados")?.length}
                                    </Badge>
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Grid
                                        gap={2}
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
                                </TabPanel>
                                <TabPanel>
                                    <Documentos
                                        contratoId={watch("id")}
                                        data={watch("anexos")}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <Cobrancas data={watch("boletos")} />
                                </TabPanel>
                                <TabPanel>
                                    <Inquilinos data={watch("inquilinos")} />
                                </TabPanel>
                                <TabPanel>
                                    <Proprietarios
                                        data={watch("proprietarios")}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <Fiadores data={watch("fiadores")} />
                                </TabPanel>
                                <TabPanel>
                                    <Extratos data={watch("extratos")} />
                                </TabPanel>
                                <TabPanel>
                                    <Chamados data={watch("chamados")} />
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
