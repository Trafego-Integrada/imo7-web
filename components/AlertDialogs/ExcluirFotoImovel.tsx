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
import { useRef } from "react";
import { FiTrash } from "react-icons/fi";
import { useMutation } from "react-query";
import { excluirFoto } from "@/services/database/imovel";
import { queryClient } from "@/services/queryClient";

export function ExcluirFotoImovel({ imovelId, fotoId }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const excluir = useMutation(excluirFoto, {
        onSuccess: () => {
            toast({
                title: "Foto excluida com sucesso",
                status: "success",
            });
            onClose();
        },
    });

    const onSubmit = async () => {
        try {
            await excluir.mutateAsync({ imovelId, fotoId });
            queryClient.invalidateQueries(["listaFotos"]);
        } catch (error) {}
    };
    return (
        <>
            <IconButton
                size="xs"
                right={0}
                pos="absolute"
                icon={<Icon as={FiTrash} />}
                colorScheme="red"
                onClick={onOpen}
            />

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Excluir foto
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Tem certeza que deseja excluir esta foto? Não será
                            possivel reveter a exclusão.
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
