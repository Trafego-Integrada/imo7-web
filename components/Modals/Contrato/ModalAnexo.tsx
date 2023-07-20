import { formatoData, formatoValor } from "@/helpers/helpers";
import {
    anexarArquivoContrato,
    atualizarAnexoContrato,
    buscarAnexoContrato,
    listarParticipantesContratos,
} from "@/services/models/contrato";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    GridItem,
    Heading,
    List,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { useMutation, useQuery } from "react-query";
import { useDropzone } from "react-dropzone";
import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";

const ModalBase = ({ contratoId, chamadoId }, ref) => {
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [file, setFile] = useState([]);
    const toast = useToast();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        multiple: false,
        onDrop(acceptedFiles, fileRejections, event) {
            setFile(acceptedFiles);
        },
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [contrato, setContrato] = useState({});

    const {
        control,
        reset,
        watch,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const buscar = useMutation(buscarAnexoContrato, {
        onSuccess: (data) => {
            reset(data);
        },
    });

    const upload = useMutation(anexarArquivoContrato, {
        onSuccess: () => {
            toast({
                title: "Arquivo anexado com sucesso",
                status: "success",
            });
            queryClient.invalidateQueries(["anexos"]);
            onClose();
        },
    });
    const atualizar = useMutation(atualizarAnexoContrato, {
        onSuccess: () => {
            toast({
                title: "Arquivo anexado com sucesso",
                status: "success",
            });
            queryClient.invalidateQueries(["anexos"]);
            onClose();
        },
    });
    const onUpload = async (data) => {
        const formData = new FormData();
        contratoId && formData.append("contratoId", contratoId);
        chamadoId && formData.append("chamadoId", chamadoId);
        formData.append("nome", data.nome);
        data.usuariosPermitidos &&
            formData.append(
                "usuariosPermitidos",
                JSON.stringify(data.usuariosPermitidos)
            );
        formData.append("anexos", file[0]);
        if (data.id) {
            formData.append("id", data.id);
            await atualizar.mutateAsync(formData);
        } else {
            await upload.mutateAsync(formData);
        }
    };
    useImperativeHandle(ref, () => ({
        onOpen: async (id = null) => {
            reset({});
            setNome("");
            setFile([]);
            if (id) {
                buscar.mutate(id);
                onOpen();
            } else {
                onOpen();
            }
        },
    }));

    const files = file.map((file) => (
        <ListItem key={file.path}>
            {file.path} - {file.size} bytes
        </ListItem>
    ));
    const { data: participantes } = useQuery(
        [
            "participantesContrato",
            {
                contratoId,
            },
        ],
        listarParticipantesContratos,
        {
            enabled: !!contratoId,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent minW="60%">
                    <ModalHeader>Anexar Documento</ModalHeader>

                    <ModalCloseButton />

                    <ModalBody
                        as="form"
                        id="formAnexo"
                        onSubmit={handleSubmit(onUpload)}
                    >
                        <Box>
                            <FormInput
                                label="Nome do Anexo"
                                {...register("nome")}
                            />
                        </Box>
                        {!watch("id") && (
                            <Flex
                                mt={4}
                                p={12}
                                borderWidth={2}
                                borderStyle="dashed"
                                align="center"
                                {...getRootProps({ className: "dropzone" })}
                            >
                                <input {...getInputProps()} />
                                <Text color="gray">
                                    Arraste o arquivo ou clique aqui
                                </Text>
                            </Flex>
                        )}
                        <Box mt={4}>
                            <Heading size="md">Anexo</Heading>
                            <List>{files}</List>
                        </Box>
                        <GridItem colSpan={2}>
                            <Controller
                                control={control}
                                name="usuariosPermitidos"
                                render={({ field }) => (
                                    <FormMultiSelect
                                        size="sm"
                                        {...field}
                                        isMulti
                                        options={participantes && participantes}
                                        getOptionLabel={(e) =>
                                            e.nome +
                                            (e.contratosInquilino?.length
                                                ? " (Inquilino)"
                                                : e.contratosProprietario
                                                      ?.length
                                                ? " (Proproprietário)"
                                                : e.contratosFiador?.length
                                                ? " (Fiador)"
                                                : "?")
                                        }
                                        getOptionValue={(e) => e.id}
                                        placeholder="Selecione os participantes"
                                        error={
                                            errors.usuariosPermitidos?.message
                                        }
                                        disabled={
                                            watch("contrato") ? false : true
                                        }
                                    />
                                )}
                            />
                        </GridItem>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Fechar
                        </Button>
                        <Button
                            form="formAnexo"
                            type="submit"
                            colorScheme="blue"
                        >
                            Anexar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalAnexo = forwardRef(ModalBase);
