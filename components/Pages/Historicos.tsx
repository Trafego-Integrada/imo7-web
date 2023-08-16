import { listarHistoricos } from "@/services/models/historico";
import {
    Avatar,
    Box,
    Flex,
    List,
    ListItem,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import moment from "moment";
import { useQuery } from "react-query";

export const Historicos = ({ tabela, tabelaId }) => {
    const { data } = useQuery(
        ["historicos", { tabela, tabelaId }],
        listarHistoricos
    );

    return (
        <Box>
            <List spacing={2}>
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
        </Box>
    );
};
