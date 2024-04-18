import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { iniciarConversaChamado } from "@/services/models/chamado";
import { listarParticipantesContratos } from "@/services/models/contrato";
import { queryClient } from "@/services/queryClient";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
const schema = yup.object({
    participantes: yup.array().required("Campo Obrigatório"),
});
const ModalBase = ({ chamadoId, contratoId }, ref) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { data } = useQuery(
        [
            "participantesContrato",
            {
                contratoId,
            },
        ],
        listarParticipantesContratos
    );
    const {
        register,
        control,
        watch,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const enviar = useMutation(iniciarConversaChamado);
    const onSubmit = async (form) => {
        try {
            await enviar.mutateAsync({
                ...form,
                chamadoId: chamadoId,
                conversaId: data.id,
            });
            queryClient.invalidateQueries("conversas");
            queryClient.invalidateQueries("interacoes");
            queryClient.invalidateQueries("historicosChamado");
            onClose();
            reset({ mensagem: "" });
        } catch (error) {
            //console.log(error);
        }
    };
    useImperativeHandle(ref, () => ({
        onOpen: () => {
            onOpen();
        },
    }));
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Adicionar Conversa</ModalHeader>
                <ModalBody
                    id="formNovaConversa"
                    as="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        control={control}
                        name="participantes"
                        render={({ field }) => (
                            <FormMultiSelect
                                {...field}
                                isMulti
                                options={data && data}
                                getOptionLabel={(e) =>
                                    e.nome +
                                    (e.contratosInquilino.length
                                        ? " (Inquilino)"
                                        : e.contratosProprietario.length
                                        ? " (Proproprietário)"
                                        : e.contratosFiador.length
                                        ? " (Fiador)"
                                        : "?")
                                }
                                getOptionValue={(e) => e.id}
                                placeholder="Selecione os participantes"
                            />
                        )}
                    />
                </ModalBody>
                <ModalFooter gridGap={4}>
                    <Button onClick={onClose}>Desistir</Button>
                    <Button
                        colorScheme="blue"
                        isLoading={isSubmitting}
                        type="submit"
                        form="formNovaConversa"
                    >
                        Inciar conversa
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const ModalNovaConversa = forwardRef(ModalBase);
