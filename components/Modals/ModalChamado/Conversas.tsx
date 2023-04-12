import { listarConversas } from "@/services/models/chamado";
import {
    Box,
    Tabs,
    TabList,
    Tab,
    Text,
    IconButton,
    Icon,
    TabPanels,
    TabPanel,
    Tooltip,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { useQuery } from "react-query";
import { ModalNovaConversa } from "../NovaConversa";
import { Conversa } from "./Conversa";

export const Conversas = ({ chamado }) => {
    const modal = useRef();
    const { data: conversas } = useQuery(
        ["conversas", { chamadoId: chamado?.id }],
        listarConversas
        // {
        //     refetchInterval: 10000,
        //     refetchOnReconnect: false,
        //     refetchOnWindowFocus: false,
        // }
    );
    return (
        <>
            <Tabs size="sm" variant="soft-rounded">
                <TabList>
                    {conversas?.map((item, index) => (
                        <Tab key={index}>
                            <Text>
                                {item.participantes?.map((item, indexP) => (
                                    <Text as="span" key={item.id}>
                                        {indexP > 0 && ", "}
                                        {item.nome}
                                    </Text>
                                ))}
                            </Text>
                        </Tab>
                    ))}
                    <Tooltip label="Nova conversa">
                        <IconButton
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            icon={<Icon as={FiPlus} />}
                            onClick={() => modal.current.onOpen()}
                        />
                    </Tooltip>
                </TabList>
                <TabPanels>
                    {conversas?.map((tab, index) => (
                        <TabPanel key={index}>
                            <Conversa data={tab} chamado={chamado} />
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
            <ModalNovaConversa
                ref={modal}
                chamadoId={chamado?.id}
                contratoId={chamado?.contratoId}
            />
        </>
    );
};
