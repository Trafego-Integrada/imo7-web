import { formatoData, formatoValor } from "@/helpers/helpers";
import { anexarArquivoContrato } from "@/services/models/contrato";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
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
import { useForm } from "react-hook-form";

import { useMutation } from "react-query";
import { useDropzone } from "react-dropzone";
import { FormInput } from "@/components/Form/FormInput";

const ModalBase = ({ contratoId }, ref) => {
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
        reset,
        watch,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

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
    const onUpload = async (event) => {
        const formData = new FormData();
        formData.append("contratoId", contratoId);
        formData.append("nome", nome);
        formData.append("anexos", file[0]);
        await upload.mutateAsync(formData);
    };
    useImperativeHandle(ref, () => ({
        onOpen: async (id = null) => {
            setNome("");
            setFile([]);
            onOpen();
        },
    }));

    const files = file.map((file) => (
        <ListItem key={file.path}>
            {file.path} - {file.size} bytes
        </ListItem>
    ));
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent minW="60%">
                    <ModalHeader>Anexar Documento</ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>
                        <Box>
                            <FormInput
                                label="Nome do Anexo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                error={!nome && "Dê um nome para o arquivo"}
                            />
                        </Box>
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
                        <Box mt={4}>
                            <Heading size="md">Anexo</Heading>
                            <List>{files}</List>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Fechar
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => onUpload()}
                            disabled={!nome || file.length == 0 ? true : false}
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
