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
            {filtroAvancado && <Filtro filtroAvancado={filtroAvancado} />}
            <Box p={4} bg="white">
                <Flex justify="space-between" align="center">
                    {acoes}
                </Flex>
                <Paginacao {...paginatorProps} />
                <Tabela head={head} data={data} isLoading={isLoading} />
                <Paginacao {...paginatorProps} />
            </Box>
        </Flex>
    );
};
