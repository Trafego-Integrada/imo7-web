import { FormInput } from "@/components/Form/FormInput";
import { NextChakraLink } from "@/components/NextChakraLink";
import { formatoData } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import {
    anexarArquivoChamado,
    enviarMensagemChamado,
    listarIntecoesChamados,
} from "@/services/models/chamado";
import { queryClient } from "@/services/queryClient";
import {
    Avatar,
    Box,
    Button,
    Flex,
    Icon,
    IconButton,
    Image,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
const schema = yup.object({
    mensagem: yup.string().required("Campo Obrigatório"),
});
export function Conversa({ data, chamado }) {
    const { usuario } = useAuth();
    const [files, setFiles] = useState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const enviar = useMutation(enviarMensagemChamado);
    const onSubmit = async (form) => {
        try {
            await enviar.mutateAsync({
                ...form,
                chamadoId: chamado.id,
                conversaId: data.id,
            });
            queryClient.invalidateQueries("interacoes");
            reset({ mensagem: "" });
        } catch (error) {
            console.log(error);
        }
    };
    const { data: interacoes } = useQuery(
        ["interacoes", { chamadoId: chamado.id, conversaId: data.id }],
        listarIntecoesChamados,
        {
            onSuccess: () => {
                const el = document.getElementById("mensagens" + data.id);
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }
            },
            // refetchInterval: 10000,
            // refetchOnReconnect: false,
            // refetchOnWindowFocus: false,
        }
    );
    const upload = useMutation(anexarArquivoChamado);
    const onUpload = async (event) => {
        const formData = new FormData();
        formData.append("chamadoId", chamado.id);
        formData.append("conversaId", data.id);
        formData.append("anexos", event.target.files[0]);
        await upload.mutateAsync(formData);
    };
    function checkURL(url) {
        return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    }
    return (
        <Box h="full">
            <VStack
                bg="white"
                h={{ base: 550, lg: 550 }}
                p={4}
                gridGap={4}
                overflow="auto"
                overscrollY="auto"
                scrollBehavior="auto"
                id={"mensagens" + data.id}
            >
                {interacoes?.map((item) => (
                    <Flex
                        key={item.id}
                        w="full"
                        gridGap={2}
                        flexDir={
                            usuario?.id == item.usuario?.id
                                ? "row-reverse"
                                : "row"
                        }
                    >
                        <Tooltip
                            label={`${item.usuario?.nome} ${
                                item.usuario.contratosInquilino?.filter(
                                    (i) => i.id == chamado.contratoId
                                ).length
                                    ? "(Inquilino)"
                                    : item.usuario.contratosProprietario?.filter(
                                          (i) => i.id == chamado.contratoId
                                      ).length
                                    ? "(Proprietário)"
                                    : item.usuario.contratosFiador?.filter(
                                          (i) => i.id == chamado.contratoId
                                      ).length
                                    ? "(Fiador)"
                                    : ""
                            }`}
                        >
                            <Avatar name={item.usuario?.nome} size="sm" />
                        </Tooltip>
                        <Box maxW="80%">
                            <Box
                                bg={
                                    usuario?.id == item.usuario?.id
                                        ? "blue.100"
                                        : "gray.100"
                                }
                                px={4}
                                py={2}
                                rounded="lg"
                            >
                                {item.anexos.length ? (
                                    <Flex flexWrap="wrap" gap={4}>
                                        {item.anexos.map((item) => (
                                            <Box key={item.id}>
                                                {checkURL(item.anexo) ? (
                                                    <>
                                                        <Image
                                                            src={item.anexo}
                                                            h={40}
                                                            alt={item.anexo}
                                                        />
                                                        <NextChakraLink
                                                            href={item.anexo}
                                                        >
                                                            <Button variant="link">
                                                                Baixar anexo
                                                            </Button>
                                                        </NextChakraLink>
                                                    </>
                                                ) : (
                                                    <NextChakraLink
                                                        href={item.anexo}
                                                    >
                                                        <Button variant="link">
                                                            Baixar anexo
                                                        </Button>
                                                    </NextChakraLink>
                                                )}
                                            </Box>
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text>{item.mensagem}</Text>
                                )}
                            </Box>
                            <Text ml={2} fontSize="xs" color="gray.400">
                                {moment(item.createdAt).startOf("d").fromNow()}
                            </Text>
                        </Box>
                    </Flex>
                ))}
            </VStack>
            <Flex as="form" onSubmit={handleSubmit(onSubmit)} w="full">
                <FormInput
                    leftElement={
                        <label>
                            <input
                                type="file"
                                onChange={(e) => {
                                    onUpload(e);
                                }}
                                style={{
                                    display: "none",
                                }}
                            />
                            <Icon as={GrAttachment} />
                        </label>
                    }
                    rightElement={
                        <IconButton
                            variant="ghost"
                            icon={<Icon as={FiSend} />}
                            colorScheme="gray"
                            position="absolute"
                            top={0}
                            right={4}
                            type="submit"
                            isLoading={isSubmitting}
                        />
                    }
                    placeholder="Escreva sua mensagem"
                    error={errors.mensagem?.message}
                    {...register("mensagem")}
                />
            </Flex>
        </Box>
    );
}
