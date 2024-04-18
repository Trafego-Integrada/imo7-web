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
    GridItem,
    ModalFooter,
    Button,
    useToast,
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    Link,
    Tooltip,
} from "@chakra-ui/react";
import {
    atualizarFicha,
    cadastrarFicha,
} from "@/services/models/fichaCadastral";
import { queryClient } from "@/services/queryClient";
import { FormSelect } from "@/components/Form/FormSelect";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Categorias } from "./Categorias";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Documentos } from "../Contrato/Documentos";
import { Historicos } from "@/components/Pages/Historicos";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { FiDownload, FiEye } from "react-icons/fi";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { exportToExcel } from "react-json-to-excel";


const schema = yup.object({
    status: yup.string().required("Status é obrigatório"),
    motivoReprovacaoId: yup.string().when("status", {
        is: "reprovada", // quando o campo status for igual a 'reprovado'
        then: yup.string().required("Motivo da Reprovação é obrigatório"), // torna o campo motivoReprovacaoId obrigatório
        otherwise: yup.string().nullable(), // em outros casos, o campo motivoReprovacaoId não é obrigatório
    }),
});

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const toast = useToast();

    const [ficha, setFicha] = useState(null);
    const [modeloFicha, setModeloFicha] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const {
        reset,
        watch,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const buscarFicha = useMutation(imo7ApiService("fichaCadastral").get, {
        onSuccess: (data) => {
            reset(data);

            setFicha(data);
            buscarModeloFicha.mutate(data.modeloFichaCadastralId);
        },
    });

    const cadastrar = useMutation(cadastrarFicha);
    const atualizar = useMutation(atualizarFicha);

    const onSubmit = async (data: any) => {
        console.log({ data });

        try {
            if (data.id) {
                await atualizar.mutateAsync(data);
                onClose();
                toast({ title: "Ficha Cadastrada", status: "success" });
                queryClient.invalidateQueries(["fichas"]);
            } else {
                await cadastrar.mutateAsync(data);
                onClose();
                toast({ title: "Ficha atualizada", status: "success" });
                queryClient.invalidateQueries(["fichas"]);
            }
        } catch (error) {
            //console.log(error);
        }
    };

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

    const { data: motivos } = useQuery(
        ["motivosReprovacao", {}],
        imo7ApiService("motivoReprovacao").list,
        { refetchOnReconnect: false, refetchOnWindowFocus: false }
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
                        <Flex justifyContent='space-between'>
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
                            <Flex
                                gap={2}
                                justify="center"
                                px={4}
                            >
                                <Tooltip label="Gerar PDF">
                                    <IconButton
                                        size="xs"
                                        rounded="full"
                                        colorScheme="blue"
                                        variant="outline"
                                        as={
                                            Link
                                        }
                                        icon={
                                            <FaFilePdf />
                                        }
                                        href={`https://www.imo7.com.br/api/fichaCadastral/${ficha?.id}/pdf`}
                                        target="_blank"
                                        passHref
                                    />
                                </Tooltip>
                                <Tooltip label="Visualizar Ficha">
                                    <IconButton
                                        size="xs"
                                        rounded="full"
                                        colorScheme="blue"
                                        variant="outline"
                                        as={
                                            Link
                                        }
                                        icon={
                                            <FiEye />
                                        }
                                        href={`/fichaCadastral/${ficha?.id}`}
                                        target="_blank"
                                        passHref
                                    />
                                </Tooltip>
                                <Tooltip label="Baixar Todos Arquivos">
                                    <IconButton
                                        size="xs"
                                        rounded="full"
                                        colorScheme="blue"
                                        variant="outline"
                                        as={
                                            Link
                                        }
                                        icon={
                                            <FiDownload />
                                        }
                                        href={`https://www.imo7.com.br/api/fichaCadastral/${ficha?.id}/downloadArquivos`}
                                        target="_blank"
                                        passHref
                                    />
                                </Tooltip>
                                <Tooltip label="Exportar para Excel">
                                    <IconButton
                                        size="xs"
                                        rounded="full"
                                        colorScheme="blue"
                                        variant="outline"
                                        icon={
                                            <FaFileExcel />
                                        }
                                        onClick={() =>
                                            exportToExcel(
                                                ficha?.preenchimento,
                                                "ficha-cadastral-" +
                                                ficha?.id
                                            )}
                                    />
                                </Tooltip>
                            </Flex>
                        </Flex>


                        <TabPanels>
                            <TabPanel px={0}>
                                <Box
                                    id="formRevisarFichaCadastral"
                                    as="form"
                                    onSubmit={handleSubmit(onSubmit)}
                                    bg="white"
                                    rounded="lg"
                                >
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
                                                        <Text>
                                                            {ficha?.nome}
                                                        </Text>

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
                                                    Todas as consultas
                                                    Disponiveis
                                                </Text>
                                            </Box>

                                            <Categorias
                                                categorias={categorias?.data}
                                                modeloFicha={modeloFicha}
                                                ficha={ficha}
                                                buscarFicha={buscarFicha}
                                            />

                                            <Flex
                                                direction="column"
                                                gap={4}
                                                p={4}
                                                bg="white"
                                                rounded={10}
                                            >
                                                <FormSelect
                                                    label="Status"
                                                    placeholder="Selecione o status"
                                                    error={
                                                        errors.status?.message
                                                    }
                                                    {...register("status")}
                                                >
                                                    <option value="aguardando">
                                                        Aguardando Preenchimento
                                                    </option>
                                                    <option value="preenchida">
                                                        Preenchida
                                                    </option>
                                                    <option value="em_analise">
                                                        Em análise
                                                    </option>
                                                    <option value="aprovada">
                                                        Aprovada
                                                    </option>
                                                    <option value="reprovada">
                                                        Reprovada
                                                    </option>
                                                    <option value="arquivada">
                                                        Arquivada
                                                    </option>
                                                </FormSelect>

                                                {watch("status") ==
                                                    "reprovada" && (
                                                        <Flex
                                                            direction="column"
                                                            gap={4}
                                                        >
                                                            <FormSelect
                                                                label="Motivo da Reprovação"
                                                                placeholder="Selecione o motivo"
                                                                error={
                                                                    errors
                                                                        .motivoReprovacaoId
                                                                        ?.message
                                                                }
                                                                {...register(
                                                                    "motivoReprovacaoId"
                                                                )}
                                                            >
                                                                {motivos?.data?.data?.map(
                                                                    (item: any) => (
                                                                        <option
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            value={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            {
                                                                                item.nome
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </FormSelect>

                                                            <FormTextarea
                                                                label="Observações sobre a reprovação"
                                                                placeholder="Digite o aqui as observações sobre a reprovação..."
                                                                error={
                                                                    errors
                                                                        .motivoReprovacao
                                                                        ?.message
                                                                }
                                                                {...register(
                                                                    "motivoReprovacao"
                                                                )}
                                                            />
                                                        </Flex>
                                                    )}
                                            </Flex>
                                        </Flex>
                                    )}
                                </Box>
                            </TabPanel>

                            <TabPanel px={0}>
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

                <ModalFooter gridGap={4}>
                    <Button onClick={() => onClose()}>Desistir</Button>
                    <Button
                        colorScheme="blue"
                        variant="solid"
                        isLoading={isSubmitting}
                        type="submit"
                        form="formRevisarFichaCadastral"
                    >
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const ModalRevisaoFichaCadastral2 = forwardRef(ModalBase);
