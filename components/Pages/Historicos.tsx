import { listarHistoricos } from "@/services/models/historico";
import {
    Avatar,
    Box,
    Flex,
    IconButton,
    List,
    ListItem,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import moment from "moment";
import { useMutation, useQuery } from "react-query";
import { FormTextarea } from "../Form/FormTextarea";
import { FormInput } from "../Form/FormInput";
import { useEffect, useState } from "react";
import { imo7ApiService } from "@/services/apiServiceUsage";
import { queryClient } from "@/services/queryClient";
import { FiSend } from "react-icons/fi";

export const Historicos = ({ tabela, tabelaId }) => {
    const { data } = useQuery(
        ["historicos", { tabela, tabelaId }],
        listarHistoricos,
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    const [descricao, setDescricao] = useState("");
    const [eventoTratado, setEventoTratado] = useState(false);
    const cadastrarHistorico = useMutation(imo7ApiService("historico").create);

    const onCadastrar = async () => {
        await cadastrarHistorico.mutateAsync({ descricao, tabela, tabelaId });
        setDescricao("");
        setEventoTratado(false);
        queryClient.invalidateQueries(["historicos", { tabela, tabelaId }]);
    };
    useEffect(() => {
        const minhaLista = document.getElementById("minhaLista");
        if (minhaLista) {
            minhaLista.scrollTop = minhaLista.scrollHeight;
        }
    }, [data]);
    return (
        <Box>
            <List spacing={2} maxH={96} overflow="auto" id="minhaLista">
                {data?.map((item) => (
                    <ListItem
                        key={item.id}
                        as={Flex}
                        gap={2}
                        bg="gray.100"
                        justify="space-between"
                        p={2}
                        rounded="lg"
                        align="center"
                    >
                        <Flex gap={2} align="center">
                            <Avatar
                                name={item?.usuario?.nome}
                                size="xs"
                                src={item?.usuario?.avatar}
                            />
                            <Text fontSize="sm">
                                <Text as="span" fontWeight="bold">
                                    {item?.usuario?.nome}{" "}
                                </Text>
                                <Text as="span">{item.descricao}</Text>
                            </Text>
                        </Flex>
                        <Tooltip
                            label={moment(item.createdAt).format(
                                "DD/MM/YYYY HH:mm"
                            )}
                        >
                            <Text fontSize="xs" color="gray">
                                {moment(item.createdAt).fromNow()}
                            </Text>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
            <Flex py={2}>
                <FormInput
                    placeholder="Comente"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    onKeyPress={(e) => {
                        console.log(e);
                        if (e.key == "Enter" && !eventoTratado) {
                            e.preventDefault();
                            setEventoTratado(true);
                            onCadastrar();
                        }
                    }}
                    rightElement={
                        <IconButton
                            variant="ghost"
                            icon={<FiSend />}
                            onClick={() => onCadastrar()}
                        />
                    }
                />
            </Flex>
        </Box>
    );
};
