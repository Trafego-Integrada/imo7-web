import { excluirIntegracao } from "@/services/database/integracao";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Icon,
    IconButton,
    toast,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import { useRef } from "react";
import { FiTrash } from "react-icons/fi";
import { useMutation } from "react-query";
import { queryClient } from "@/services/queryClient";

export function ExcluirIntegracao({ integracaoId }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const router = useRouter();
    const excluir = useMutation(excluirIntegracao, {
        onSuccess: () => {
            toast({
                title: "Integração excluida com sucesso",
                status: "success",
            });
            router.push("/integracoes");
        },
    });

    const onSubmit = async () => {
        try {
            await excluir.mutateAsync(integracaoId);
            queryClient.invalidateQueries(["integracoes"]);
        } catch (error) {}
    };
    return (
        <>
            <Button
                mr={3}
                variant="ghost"
                onClick={onOpen}
                leftIcon={<Icon as={FiTrash} />}
                colorScheme="red"
            >
                Excluir
            </Button>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Excluir integração
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Tem certeza que deseja excluir esta integração? Não
                            será possivel reveter a exclusão.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Desistir
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={() => onSubmit()}
                                ml={3}
                            >
                                Excluir
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
