import { FormTextarea } from "@/components/Form/FormTextarea";
import { aprovaCampo, reprovarCampo } from "@/services/models/fichaCadastral";
import {
    Box,
    Button,
    Flex,
    Icon,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import ReactFocusLock from "react-focus-lock";
import { FiCheck } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useMutation } from "react-query";

export const AnaliseCampo = ({ fichaId, campoCodigo, buscarFicha }) => {
    const toast = useToast();
    const [motivo, setMotivo] = useState("");
    const initialFocusRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const aprovar = useMutation(aprovaCampo, {
        onSuccess: () => {
            toast({
                title: "Campo aprovado",
            });
            buscarFicha.mutate(fichaId);
        },
    });
    const reprovar = useMutation(reprovarCampo, {
        onSuccess: () => {
            toast({
                title: "Campo reprovado",
            });
            onClose();
            buscarFicha.mutate(fichaId);
        },
    });

    return (
        <>
            <Tooltip label="Aprovar">
                <IconButton
                    size="xs"
                    variant="ghost"
                    colorScheme="green"
                    icon={<Icon as={FiCheck} />}
                    onClick={() => {
                        aprovar.mutate({
                            fichaId,
                            campoCodigo,
                        });
                    }}
                />
            </Tooltip>

            <Popover>
                <PopoverTrigger>
                    <IconButton
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        icon={
                            <Tooltip label="Reprovar">
                                <Icon as={IoClose} />
                            </Tooltip>
                        }
                        onClick={() => onOpen()}
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>
                        Informe o motivo da reprovação
                    </PopoverHeader>
                    <PopoverBody>
                        <FormTextarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Descreva o motivo..."
                        />
                    </PopoverBody>
                    <PopoverFooter>
                        <Flex justifyContent="flex-end">
                            <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => {
                                    reprovar.mutate({
                                        fichaId,
                                        campoCodigo,
                                        motivoReprovacao: motivo,
                                    });
                                }}
                            >
                                Reprovar
                            </Button>
                        </Flex>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        </>
    );
};
