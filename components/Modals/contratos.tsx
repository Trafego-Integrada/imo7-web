import { formatoData, formatoValor } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
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
import { buscarContrato } from "@/services/models/contrato";
import { FormDate } from "@/components/Form/FormDate";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Title } from "@/components/Gerais/title";
import { Chamados } from "./Contrato/Chamados";
import { Cobrancas } from "./Contrato/Cobrancas";
import { Documentos } from "./Contrato/Documentos";
import { Extratos } from "./Contrato/Extratos";
import { Fiadores } from "./Contrato/Fiadores";
import { Inquilinos } from "./Contrato/Inquilinos";
import { Proprietarios } from "./Contrato/Proprietarios";

const ModalBase = ({}, ref) => {
    const { usuario } = useAuth();
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
                    <ModalHeader>Contrato Nº {watch("codigo")} </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>
                        <Tabs variant="solid-rounded" size="sm">
                            <TabList gap={2} overflow="auto">
                                <Tab>Dados</Tab>
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarDocumentos"
                                ) && (
                                    <Tab>
                                        Documentos
                                        <Badge
                                            ml={1}
                                            size="sm"
                                            textAlign="center"
                                            rounded="full"
                                        >
                                            {watch("anexos")?.length}
                                        </Badge>
                                    </Tab>
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarCobrancas"
                                ) && (
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
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarInquilinos"
                                ) && (
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
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarProprietarios"
                                ) && (
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
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarFiadores"
                                ) && (
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
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarExtratos"
                                ) && (
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
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarChamados"
                                ) && (
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
                                )}
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
                                                    Última parcela paga
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
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarChamados"
                                ) && (
                                    <TabPanel>
                                        <Documentos
                                            contratoId={watch("id")}
                                            data={watch("anexos")}
                                        />
                                    </TabPanel>
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarCobrancas"
                                ) && (
                                    <TabPanel>
                                        <Cobrancas data={watch("boletos")} />
                                    </TabPanel>
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarInquilinos"
                                ) && (
                                    <TabPanel>
                                        <Inquilinos
                                            data={watch("inquilinos")}
                                        />
                                    </TabPanel>
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarProprietarios"
                                ) && (
                                    <TabPanel>
                                        <Proprietarios
                                            data={watch("proprietarios")}
                                        />
                                    </TabPanel>
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarFiadores"
                                ) && (
                                    <TabPanel>
                                        <Fiadores data={watch("fiadores")} />
                                    </TabPanel>
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarExtratos"
                                ) && (
                                    <TabPanel>
                                        <Extratos data={watch("extratos")} />
                                    </TabPanel>
                                )}
                                {usuario?.permissoes?.find(
                                    (m) =>
                                        m ===
                                        "imobiliaria.contratos.visualizarChamados"
                                ) && (
                                    <TabPanel>
                                        <Chamados data={watch("chamados")} />
                                    </TabPanel>
                                )}
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
