import { Box, Flex, Text } from "@chakra-ui/react";
import { Filtro } from "./Filtro";
import { Paginacao } from "./Paginacao";
import { Tabela, TabelaProps } from "./Tabela";

interface TabelaPadraoProps extends TabelaProps {}

export const TabelaPadrao = ({
    head,
    data,
    filtroAvancado,
    paginatorProps,
    total,
    isLoading,
    acoes,
}: TabelaPadraoProps) => {
    return (
        <Flex gap={4} flexDir="column">
            <Filtro filtroAvancado={filtroAvancado} />
            <Box p={4} bg="white">
                <Flex justify="space-between" align="center">
                    <Text fontSize="xs" color="gray">
                        <Text as="span" fontWeight="bold" color="gray.700">
                            {total}
                        </Text>{" "}
                        registros encontrados
                    </Text>
                    {acoes}
                </Flex>
                <Paginacao {...paginatorProps} />
                <Tabela head={head} data={data} isLoading={isLoading} />
                <Paginacao {...paginatorProps} />
            </Box>
        </Flex>
    );
};
