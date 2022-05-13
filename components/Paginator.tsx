import { Button, Flex } from "@chakra-ui/react";

export const Paginator = ({ filtro, setFiltro }) => {
    return (
        <Flex justify="center" my={4} gap={4}>
            <Button
                disabled={filtro.pagina == 1 ? true : false}
                onClick={() => {
                    if (filtro.pagina > 1) {
                        setFiltro({
                            ...filtro,
                            pagina: filtro.pagina - 1,
                        });
                    }
                }}
                colorScheme="blue"
            >
                Voltar
            </Button>
            <Button
                onClick={() =>
                    setFiltro({
                        ...filtro,
                        pagina: filtro.pagina + 1,
                    })
                }
                colorScheme="blue"
            >
                Próximo
            </Button>
        </Flex>
    );
};
