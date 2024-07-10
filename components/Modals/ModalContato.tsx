import { imo7ApiService } from "@/services/apiServiceUsage";
import {
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";

const schema = yup.object({
    nome: yup.string().required(),
    email: yup.string().required(),
    telefone: yup.string().required(),
});
const ModalBase = ({ }, ref) => {
    const modal = useDisclosure();
    const form = useForm({
        resolver: yupResolver(schema),
    });
    const toast = useToast()

    const contato = useMutation(imo7ApiService("contato").create, {
        onSuccess: () => {
            toast({
                title: 'Solicitação de demostração realizada com sucesso.',
                status: 'success'
            })
            modal.onClose()
            window.open(
                `https://web.whatsapp.com/send?phone=+5519997538567&text=Olá, sou ${form.watch(
                    "nome"
                )},\n\n Meu e-mail é ${form.watch(
                    "email"
                )}, e meu telefone ${form.watch(
                    "telefone"
                )}\n\n Quero saber mais sobre o IMO7`
            );
            form.reset()
        },
    });
    useImperativeHandle(ref, () => ({
        onOpen: () => {
            modal.onOpen();
        },
    }));
    return (
        <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Solicitar demonstração
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Flex
                        as="form"
                        onSubmit={form.handleSubmit(
                            async (data) => await contato.mutateAsync(data)
                        )}
                        gap={4}
                        flexDir="column"
                    >
                        <Input
                            bg="white"
                            placeholder="Qual seu nome?"
                            {...form.register("nome")}
                        />
                        <Input
                            bg="white"
                            placeholder="Qual seu e-mail"
                            {...form.register("email")}
                        />
                        <Input
                            bg="white"
                            placeholder="Qual seu telefone"
                            {...form.register("telefone")}
                        />
                        <Button
                            isLoading={form.formState.isSubmitting}
                            colorScheme="green"
                            type="submit"
                        >
                            Solicitar demonstração
                        </Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalContato = forwardRef(ModalBase);
