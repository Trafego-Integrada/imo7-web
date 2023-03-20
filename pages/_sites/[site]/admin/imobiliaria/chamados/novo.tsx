import { withSSRAuth } from "@/utils/withSSRAuth";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/textarea";
import { NextPage } from "next";
import { Input } from "@/components/Forms/Input";
import { Select } from "@/components/Forms/Select";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";

const AbrirChamado: NextPage = () => {
    return (
        <LayoutPainel>
            <Box>
                <Flex flexDirection="column" align="center">
                    <Heading size="lg" textAlign="center" color="gray.600">
                        Abertura de chamado
                    </Heading>
                    <Text
                        my={2}
                        maxW={"2xl"}
                        textAlign="center"
                        color="gray.500"
                        fontSize="xs"
                        lineHeight="none"
                    >
                        Aqui, você poderá abrir um chamado à imobiliaria, para
                        resolução de problemas, dúvidas entre outros assuntos
                        relacionados ao seu contrato.
                    </Text>
                </Flex>
                <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem as={Select} placeholder="Departamento" />
                    <GridItem as={Select} placeholder="Assunto" />
                    <GridItem colSpan={2}>
                        <Input placeholder="Titulo" />
                    </GridItem>
                    <GridItem
                        colSpan={2}
                        as={Textarea}
                        placeholder="Mensagem"
                    />
                </Grid>
                <Flex justify="right" mt={4}>
                    <Button colorScheme="blue" variant="solid">
                        Enviar mensagem
                    </Button>
                </Flex>
            </Box>
        </LayoutPainel>
    );
};

export default AbrirChamado;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
