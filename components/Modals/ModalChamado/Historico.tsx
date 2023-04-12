import { FormInput } from "@/components/Form/FormInput";
import {
    cadastrarHistoricoChamado,
    listarHistoricosChamado,
} from "@/services/models/chamado";
import { queryClient } from "@/services/queryClient";
import { Box, Flex, Text, useToast, Button } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
const schema = yup.object({
    descricao: yup.string().required("Campo Obrigatório"),
});
export const Historico = ({ chamadoId }) => {
    const messagesEndRef = useRef();
    const toast = useToast();
    const {
        register,
        control,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const cadastrar = useMutation(cadastrarHistoricoChamado);
    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await cadastrar.mutateAsync({
                ...data,
                chamadoId,
            });
            toast({ title: "Chamado atualizado", status: "success" });
            queryClient.invalidateQueries(["historicosChamado"]);
        } catch (error) {
            console.log(error);
        }
    });
    const { data: historicos } = useQuery(
        ["historicosChamado", { chamadoId }],
        listarHistoricosChamado,
        {
            enabled: !!chamadoId,
        }
    );
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [historicos]);
    return (
        <Flex flexDir="column" gap={4} as="form" onSubmit={onSubmit}>
            <Flex flexDir="column" gap={4} overflow="auto" maxH={96}>
                {historicos?.map((historico) => (
                    <Box key={historico.id} bg="gray.100" p={4} rounded="lg">
                        <Text mb={4} fontSize="sm">
                            {historico?.usuario?.nome} - Adicionou um comentário{" "}
                            {moment(historico.createdAt).fromNow()}
                        </Text>
                        <Text>{historico.descricao} </Text>
                    </Box>
                ))}
                <Box ref={messagesEndRef} />
            </Flex>
            <FormInput
                size="sm"
                placeholder="Adicione um comentário..."
                {...register("descricao")}
                rightElement={
                    <Button
                        minW={32}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        type="submit"
                        isLoading={isSubmitting}
                        leftIcon={<FiSend />}
                    >
                        Comentar
                    </Button>
                }
            />
        </Flex>
    );
};
