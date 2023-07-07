import { Box, Flex } from "@chakra-ui/react";
import { Filtro } from "./Filtro";
import { Paginacao } from "./Paginacao";
import { Tabela, TabelaProps } from "./Tabela";

interface TabelaPadraoProps extends TabelaProps {}

export const TabelaPadrao = ({
    head,
    data,
    filtroAvancado,
    paginatorProps,
    isLoading,
    acoes,
}: TabelaPadraoProps) => {
    return (
        <Flex gap={4} flexDir="column">
            <Filtro filtroAvancado={filtroAvancado} />
            <Box p={4} bg="white">
                <Flex>{acoes}</Flex>
                <Paginacao {...paginatorProps} />
                <Tabela head={head} data={data} isLoading={isLoading} />
                <Paginacao {...paginatorProps} />
            </Box>
        </Flex>
    );
};
